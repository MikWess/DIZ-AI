'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      location: formData.get('location'),
      householdSize: parseInt(formData.get('householdSize') as string),
      housingType: formData.get('housingType'),
      specialNeeds: formData.get('specialNeeds') === 'true',
      pets: formData.get('pets') === 'true',
      mobilityIssues: formData.get('mobilityIssues') === 'true'
    };

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze location');
      }

      const result = await response.json();
      
      // Store the result in localStorage for the results page
      localStorage.setItem('analysisResult', JSON.stringify(result));
      
      // Navigate to the results page
      router.push('/analysis-result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-emerald-900 text-center">
          Emergency Preparedness Analysis
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/60 rounded-lg p-6 shadow-sm">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              placeholder="Enter city, state"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="householdSize" className="block text-sm font-medium text-gray-700 mb-1">
              Household Size
            </label>
            <input
              type="number"
              name="householdSize"
              id="householdSize"
              required
              min="1"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="housingType" className="block text-sm font-medium text-gray-700 mb-1">
              Housing Type
            </label>
            <select
              name="housingType"
              id="housingType"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select housing type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="mobile">Mobile Home</option>
              <option value="condo">Condominium</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="specialNeeds"
                id="specialNeeds"
                value="true"
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="specialNeeds" className="ml-2 text-sm text-gray-700">
                Special Needs
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="pets"
                id="pets"
                value="true"
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="pets" className="ml-2 text-sm text-gray-700">
                Pets
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="mobilityIssues"
                id="mobilityIssues"
                value="true"
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="mobilityIssues" className="ml-2 text-sm text-gray-700">
                Mobility Issues
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg'
              }`}
          >
            {loading ? 'Analyzing...' : 'Analyze Location'}
          </button>
        </form>
      </div>
    </main>
  );
} 