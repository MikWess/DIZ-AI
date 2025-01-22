'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DisasterType {
  id: string;
  title: string;
  emoji: string;
  description: string;
  preparedness: string;
  bgColor: string;
  risk: 'high' | 'medium' | 'low';
}

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
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
  activeDisasters: string[];  // IDs of active disaster risks
  customSupplies: Array<{
    category: string;
    items: string[];
    reason?: string;
  }>;
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

export default function AnalysisResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('disaster-types');
  const [activePlanPhase, setActivePlanPhase] = useState('before');

  useEffect(() => {
    try {
      // For development/testing, use mock data if no stored result exists
      const mockResult: AnalysisResult = {
        location: {
          city: 'Alpine',
          state: 'Utah',
          zipCode: '84004',
          formatted_address: 'Alpine, Utah 84004',
          coordinates: { lat: 40.4625, lng: -111.7744 }
        },
        activeDisasters: ['earthquake', 'wildfire', 'flood', 'winter', 'landslide'],
        customSupplies: [
          {
            category: 'Winter Supplies',
            items: [
              'Snow shovel',
              'Ice melt',
              'Thermal blankets',
              'Hand warmers'
            ],
            reason: 'Required for severe winter conditions in Alpine'
          },
          {
            category: 'Earthquake Supplies',
            items: [
              'Emergency water storage',
              'Structural repair materials',
              'Gas shut-off wrench',
              'Emergency radio'
            ],
            reason: 'High earthquake risk due to Wasatch Fault proximity'
          }
        ]
      };

      const storedResult = localStorage.getItem('analysisResult');
      if (!storedResult) {
        // Use mock data if no stored result
        setResult(mockResult);
        setLoading(false);
        return;
      }

      const parsedResult = JSON.parse(storedResult);
      // Ensure the parsed result has the required properties
      if (!parsedResult.activeDisasters || !Array.isArray(parsedResult.activeDisasters)) {
        setResult(mockResult); // Fallback to mock data if invalid format
      } else {
        setResult(parsedResult);
      }
    } catch (error) {
      console.error('Error loading analysis result:', error);
      setError('Failed to load analysis result');
    } finally {
      setLoading(false);
    }
  }, []);

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

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-8">{error}</p>
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

  if (!result || !result.activeDisasters) return null;

  const activeDisasterTypes = ALL_POSSIBLE_DISASTERS.filter(
    disaster => result.activeDisasters.includes(disaster.id)
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Resources Link */}
        <div className="flex justify-end mb-4">
          <Link
            href="/resources"
            className="text-emerald-700 hover:text-emerald-900 font-medium"
          >
            Resources →
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-emerald-900 text-center">
          Emergency Preparedness Plan for {result?.location.formatted_address}
        </h1>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-8">
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
                    {category.reason && (
                      <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {category.reason}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <label key={itemIndex} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                        <input type="checkbox" className="form-checkbox text-emerald-500 rounded" />
                        <span className="text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disaster Types Content */}
        {activeTab === 'disaster-types' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-emerald-900 text-center">
              Potential Disasters in Your Area
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeDisasterTypes.map((disaster) => (
                <div
                  key={disaster.id}
                  className={`p-6 rounded-lg ${disaster.bgColor} hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span role="img" aria-label={disaster.title} className="text-2xl">
                      {disaster.emoji}
                    </span>
                    <h3 className="text-lg font-semibold">{disaster.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-3">{disaster.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Preparedness:</h4>
                    <p className="text-gray-700">{disaster.preparedness}</p>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        disaster.risk === 'high'
                          ? 'bg-red-100 text-red-800'
                          : disaster.risk === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {disaster.risk.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
              ))}
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
              {activePlanPhase === 'before' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-emerald-900 mb-4">Before Disaster</h3>
                  <p className="text-gray-600 mb-4">Prepare your family and home for potential emergencies</p>
                  <div className="space-y-4">
                    {/* Add your before disaster checklist items here */}
                  </div>
                </div>
              )}

              {activePlanPhase === 'during' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-emerald-900 mb-4">During Disaster</h3>
                  <p className="text-gray-600 mb-4">Critical actions to take when disaster strikes</p>
                  <div className="space-y-4">
                    {/* Add your during disaster checklist items here */}
                  </div>
                </div>
              )}

              {activePlanPhase === 'after' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-emerald-900 mb-4">After Disaster</h3>
                  <p className="text-gray-600 mb-4">Steps to take in the aftermath of a disaster</p>
                  <div className="space-y-4">
                    {/* Add your after disaster checklist items here */}
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