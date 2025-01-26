'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CustomCategory {
  name: string;
  description: string;
}

interface SurveyData {
  location: string;
  address?: string;
  householdSize: string;
  housingType: string;
  specialNeeds: boolean;
  pets: boolean;
  mobilityIssues: boolean;
  customCategories: CustomCategory[];
  additionalNotes?: string;
  preferredLanguage: string;
  budget: string;
  timeframe: string;
}

export default function AnalyzePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    location: '',
    address: '',
    householdSize: '',
    housingType: '',
    specialNeeds: false,
    pets: false,
    mobilityIssues: false,
    customCategories: [],
    additionalNotes: '',
    preferredLanguage: 'en',
    budget: '',
    timeframe: ''
  });

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.description) {
      setCustomCategories([...customCategories, newCategory]);
      setNewCategory({ name: '', description: '' });
      setShowAddCategory(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSurveyData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return surveyData.location.trim() !== '';
      case 2:
        return surveyData.householdSize !== '' && surveyData.housingType !== '';
      case 3:
        return true; // Checkboxes are optional
      case 4:
        return surveyData.budget !== '' && surveyData.timeframe !== '';
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    simulateProgress();

    const finalData = {
      ...surveyData,
      customCategories
    };

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze location');
      }

      const result = await response.json();
      localStorage.setItem('analysisResult', JSON.stringify(result));
      router.push('/analysis-result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Location Details', description: 'Tell us where you live' },
    { title: 'Household Information', description: 'About your home and family' },
    { title: 'Special Considerations', description: 'Additional needs and requirements' },
    { title: 'Customization', description: 'Personalize your analysis' },
    { title: 'Review & Analyze', description: 'Confirm your information' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-emerald-900 text-center">
          AI-Powered Disaster Preparedness Report
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Get a personalized emergency preparedness plan based on your location and needs
        </p>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div key={i} className={`flex flex-col items-center w-1/5 ${i < step ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  i + 1 === step 
                    ? 'bg-emerald-600 text-white' 
                    : i < step 
                      ? 'bg-emerald-200 text-emerald-700'
                      : 'bg-gray-200 text-gray-400'
                }`}>
                  {i + 1}
                </div>
                <div className="text-sm font-medium text-center">{s.title}</div>
                <div className="text-xs text-center">{s.description}</div>
              </div>
            ))}
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(step / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Location Details */}
          {step === 1 && (
            <div className="bg-white/60 rounded-lg p-6 shadow-sm space-y-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  City and State (Required)
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={surveyData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., San Francisco, CA"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address (Optional)
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={surveyData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Main St"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Household Information */}
          {step === 2 && (
            <div className="bg-white/60 rounded-lg p-6 shadow-sm space-y-6">
              <div>
                <label htmlFor="householdSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Household Size
                </label>
                <input
                  type="number"
                  name="householdSize"
                  id="householdSize"
                  value={surveyData.householdSize}
                  onChange={handleInputChange}
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
                  value={surveyData.housingType}
                  onChange={handleInputChange}
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
            </div>
          )}

          {/* Step 3: Special Considerations */}
          {step === 3 && (
            <div className="bg-white/60 rounded-lg p-6 shadow-sm space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="specialNeeds"
                    id="specialNeeds"
                    checked={surveyData.specialNeeds}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="specialNeeds" className="ml-2 text-sm text-gray-700">
                    Special Medical Needs
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="pets"
                    id="pets"
                    checked={surveyData.pets}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="pets" className="ml-2 text-sm text-gray-700">
                    Pets in Household
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="mobilityIssues"
                    id="mobilityIssues"
                    checked={surveyData.mobilityIssues}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="mobilityIssues" className="ml-2 text-sm text-gray-700">
                    Mobility Issues
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Customization */}
          {step === 4 && (
            <div className="bg-white/60 rounded-lg p-6 shadow-sm space-y-6">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Language
                </label>
                <select
                  name="language"
                  id="language"
                  value={surveyData.preferredLanguage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="zh">中文</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Preparedness Budget
                </label>
                <select
                  name="budget"
                  id="budget"
                  value={surveyData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="low">Basic Essentials ($100-300)</option>
                  <option value="medium">Comprehensive ($300-700)</option>
                  <option value="high">Complete Preparation ($700+)</option>
                </select>
              </div>

              <div>
                <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                  Implementation Timeframe
                </label>
                <select
                  name="timeframe"
                  id="timeframe"
                  value={surveyData.timeframe}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="immediate">Immediate (1-2 weeks)</option>
                  <option value="gradual">Gradual (1-2 months)</option>
                  <option value="extended">Extended (3+ months)</option>
                </select>
              </div>

              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes or Concerns
                </label>
                <textarea
                  name="additionalNotes"
                  id="additionalNotes"
                  rows={3}
                  value={surveyData.additionalNotes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Any specific concerns or requirements..."
                ></textarea>
              </div>

              {/* Custom Categories */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Custom Categories</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(true)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    + Add Category
                  </button>
                </div>

                {customCategories.map((category, index) => (
                  <div key={index} className="bg-emerald-50 p-3 rounded-lg mb-2">
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                ))}

                {showAddCategory && (
                  <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCategory(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review & Analyze */}
          {step === 5 && (
            <div className="bg-white/60 rounded-lg p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-semibold text-emerald-900 mb-4">Review Your Information</h2>
              
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="font-medium text-emerald-800 mb-2">Location</h3>
                  <p className="text-emerald-600">{surveyData.location}</p>
                  {surveyData.address && (
                    <p className="text-emerald-600 text-sm">{surveyData.address}</p>
                  )}
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="font-medium text-emerald-800 mb-2">Household Details</h3>
                  <p className="text-emerald-600">Size: {surveyData.householdSize} people</p>
                  <p className="text-emerald-600">Housing: {surveyData.housingType}</p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="font-medium text-emerald-800 mb-2">Special Considerations</h3>
                  <ul className="text-emerald-600 list-disc list-inside">
                    {surveyData.specialNeeds && <li>Special Medical Needs</li>}
                    {surveyData.pets && <li>Pets in Household</li>}
                    {surveyData.mobilityIssues && <li>Mobility Issues</li>}
                  </ul>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="font-medium text-emerald-800 mb-2">Implementation Details</h3>
                  <p className="text-emerald-600">Budget: {surveyData.budget}</p>
                  <p className="text-emerald-600">Timeframe: {surveyData.timeframe}</p>
                </div>

                {customCategories.length > 0 && (
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-medium text-emerald-800 mb-2">Custom Categories</h3>
                    {customCategories.map((category, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-emerald-600 font-medium">{category.name}</p>
                        <p className="text-emerald-600 text-sm">{category.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-4">
                  Please review your information above. Once you click "Generate Plan", our AI will analyze your specific situation and create a customized emergency preparedness plan.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 text-emerald-600 hover:text-emerald-700"
              >
                Back
              </button>
            )}
            {step < steps.length ? (
              <button
                type="button"
                onClick={() => validateStep() && setStep(step + 1)}
                disabled={!validateStep()}
                className={`ml-auto px-6 py-3 rounded-lg text-white font-medium transition-all
                  ${!validateStep()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`ml-auto px-6 py-3 rounded-lg text-white font-medium transition-all
                  ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing ({progress}%)
                  </div>
                ) : (
                  'Generate Plan'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
} 