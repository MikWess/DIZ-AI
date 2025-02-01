import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { processRiskAnalysis, processPreparations } from '@/lib/openai-helpers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const ALL_POSSIBLE_DISASTERS = {
  earthquake: {
    id: 'earthquake',
    title: 'Earthquakes',
    emoji: '⚠️',
    description: 'Risk of ground shaking, potential landslides, and structural damage.',
    bgColor: 'bg-red-50'
  },
  wildfire: {
    id: 'wildfire',
    title: 'Wildfires',
    emoji: '🔥',
    description: 'Risk of rapid-spreading fires in dry conditions and mountainous terrain.',
    bgColor: 'bg-amber-50'
  },
  flood: {
    id: 'flood',
    title: 'Flash Floods',
    emoji: '💧',
    description: 'Risk of sudden flooding from heavy rainfall or rapid snowmelt.',
    bgColor: 'bg-blue-50'
  },
  winter: {
    id: 'winter',
    title: 'Severe Winter Storms',
    emoji: '❄️',
    description: 'Risk of heavy snowfall, extreme cold, and dangerous road conditions.',
    bgColor: 'bg-cyan-50'
  },
  landslide: {
    id: 'landslide',
    title: 'Landslides',
    emoji: '⛰️',
    description: 'Risk of earth movement on steep terrain, especially after heavy rain or earthquakes.',
    bgColor: 'bg-amber-50'
  },
  tornado: {
    id: 'tornado',
    title: 'Tornadoes',
    emoji: '🌪️',
    description: 'Risk of violent rotating columns of air with destructive winds.',
    bgColor: 'bg-purple-50'
  },
  hurricane: {
    id: 'hurricane',
    title: 'Hurricanes',
    emoji: '🌀',
    description: 'Risk of strong winds, heavy rainfall, storm surge, and flooding.',
    bgColor: 'bg-indigo-50'
  },
  drought: {
    id: 'drought',
    title: 'Drought',
    emoji: '🏜️',
    description: 'Risk of water shortages and increased fire danger.',
    bgColor: 'bg-yellow-50'
  },
  heatwave: {
    id: 'heatwave',
    title: 'Heat Waves',
    emoji: '🌡️',
    description: 'Risk of extreme temperatures and heat-related illnesses.',
    bgColor: 'bg-orange-50'
  },
  tsunami: {
    id: 'tsunami',
    title: 'Tsunamis',
    emoji: '🌊',
    description: 'Risk of powerful ocean waves following earthquakes or underwater landslides.',
    bgColor: 'bg-sky-50'
  }
};

