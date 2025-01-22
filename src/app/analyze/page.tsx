'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    location: '',
    householdSize: '',
    housingType: '',
    specialNeeds: false,
    pets: false,
    mobilityIssues: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze location');
      }

      const result = await response.json();
      
      // Store the result in localStorage for the results page
      localStorage.setItem('analysisResult', JSON.stringify(result));
      
      router.push('/analysis-result');
    } catch (error) {
      console.error('Error analyzing data:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-[#004D40] mb-8">Get Your AI Analysis</h1>
          
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= num ? 'bg-[#004D40] text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Location Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Location (City, State)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-[#004D40] focus:border-[#004D40]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Housing Type
                  </label>
                  <select
                    name="housingType"
                    value={formData.housingType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-[#004D40] focus:border-[#004D40]"
                    required
                  >
                    <option value="">Select housing type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="mobile">Mobile Home</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Household Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of People in Household
                  </label>
                  <input
                    type="number"
                    name="householdSize"
                    value={formData.householdSize}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border rounded-md focus:ring-[#004D40] focus:border-[#004D40]"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="pets"
                      checked={formData.pets}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#004D40] focus:ring-[#004D40] border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Do you have pets?
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Special Considerations</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="specialNeeds"
                      checked={formData.specialNeeds}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#004D40] focus:ring-[#004D40] border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Does anyone in your household have special medical needs?
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="mobilityIssues"
                      checked={formData.mobilityIssues}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#004D40] focus:ring-[#004D40] border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Does anyone in your household have mobility issues?
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mr-4 px-6 py-2 text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#004D40] text-white px-8 py-3 rounded-full font-semibold transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
                }`}
              >
                {loading ? 'Analyzing...' : step === 3 ? 'Generate Plan' : 'Next'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
} 