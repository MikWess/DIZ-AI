import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getWolframData } from '@/lib/wolfram';
import { getWeatherData } from '@/lib/weather';
import { getGeocodingData } from '@/lib/geocoding';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

interface AnalysisRequest {
  location: string;
  address?: string;
  householdSize: string;
  housingType: string;
  specialNeeds: boolean;
  pets: boolean;
  mobilityIssues: boolean;
  customCategories: Array<{
    name: string;
    description: string;
  }>;
  additionalNotes?: string;
  preferredLanguage: string;
  budget: string;
  timeframe: string;
}

function generateShoppingLinks(items: string[]) {
  return items.map(item => ({
    name: item,
    links: {
      amazon: `https://www.amazon.com/s?k=${encodeURIComponent(item.replace(/\s+/g, '+'))}+emergency`,
      walmart: `https://www.walmart.com/search?q=${encodeURIComponent(item.replace(/\s+/g, '+'))}+emergency`
    }
  }));
}

function determineDisasterRisk(location: any, weatherData: any, wolframData: any) {
  const risks = [];
  
  // Earthquake risk
  if (wolframData.seismicActivity > 2) {
    risks.push('earthquake');
  }
  
  // Wildfire risk
  if (weatherData.humidity < 30 && weatherData.temperature > 85) {
    risks.push('wildfire');
  }
  
  // Flood risk
  if (wolframData.elevation < 50 || wolframData.annualRainfall > 40) {
    risks.push('flood');
  }
  
  // Winter storm risk
  if (weatherData.temperature < 32 || wolframData.annualSnowfall > 20) {
    risks.push('winter');
  }
  
  // Hurricane risk
  if (wolframData.distanceToCoast < 100) {
    risks.push('hurricane');
  }
  
  // Tornado risk
  if (wolframData.tornadoFrequency > 1) {
    risks.push('tornado');
  }
  
  // Heat wave risk
  if (weatherData.temperature > 95) {
    risks.push('heatwave');
  }
  
  // Tsunami risk
  if (wolframData.distanceToCoast < 50 && wolframData.seismicActivity > 3) {
    risks.push('tsunami');
  }
  
  // Drought risk
  if (wolframData.annualRainfall < 20) {
    risks.push('drought');
  }
  
  // Landslide risk
  if (wolframData.elevation > 1000 && wolframData.annualRainfall > 30) {
    risks.push('landslide');
  }
  
  return risks;
}

function generateEmergencySupplies(risks: string[], householdSize: number, pets: boolean, specialNeeds: boolean, budget: string) {
  const supplies = [
    {
      category: 'Water & Food',
      items: generateShoppingLinks([
        'Water Storage Containers',
        'Water Filtration System',
        'Non-perishable Food',
        'Manual Can Opener',
        'Portable Stove',
        'Cooking Utensils'
      ]),
      reason: `${householdSize} person household needs at least ${householdSize * 3} gallons of water and ${householdSize * 3} days of food`,
      priority: 'high',
      estimatedCost: '$150-300'
    },
    {
      category: 'First Aid & Medical',
      items: generateShoppingLinks([
        'First Aid Kit',
        'Prescription Medications',
        'Pain Relievers',
        'Bandages',
        'Antiseptic Wipes',
        'Emergency Blankets'
      ]),
      reason: 'Essential medical supplies for emergency response',
      priority: 'high',
      estimatedCost: '$100-200'
    },
    {
      category: 'Communication & Lighting',
      items: generateShoppingLinks([
        'Emergency Radio',
        'Flashlights',
        'Extra Batteries',
        'Solar Charger',
        'Emergency Whistle',
        'Glow Sticks'
      ]),
      reason: 'Stay informed and visible during power outages',
      priority: 'high',
      estimatedCost: '$100-150'
    }
  ];

  if (pets) {
    supplies.push({
      category: 'Pet Supplies',
      items: generateShoppingLinks([
        'Pet Food (2-week supply)',
        'Pet First Aid Kit',
        'Pet Carrier',
        'Pet ID Tags',
        'Pet Medications',
        'Pet Waste Supplies'
      ]),
      reason: 'Essential supplies for pet care during emergencies',
      priority: 'high',
      estimatedCost: '$100-200'
    });
  }

  if (specialNeeds) {
    supplies.push({
      category: 'Special Needs',
      items: generateShoppingLinks([
        'Backup Medical Devices',
        'Extra Medications',
        'Medical Documentation',
        'Specialized First Aid Supplies',
        'Mobility Aid Supplies',
        'Medical Alert Items'
      ]),
      reason: 'Critical supplies for special medical needs',
      priority: 'high',
      estimatedCost: '$200-400'
    });
  }

  if (risks.includes('winter')) {
    supplies.push({
      category: 'Winter Weather',
      items: generateShoppingLinks([
        'Snow Shovel',
        'Ice Melt',
        'Thermal Blankets',
        'Winter Clothing',
        'Hand Warmers',
        'Snow Chains'
      ]),
      reason: 'Essential for winter storm survival',
      priority: 'high',
      estimatedCost: '$150-300'
    });
  }

  if (risks.includes('hurricane') || risks.includes('tornado')) {
    supplies.push({
      category: 'Storm Protection',
      items: generateShoppingLinks([
        'Plywood Sheets',
        'Tarps',
        'Rope',
        'Duct Tape',
        'Plastic Sheeting',
        'Sand Bags'
      ]),
      reason: 'Protect your home from strong winds and rain',
      priority: 'high',
      estimatedCost: '$200-400'
    });
  }

  return supplies;
}