export async function POST(req: Request) {
  try {
    const { location } = await req.json();

    // First OpenAI call to analyze location and determine disaster risks
    const riskAnalysisPrompt = `Analyze ${location} for natural disaster risks. Consider geographical features, historical data, climate patterns, and typical weather conditions.

For each potential natural disaster, rate the risk as high, medium, or low, and explain why using specific geographical and historical data points. Focus only on relevant natural disasters for this location.

Format each disaster as:
[Disaster Name]: [Risk Level] - [Detailed explanation with specific data points and historical evidence]`;

    const riskAnalysis = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: riskAnalysisPrompt }],
      temperature: 0.7,
    });

    const processedRisks = processRiskAnalysis(riskAnalysis.choices[0].message.content || '');

    // Second OpenAI call to generate preparation recommendations
    const prepPrompt = `Based on the following disaster risks for ${location}:

${riskAnalysis.choices[0].message.content}

Generate a comprehensive preparation plan including:
1. Immediate actions (most urgent steps to take)
2. Short-term preparations (within 1-3 months)
3. Long-term planning (3+ months)
4. Emergency supplies needed (categorized by type and marked as critical/important/recommended)
5. Location-specific considerations

Format the response with clear sections numbered 1-5, using bullet points for lists.`;

    const preparations = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prepPrompt }],
      temperature: 0.7,
    });

    const processedPreps = processPreparations(preparations.choices[0].message.content || '');

    // Create disaster cards based on the risk analysis
    const disasterCards = {
      high: processedRisks.riskExplanations.high.map(risk => ({
        ...ALL_POSSIBLE_DISASTERS[risk.disaster.toLowerCase().replace(/\s+/g, '') as keyof typeof ALL_POSSIBLE_DISASTERS],
        risk: 'high' as const,
        explanation: risk.explanation
      })),
      medium: processedRisks.riskExplanations.medium.map(risk => ({
        ...ALL_POSSIBLE_DISASTERS[risk.disaster.toLowerCase().replace(/\s+/g, '') as keyof typeof ALL_POSSIBLE_DISASTERS],
        risk: 'medium' as const,
        explanation: risk.explanation
      })),
      low: processedRisks.riskExplanations.low.map(risk => ({
        ...ALL_POSSIBLE_DISASTERS[risk.disaster.toLowerCase().replace(/\s+/g, '') as keyof typeof ALL_POSSIBLE_DISASTERS],
        risk: 'low' as const,
        explanation: risk.explanation
      }))
    };

    // Structure the final response
    const analysisResult = {
      location: {
        city: location.split(',')[0].trim(),
        state: location.split(',')[1]?.trim() || '',
        formatted_address: location,
      },
      activeDisasters: processedRisks.activeDisasters,
      riskExplanations: processedRisks.riskExplanations,
      disasterCards,
      customSupplies: processedPreps.supplies.map(category => ({
        category: category.category,
        items: category.items.map(item => ({
          name: item.name,
          links: {
            amazon: `https://www.amazon.com/s?k=${encodeURIComponent(item.name)}+emergency`,
            walmart: `https://www.walmart.com/search?q=${encodeURIComponent(item.name)}+emergency`
          }
        })),
        priority: category.items[0]?.priority || 'medium',
        estimatedCost: '$50-200',
        reason: `Essential for ${processedRisks.activeDisasters.join(', ')} preparedness`
      })),
      recommendations: {
        immediate: processedPreps.immediate,
        shortTerm: processedPreps.shortTerm,
        longTerm: processedPreps.longTerm
      },
      disasterResponses: {
        earthquake: {
          beforeSteps: [
            'Secure heavy furniture and appliances to walls',
            'Install latches on cabinets',
            'Learn how to shut off gas, water, and electricity',
            'Create a family communication plan',
            'Practice "Drop, Cover, and Hold On" drills'
          ],
          duringSteps: [
            'Drop to the ground',
            'Take cover under a sturdy desk or table',
            'Hold on until the shaking stops',
            'Stay away from windows and exterior walls',
            'If in bed, stay there and protect your head with a pillow'
          ],
          afterSteps: [
            'Check for injuries and provide first aid',
            'Listen to news for emergency information',
            'Check for gas leaks and damage',
            'Be prepared for aftershocks',
            'Document damage for insurance'
          ]
        },
        wildfire: {
          beforeSteps: [
            'Create defensible space around your home',
            'Clear leaves and debris from gutters',
            'Install ember-resistant vents',
            'Prepare emergency supply kit',
            'Plan multiple evacuation routes'
          ],
          duringSteps: [
            'Follow evacuation orders immediately',
            'Close all windows and doors',
            'Remove flammable window coverings',
            'Turn on exterior lights for visibility',
            'Keep emergency supplies accessible'
          ],
          afterSteps: [
            'Wait for official notice before returning home',
            'Document damage with photos',
            'Check roof and exterior for embers',
            'Monitor local news for updates',
            'Contact insurance company if needed'
          ]
        },
        flood: {
          beforeSteps: [
            'Elevate electrical components',
            'Install check valves in plumbing',
            'Waterproof basement walls',
            'Create emergency supply kit',
            'Know evacuation routes to higher ground'
          ],
          duringSteps: [
            'Move to higher ground immediately',
            'Avoid walking through flood waters',
            'Do not drive through flooded areas',
            'Listen to emergency instructions',
            'Keep emergency supplies accessible'
          ],
          afterSteps: [
            'Avoid flood waters',
            'Document damage with photos',
            'Clean and disinfect everything that got wet',
            'Watch for updates from authorities',
            'Begin cleanup when safe'
          ]
        },
        winter: {
          beforeSteps: [
            'Insulate pipes and allow faucets to drip',
            'Service heating equipment',
            'Install weather stripping',
            'Stock up on winter supplies',
            'Prepare emergency car kit'
          ],
          duringSteps: [
            'Stay indoors if possible',
            'Keep dry and in warm layers',
            'Avoid overexertion when shoveling',
            'Watch for signs of hypothermia',
            'Use generators outdoors only'
          ],
          afterSteps: [
            'Check on neighbors',
            'Clear snow from vents and pipes',
            'Remove snow from roof if safe',
            'Document any damage',
            'Watch for downed power lines'
          ]
        }
      },
      actionPlans: [
        {
          phase: 'immediate',
          title: 'Emergency Communication Plan',
          steps: [
            'Create a contact list of family members and emergency services',
            'Designate an out-of-area contact as a central point of communication',
            'Program emergency contacts in everyone\'s phones',
            'Plan how to reconnect if separated',
            'Share copies of the plan with all family members'
          ],
          timeline: '1-2 days',
          resources: [
            'Ready.gov family communication templates',
            'Red Cross emergency contact cards',
            'Local emergency management office'
          ]
        },
        {
          phase: 'short-term',
          title: 'Home Preparation',
          steps: [
            'Install smoke detectors and carbon monoxide alarms',
            'Create emergency supply kits for home and vehicles',
            'Learn how to shut off utilities',
            'Secure important documents in a waterproof container',
            'Take photos/videos of property for insurance'
          ],
          timeline: '1-2 weeks',
          resources: [
            'Home safety checklist',
            'Local hardware store',
            'Insurance provider resources'
          ]
        },
        {
          phase: 'long-term',
          title: 'Community Integration',
          steps: [
            'Join or create a neighborhood emergency response team',
            'Participate in community emergency drills',
            'Establish relationships with neighbors',
            'Learn about local emergency shelters',
            'Consider getting trained in first aid and CPR'
          ],
          timeline: '1-2 months',
          resources: [
            'Community emergency response team (CERT) program',
            'Local Red Cross chapter',
            'Neighborhood watch program'
          ]
        }
      ],
      evacuationRoutes: [
        {
          name: 'Primary Route',
          description: 'Main evacuation route using major highways',
          destinations: ['Local Emergency Shelter', 'Regional Safe Zone']
        },
        {
          name: 'Secondary Route',
          description: 'Alternate route using local roads',
          destinations: ['Community Center', 'Backup Meeting Point']
        }
      ],
      emergencyContacts: [
        {
          name: 'Emergency Services',
          number: '911',
          description: 'For immediate emergency assistance'
        },
        {
          name: 'FEMA',
          number: '1-800-621-3362',
          description: 'Federal Emergency Management Agency'
        },
        {
          name: 'Local Police (Non-Emergency)',
          number: '311',
          description: 'For non-emergency assistance'
        },
        {
          name: 'Poison Control',
          number: '1-800-222-1222',
          description: 'For exposure to harmful substances'
        }
      ]
    };

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze location' },
      { status: 500 }
    );
  }
} 