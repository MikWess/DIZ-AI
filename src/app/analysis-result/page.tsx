'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Recommendation {
  category: string;
  items: string[];
}

interface Risk {
  [key: string]: 'low' | 'moderate' | 'high';
}

interface AnalysisResult {
  risks: Risk;
  recommendations: Recommendation[];
}

export default function AnalysisResultPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // In a real app, we'd get this from the API response or URL params
    // For now, using mock data
    const mockResult: AnalysisResult = {
      risks: {
        earthquakeRisk: 'low',
        floodRisk: 'moderate',
        hurricaneRisk: 'high'
      },
      recommendations: [
        {
          category: 'General Preparedness',
          items: [
            'Create an emergency communication plan',
            'Prepare an emergency kit',
            'Stay informed about local emergency alerts'
          ]
        },
        {
          category: 'Hurricane Preparedness',
          items: [
            'Have materials to board up windows',
            'Know your evacuation zone',
            'Keep trees and shrubs trimmed'
          ]
        }
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setResult(mockResult);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link
              href="/analyze"
              className="bg-[#004D40] text-white px-6 py-2 rounded-full inline-block"
            >
              Try Again
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!result) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#004D40] mb-8">Your Personalized Preparedness Plan</h1>

          {/* Risk Assessment */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Risk Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(result.risks).map(([risk, level]) => (
                <div 
                  key={risk}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: {
                      low: '#e8f5e9',
                      moderate: '#fff3e0',
                      high: '#ffebee'
                    }[level]
                  }}
                >
                  <h3 className="font-semibold mb-2">
                    {risk.replace('Risk', '').charAt(0).toUpperCase() + risk.replace('Risk', '').slice(1)}
                  </h3>
                  <p className="capitalize">{level} Risk</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendations */}
          <div className="space-y-6">
            {result.recommendations.map((rec, index) => (
              <section key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-6">{rec.category}</h2>
                <ul className="space-y-4">
                  {rec.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <svg
                        className="h-6 w-6 text-[#004D40] mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/analyze"
              className="bg-white text-[#004D40] border-2 border-[#004D40] px-6 py-2 rounded-full font-semibold hover:bg-[#004D40] hover:text-white transition-all"
            >
              Update Information
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-[#004D40] text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all"
            >
              Print Plan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 