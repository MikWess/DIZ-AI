'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DisasterType {
  id: string;
  title: string;
  emoji: string;
  description: string;
  preparedness: string;
  bgColor: string;
  risk: 'high' | 'medium' | 'low';
}

interface SupplyItem {
  name: string;
  links: {
    amazon: string;
    walmart: string;
  };
}

interface SupplyCategory {
  category: string;
  items: SupplyItem[];
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost: string;
}

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
}

interface Location {
  city: string;
  state: string;
  zipCode: string;
  formatted_address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface AnalysisResult {
  location: {
    city: string;
    state: string;
    zipCode: string;
    formatted_address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  activeDisasters: string[];
  customSupplies: SupplyCategory[];
  preparednessScore: {
    overall: number;
    categories: {
      supplies: number;
      planning: number;
      communication: number;
      evacuation: number;
    };
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  evacuationRoutes: Array<{
    name: string;
    description: string;
    destinations: string[];
  }>;
  emergencyContacts: EmergencyContact[];
  printableVersion?: string;
}

interface ActionPlan {
  phase: 'immediate' | 'short-term' | 'long-term';
  title: string;
  steps: string[];
  timeline: string;
  resources: string[];
}

interface DisasterResponse {
  beforeSteps: string[];
  duringSteps: string[];
  afterSteps: string[];
  supplies: string[];
  contacts: string[];
}

interface DisasterRisk {
  id: string;
  title: string;
  description: string;
  emoji: string;
  bgColor: string;
}

interface WolframData {
  seismicActivity: number;
  elevation: number;
  annualRainfall: number;
  annualSnowfall: number;
  distanceToCoast: number;
  tornadoFrequency: number;
  emergencyContacts: Array<{
    name: string;
    phone: string;
  }>;
}

interface WeatherData {
  temperature: number;
  humidity: number;
}

interface DisasterCard {
  id: string;
  title: string;
  emoji: string;
  description: string;
  bgColor: string;
  risk: 'high' | 'medium' | 'low';
  explanation: string;
}

interface EnhancedAnalysisResult extends AnalysisResult {
  location: Location;
  wolframData: WolframData;
  weatherData: WeatherData;
  disasterResponses: Record<string, DisasterResponse>;
  actionPlans: ActionPlan[];
  specializedRecommendations: {
    category: string;
    recommendations: string[];
    priority: 'high' | 'medium' | 'low';
  }[];
  disasterCards: {
    high: DisasterCard[];
    medium: DisasterCard[];
    low: DisasterCard[];
  };
}

const ALL_POSSIBLE_DISASTERS: DisasterType[] = [
  {
    id: 'earthquake',
    title: 'Earthquakes',
    emoji: '⚠️',
    description: 'Risk of ground shaking, potential landslides, and structural damage.',
    preparedness: 'Secure heavy furniture, practice "Drop, Cover, and Hold On", and identify safe spots in each room.',
    bgColor: 'bg-red-50',
    risk: 'high'
  },
  {
    id: 'wildfire',
    title: 'Wildfires',
    emoji: '🔥',
    description: 'Risk of rapid-spreading fires in dry conditions and mountainous terrain.',
    preparedness: 'Create defensible space around your home, have an evacuation plan, and stay informed about fire conditions.',
    bgColor: 'bg-amber-50',
    risk: 'high'
  },
  {
    id: 'flood',
    title: 'Flash Floods',
    emoji: '💧',
    description: 'Risk of sudden flooding from heavy rainfall or rapid snowmelt.',
    preparedness: 'Know evacuation routes, avoid low-lying areas during heavy rain, and consider flood insurance.',
    bgColor: 'bg-blue-50',
    risk: 'medium'
  },
  {
    id: 'winter',
    title: 'Severe Winter Storms',
    emoji: '❄️',
    description: 'Risk of heavy snowfall, extreme cold, and dangerous road conditions.',
    preparedness: 'Winterize your home, keep emergency supplies in your vehicle, and stay informed about weather conditions.',
    bgColor: 'bg-cyan-50',
    risk: 'medium'
  },
  {
    id: 'landslide',
    title: 'Landslides',
    emoji: '⛰️',
    description: 'Risk of earth movement on steep terrain, especially after heavy rain or earthquakes.',
    preparedness: 'Learn to recognize warning signs, identify evacuation routes, and avoid building on steep slopes.',
    bgColor: 'bg-amber-50',
    risk: 'medium'
  },
  {
    id: 'tornado',
    title: 'Tornadoes',
    emoji: '🌪️',
    description: 'Risk of violent rotating columns of air with destructive winds.',
    preparedness: 'Identify safe rooms, monitor weather alerts, and practice tornado drills.',
    bgColor: 'bg-purple-50',
    risk: 'high'
  },
  {
    id: 'hurricane',
    title: 'Hurricanes',
    emoji: '🌀',
    description: 'Risk of strong winds, heavy rainfall, storm surge, and flooding.',
    preparedness: 'Board up windows, prepare emergency supplies, and know evacuation routes.',
    bgColor: 'bg-indigo-50',
    risk: 'high'
  },
  {
    id: 'drought',
    title: 'Drought',
    emoji: '🏜️',
    description: 'Risk of water shortages and increased fire danger.',
    preparedness: 'Conserve water, maintain drought-resistant landscaping, and follow local water restrictions.',
    bgColor: 'bg-yellow-50',
    risk: 'medium'
  },
  {
    id: 'heatwave',
    title: 'Heat Waves',
    emoji: '🌡️',
    description: 'Risk of extreme temperatures and heat-related illnesses.',
    preparedness: 'Stay hydrated, limit outdoor activity, and check on vulnerable neighbors.',
    bgColor: 'bg-orange-50',
    risk: 'high'
  },
  {
    id: 'tsunami',
    title: 'Tsunamis',
    emoji: '🌊',
    description: 'Risk of powerful ocean waves following earthquakes or underwater landslides.',
    preparedness: 'Know evacuation routes, recognize warning signs, and move to higher ground immediately.',
    bgColor: 'bg-sky-50',
    risk: 'high'
  }
];

const EMERGENCY_CONTACTS: EmergencyContact[] = [
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
    name: 'Poison Control',
    number: '1-800-222-1222',
    description: 'For exposure to harmful substances'
  },
  {
    name: 'Red Cross',
    number: '1-800-733-2767',
    description: 'Disaster relief and emergency assistance'
  }
];

// Update risk level determination
function getRiskLevel(disaster: DisasterRisk, result: EnhancedAnalysisResult): 'high' | 'medium' | 'low' {
  const riskFactors: Record<string, number> = {
    earthquake: result.wolframData?.seismicActivity > 3 ? 5 : 
               result.wolframData?.seismicActivity > 2 ? 3 : 1,
    
    wildfire: (result.weatherData?.temperature > 85 && result.weatherData?.humidity < 30) ? 5 :
              (result.weatherData?.temperature > 75 && result.weatherData?.humidity < 40) ? 3 : 1,
    
    flood: result.wolframData?.elevation < 30 ? 5 :
           result.wolframData?.elevation < 50 ? 3 : 1,
    
    winter: result.weatherData?.temperature < 20 ? 5 :
            result.weatherData?.temperature < 32 ? 3 : 1,
    
    hurricane: result.wolframData?.distanceToCoast < 50 ? 5 :
               result.wolframData?.distanceToCoast < 100 ? 3 : 1,
    
    tornado: result.wolframData?.tornadoFrequency > 3 ? 5 :
             result.wolframData?.tornadoFrequency > 1 ? 3 : 1,
    
    drought: result.wolframData?.annualRainfall < 15 ? 5 :
             result.wolframData?.annualRainfall < 25 ? 3 : 1,
    
    heatwave: result.weatherData?.temperature > 95 ? 5 :
              result.weatherData?.temperature > 85 ? 3 : 1,
    
    tsunami: (result.wolframData?.distanceToCoast < 30 && result.wolframData?.seismicActivity > 2) ? 5 :
             (result.wolframData?.distanceToCoast < 50 && result.wolframData?.seismicActivity > 1) ? 3 : 1,
    
    landslide: (result.wolframData?.elevation > 1000 && result.wolframData?.annualRainfall > 40) ? 5 :
               (result.wolframData?.elevation > 500 && result.wolframData?.annualRainfall > 30) ? 3 : 1
  };

  const riskScore = riskFactors[disaster.id] || 0;
  
  if (riskScore >= 5) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}

export default function AnalysisResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnhancedAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [activePlanPhase, setActivePlanPhase] = useState('before');
  const [selectedDisaster, setSelectedDisaster] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedResult = localStorage.getItem('analysisResult');
      if (storedResult) {
        const parsedResult = JSON.parse(storedResult);
        console.log('Parsed result:', parsedResult);
        console.log('Disaster cards:', parsedResult.disasterCards);
        console.log('Risk explanations:', parsedResult.riskExplanations);
        setResult(parsedResult);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  }, []);