function generateDisasterResponses(risks: string[], householdSize: number, pets: boolean) {
  const responses: Record<string, any> = {};
  
  risks.forEach(risk => {
    switch (risk) {
      case 'earthquake':
        responses[risk] = {
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
        };
        break;
      // Add cases for other disaster types
    }
  });
  
  return responses;
}

function generateActionPlans(risks: string[], householdSize: number, pets: boolean) {
  return [
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
  ];
}

export async function POST(req: Request) {
  try {
    const data: AnalysisRequest = await req.json();
    
    // Get location data
    const geocodingData = await getGeocodingData(data.location);
    if (!geocodingData) {
      throw new Error('Unable to find location');
    }
    
    // Get weather and additional data
    const [weatherData, wolframData] = await Promise.all([
      getWeatherData(geocodingData.lat, geocodingData.lng),
      getWolframData(data.location, data.address)
    ]);
    
    // Determine disaster risks
    const activeDisasters = determineDisasterRisk(geocodingData, weatherData, wolframData);
    
    // Generate customized emergency supplies
    const customSupplies = generateEmergencySupplies(
      activeDisasters,
      parseInt(data.householdSize),
      data.pets,
      data.specialNeeds,
      data.budget
    );
    
    // Generate disaster-specific responses
    const disasterResponses = generateDisasterResponses(
      activeDisasters,
      parseInt(data.householdSize),
      data.pets
    );
    
    // Generate action plans
    const actionPlans = generateActionPlans(
      activeDisasters,
      parseInt(data.householdSize),
      data.pets
    );
    
    // Generate specialized recommendations
    const specializedRecommendations = [
      {
        category: 'Home Modifications',
        recommendations: [
          'Install storm shutters or plywood sheets for window protection',
          'Reinforce garage doors against high winds',
          'Secure outdoor furniture and decorations',
          'Clear gutters and drainage systems',
          'Trim trees and remove dead branches'
        ],
        priority: 'high'
      },
      {
        category: 'Family Preparedness',
        recommendations: [
          'Create and practice a family evacuation plan',
          'Designate meeting points inside and outside your neighborhood',
          'Prepare emergency kits for home, work, and vehicles',
          'Learn CPR and basic first aid',
          'Store important documents in a waterproof container'
        ],
        priority: 'high'
      },
      {
        category: 'Communication',
        recommendations: [
          'Program emergency contacts in all family phones',
          'Purchase a battery-powered or hand-crank emergency radio',
          'Sign up for local emergency alerts',
          'Create a neighborhood communication plan',
          'Identify out-of-area contacts for emergency coordination'
        ],
        priority: 'medium'
      }
    ];
    
    const result = {
      location: {
        city: geocodingData.city,
        state: geocodingData.state,
        zipCode: geocodingData.zipCode,
        formatted_address: geocodingData.formatted_address,
        coordinates: {
          lat: geocodingData.lat,
          lng: geocodingData.lng
        }
      },
      activeDisasters,
      customSupplies,
      disasterResponses,
      actionPlans,
      specializedRecommendations,
      recommendations: {
        immediate: [
          'Create a family emergency communication plan',
          'Assemble emergency supply kits for home and vehicles',
          'Sign up for local emergency alerts',
          'Learn how to shut off utilities',
          'Store important documents in a waterproof container'
        ],
        shortTerm: [
          'Install emergency safety devices',
          'Create and practice evacuation plans',
          'Build emergency savings fund',
          'Review and update insurance policies',
          'Join local emergency response teams'
        ],
        longTerm: [
          'Retrofit home for disaster resistance',
          'Develop neighborhood support network',
          'Take disaster preparedness courses',
          'Create long-term food and water storage',
          'Establish backup power solutions'
        ]
      },
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
          name: 'Local Police (Non-Emergency)',
          number: wolframData.localPolice || 'Check local listings',
          description: 'For non-emergency police assistance'
        },
        {
          name: 'Local Fire Department',
          number: wolframData.localFire || 'Check local listings',
          description: 'For fire-related emergencies'
        },
        {
          name: 'Nearest Hospital',
          number: wolframData.nearestHospital?.phone || 'Check local listings',
          description: wolframData.nearestHospital?.name || 'Nearest Emergency Medical Facility'
        }
      ]
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze location' },
      { status: 500 }
    );
  }
} 