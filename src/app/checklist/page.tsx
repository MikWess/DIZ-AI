import { useState } from 'react';

export default function ChecklistPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#004D40] mb-8">Emergency Preparedness Checklist</h1>
          
          {/* Basic Supplies Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Basic Emergency Supplies</h2>
            <div className="space-y-4">
              <ChecklistItem label="Water (1 gallon per person per day for 3 days)" />
              <ChecklistItem label="Non-perishable food (3-day supply)" />
              <ChecklistItem label="Battery-powered or hand crank radio" />
              <ChecklistItem label="Flashlight and extra batteries" />
              <ChecklistItem label="First aid kit" />
              <ChecklistItem label="Whistle to signal for help" />
              <ChecklistItem label="Dust masks, plastic sheeting, and duct tape" />
              <ChecklistItem label="Moist towelettes, garbage bags, and plastic ties" />
              <ChecklistItem label="Manual can opener" />
              <ChecklistItem label="Cell phone with chargers and backup battery" />
            </div>
          </section>

          {/* Documents Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Important Documents</h2>
            <div className="space-y-4">
              <ChecklistItem label="Insurance policies" />
              <ChecklistItem label="Identification documents" />
              <ChecklistItem label="Bank account records" />
              <ChecklistItem label="Emergency contact information" />
              <ChecklistItem label="Medical information and prescriptions" />
              <ChecklistItem label="Cash and change" />
            </div>
          </section>

          {/* Additional Items Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6">Additional Items to Consider</h2>
            <div className="space-y-4">
              <ChecklistItem label="Prescription medications" />
              <ChecklistItem label="Non-prescription medications" />
              <ChecklistItem label="Glasses and contact lens solution" />
              <ChecklistItem label="Infant formula and diapers" />
              <ChecklistItem label="Pet food and extra water" />
              <ChecklistItem label="Sleeping bags or warm blankets" />
              <ChecklistItem label="Change of clothes" />
              <ChecklistItem label="Fire extinguisher" />
              <ChecklistItem label="Matches in a waterproof container" />
              <ChecklistItem label="Paper and pencil" />
              <ChecklistItem label="Books, games, puzzles, or activities" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        className="mt-1 h-5 w-5 rounded border-gray-300 text-[#004D40] focus:ring-[#004D40]"
      />
      <label className="text-gray-700">{label}</label>
    </div>
  );
} 