  // Debug useEffect
  useEffect(() => {
    if (result) {
      console.log('Current result:', result);
    }
  }, [result]);

  useEffect(() => {
    if (expandedSection && result) {
      console.log('DisasterCards:', result.disasterCards);
      console.log('Expanded section:', expandedSection);
    }
  }, [expandedSection, result]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-emerald-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-emerald-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-emerald-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-8">{error || 'Failed to load analysis result'}</p>
            <Link
              href="/analyze"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full inline-block hover:shadow-lg transition-all"
            >
              Start New Analysis
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const locationDisplay = result.location.formatted_address || 
    `${result.location.city}, ${result.location.state}${result.location.zipCode ? ` ${result.location.zipCode}` : ''}`;

  const activeDisasterTypes = ALL_POSSIBLE_DISASTERS.filter(
    disaster => result.activeDisasters.includes(disaster.id)
  );

  const groupDisastersByRisk = (disasters: DisasterType[]) => {
    return disasters.reduce((acc, disaster) => {
      acc[disaster.risk].push(disaster);
      return acc;
    }, {
      high: [] as DisasterType[],
      medium: [] as DisasterType[],
      low: [] as DisasterType[]
    });
  };

  const groupedDisasters = groupDisastersByRisk(activeDisasterTypes);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/"
            className="text-2xl font-bold text-emerald-800"
          >
            DIZ-AI
          </Link>
          <div className="flex gap-4">
            <button
              onClick={() => window.print()}
              className="text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-2"
            >
              <span>Print Report</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
            <Link
              href="/resources"
              className="text-emerald-700 hover:text-emerald-900 font-medium"
            >
              Resources →
            </Link>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-emerald-900">
            Emergency Preparedness Plan
          </h1>
          <p className="text-lg text-emerald-700">
            {locationDisplay || 'Location not specified'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-6 py-3 rounded-lg transition-all ${
              activeTab === 'summary'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'bg-white/80 text-emerald-700 hover:bg-emerald-50'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`px-6 py-3 rounded-lg transition-all ${
              activeTab === 'emergency-kit'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'bg-white/80 text-emerald-700 hover:bg-emerald-50'
            }`}
            onClick={() => setActiveTab('emergency-kit')}
          >
            Emergency Kit
          </button>
          <button
            className={`px-6 py-3 rounded-lg transition-all ${
              activeTab === 'disaster-types'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'bg-white/80 text-emerald-700 hover:bg-emerald-50'
            }`}
            onClick={() => setActiveTab('disaster-types')}
          >
            Disaster Types
          </button>
          <button
            className={`px-6 py-3 rounded-lg transition-all ${
              activeTab === 'action-plan'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'bg-white/80 text-emerald-700 hover:bg-emerald-50'
            }`}
            onClick={() => setActiveTab('action-plan')}
          >
            Action Plan
          </button>
        </div>

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Top Risks Section */}
            <div className="bg-white/60 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-900 mb-4">
                Top Risks for {result.location.city}, {result.location.state}
              </h3>
              <div className="space-y-4">
                {ALL_POSSIBLE_DISASTERS.map(disaster => {
                  const riskLevel = getRiskLevel(disaster, result);
                  if (riskLevel === 'high') {
                    return (
                      <div key={disaster.id} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                        <div className="flex items-center gap-2">
                          <span role="img" aria-label={disaster.title} className="text-2xl">
                            {disaster.emoji}
                          </span>
                          <h4 className="font-medium text-red-800">{disaster.title} - High Risk</h4>
                        </div>
                        <p className="text-red-700 mt-2">{disaster.description}</p>
                        <div className="mt-3 text-sm text-red-600">
                          Based on: {
                            disaster.id === 'earthquake' ? `Seismic activity level of ${result.wolframData.seismicActivity}` :
                            disaster.id === 'wildfire' ? `High temperature (${result.weatherData.temperature}°F) and low humidity (${result.weatherData.humidity}%)` :
                            disaster.id === 'flood' ? `Low elevation (${result.wolframData.elevation}ft)` :
                            disaster.id === 'tsunami' ? `Close to coast (${result.wolframData.distanceToCoast}mi)` :
                            'Local risk factors'
                          }
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Priority Actions Section */}
            <div className="bg-white/60 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-900 mb-4">Priority Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-emerald-800">Immediate Steps</h4>
                  <ul className="space-y-2">
                    {result.recommendations.immediate.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-500">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-emerald-800">Critical Supplies</h4>
                  <ul className="space-y-2">
                    {result.customSupplies
                      .filter(cat => cat.priority === 'high')
                      .flatMap(cat => cat.items)
                      .slice(0, 5)
                      .map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-emerald-500">•</span>
                          <span>{item.name}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Evacuation Routes */}
            <div className="bg-white/60 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-900 mb-4">Evacuation Information</h3>
              <div className="space-y-4">
                {result.evacuationRoutes.map((route, index) => (
                  <div key={index} className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-medium text-emerald-800 mb-2">{route.name}</h4>
                    <p className="text-emerald-600 mb-2">{route.description}</p>
                    <div className="text-sm text-emerald-500">
                      Destinations: {route.destinations.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white/60 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-900 mb-4">
                Emergency Contacts for {result.location.city}
              </h3>
              <div className="space-y-4">
                {/* Default Emergency Numbers */}
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <span className="font-medium text-emerald-800">Emergency Services</span>
                  <a href="tel:911" className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    911
                  </a>
                </div>
                
                {/* Local Emergency Contacts */}
                {result.wolframData?.emergencyContacts?.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <span className="font-medium text-emerald-800">{contact.name}</span>
                    <a href={`tel:${contact.phone}`} className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {contact.phone}
                    </a>
                  </div>
                ))}

                {/* Additional Important Numbers */}
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <span className="font-medium text-emerald-800">FEMA Disaster Assistance</span>
                  <a href="tel:1-800-621-3362" className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    1-800-621-3362
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Kit Content */}
        {activeTab === 'emergency-kit' && (
          <div className="space-y-8">
            <div className="bg-white/60 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-emerald-900">Emergency Kit Checklist</h2>
              <p className="text-gray-600 mb-6">Based on your location and potential disasters, here are the recommended supplies:</p>
              
              {result.customSupplies.map((category, index) => (
                <div key={index} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-emerald-800">{category.category}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      category.priority === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : category.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {category.priority.toUpperCase()} Priority
                    </span>
                    <span className="text-sm bg-emerald-50 px-2 py-1 rounded-full text-emerald-600">
                      Est. Cost: {category.estimatedCost}
                    </span>
                  </div>
                  {category.reason && (
                    <p className="text-sm text-emerald-600 mb-4">{category.reason}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white p-4 rounded-lg shadow-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="form-checkbox text-emerald-500 rounded" />
                          <span className="text-gray-700">{item.name}</span>
                        </label>
                        <div className="mt-2 flex gap-2 text-sm">
                          <a
                            href={item.links.amazon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Amazon
                          </a>
                          <span className="text-gray-300">|</span>
                          <a
                            href={item.links.walmart}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Walmart
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disaster Types Tab */}
        {activeTab === 'disaster-types' && (
          <div className="space-y-8">
            {/* High-Risk Disasters */}
            <div className="space-y-4">
              <button 
                onClick={() => setExpandedSection(expandedSection === 'high' ? null : 'high')}
                className="w-full flex items-center justify-between bg-red-50 p-4 rounded-lg hover:bg-red-100 transition-colors"
              >
                <h3 className="text-xl font-semibold text-red-900">High-Risk Disasters</h3>
                <svg 
                  className={`w-6 h-6 transform transition-transform ${expandedSection === 'high' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSection === 'high' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {(result.disasterCards?.high ?? []).map(disaster => (
                    <div key={disaster.id} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span role="img" aria-label={disaster.title} className="text-2xl">
                          {disaster.emoji}
                        </span>
                        <h4 className="font-medium text-red-800">{disaster.title}</h4>
                      </div>
                      <p className="text-red-700 text-sm mb-3">{disaster.description}</p>
                      <p className="text-red-600 text-sm">{disaster.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Medium-Risk Disasters */}
            <div className="space-y-4">
              <button 
                onClick={() => setExpandedSection(expandedSection === 'medium' ? null : 'medium')}
                className="w-full flex items-center justify-between bg-yellow-50 p-4 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <h3 className="text-xl font-semibold text-yellow-900">Medium-Risk Disasters</h3>
                <svg 
                  className={`w-6 h-6 transform transition-transform ${expandedSection === 'medium' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSection === 'medium' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {(result.disasterCards?.medium ?? []).map(disaster => (
                    <div key={disaster.id} className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span role="img" aria-label={disaster.title} className="text-2xl">
                          {disaster.emoji}
                        </span>
                        <h4 className="font-medium text-yellow-800">{disaster.title}</h4>
                      </div>
                      <p className="text-yellow-700 text-sm mb-3">{disaster.description}</p>
                      <p className="text-yellow-600 text-sm">{disaster.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Low-Risk Disasters */}
            <div className="space-y-4">
              <button 
                onClick={() => setExpandedSection(expandedSection === 'low' ? null : 'low')}
                className="w-full flex items-center justify-between bg-emerald-50 p-4 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <h3 className="text-xl font-semibold text-emerald-900">Low-Risk Disasters</h3>
                <svg 
                  className={`w-6 h-6 transform transition-transform ${expandedSection === 'low' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSection === 'low' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {(result.disasterCards?.low ?? []).map(disaster => (
                    <div key={disaster.id} className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span role="img" aria-label={disaster.title} className="text-2xl">
                          {disaster.emoji}
                        </span>
                        <h4 className="font-medium text-emerald-800">{disaster.title}</h4>
                      </div>
                      <p className="text-emerald-700 text-sm mb-3">{disaster.description}</p>
                      <p className="text-emerald-600 text-sm">{disaster.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Plan Content */}
        {activeTab === 'action-plan' && (
          <div className="space-y-6">
            {/* Phase Navigation */}
            <div className="flex gap-2 bg-white/60 p-2 rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  activePlanPhase === 'before'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
                onClick={() => setActivePlanPhase('before')}
              >
                Before Disaster
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  activePlanPhase === 'during'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
                onClick={() => setActivePlanPhase('during')}
              >
                During Disaster
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  activePlanPhase === 'after'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
                onClick={() => setActivePlanPhase('after')}
              >
                After Disaster
              </button>
            </div>

            {/* Action Plan Content Based on Phase */}
            <div className="bg-white/60 rounded-lg p-6">
              {selectedDisaster ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-emerald-900">
                      {ALL_POSSIBLE_DISASTERS.find(d => d.id === selectedDisaster)?.title} Response Plan
                    </h3>
                    <button
                      onClick={() => setSelectedDisaster(null)}
                      className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      View All Plans
                    </button>
                  </div>
                  
                  {activePlanPhase === 'before' && result.disasterResponses[selectedDisaster]?.beforeSteps.map((step, index) => (
                    <div key={index} className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-emerald-800">{step}</p>
                    </div>
                  ))}

                  {activePlanPhase === 'during' && result.disasterResponses[selectedDisaster]?.duringSteps.map((step, index) => (
                    <div key={index} className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-emerald-800">{step}</p>
                    </div>
                  ))}

                  {activePlanPhase === 'after' && result.disasterResponses[selectedDisaster]?.afterSteps.map((step, index) => (
                    <div key={index} className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-emerald-800">{step}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-emerald-900 mb-4">Available Disaster Plans</h3>
                  <p className="text-gray-600 mb-4">
                    Click on a disaster type to view its specific response plan, or view the universal action plan below.
                  </p>

                  {/* Disaster-Specific Plans */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {Object.keys(result.disasterResponses).map((disasterType) => {
                      const disaster = ALL_POSSIBLE_DISASTERS.find(d => d.id === disasterType);
                      if (!disaster) return null;

                      return (
                        <button
                          key={disasterType}
                          onClick={() => setSelectedDisaster(disasterType)}
                          className={`p-4 rounded-lg ${disaster.bgColor} hover:shadow-lg transition-all text-left`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span role="img" aria-label={disaster.title} className="text-2xl">
                              {disaster.emoji}
                            </span>
                            <h4 className="font-medium">{disaster.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600">Click to view specific response plan</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Universal Action Plan */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-emerald-800 mb-4">Universal Action Plan</h4>
                    <div className="space-y-4">
                      {result.actionPlans
                        .filter(plan => 
                          (activePlanPhase === 'before' && plan.phase === 'immediate') ||
                          (activePlanPhase === 'during' && plan.phase === 'short-term') ||
                          (activePlanPhase === 'after' && plan.phase === 'long-term')
                        )
                        .map((plan, index) => (
                          <div key={index} className="bg-emerald-50 p-4 rounded-lg">
                            <h4 className="font-medium text-emerald-800 mb-2">{plan.title}</h4>
                            <ul className="space-y-2">
                              {plan.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start gap-2">
                                  <span className="text-emerald-500">•</span>
                                  <span className="text-emerald-800">{step}</span>
                                </li>
                              ))}
                            </ul>
                            {plan.resources.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-emerald-100">
                                <h5 className="text-sm font-medium text-emerald-800 mb-2">Resources:</h5>
                                <ul className="text-sm space-y-1">
                                  {plan.resources.map((resource, resourceIndex) => (
                                    <li key={resourceIndex} className="text-emerald-600">{resource}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 