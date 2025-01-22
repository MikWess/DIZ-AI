export default function ResourcesPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#004D40] mb-4">Disaster Resources</h1>
      <p className="mb-6">Here is a comprehensive list of contact information and websites to assist you during times of disaster:</p>
      <ul className="space-y-4">
        <li>
          <strong>Federal Emergency Management Agency (FEMA):</strong> <br />
          Website: <a href="https://www.fema.gov" className="text-[#004D40] underline">https://www.fema.gov</a> <br />
          Phone: 1-800-621-FEMA (1-800-621-3362)
        </li>
        <li>
          <strong>American Red Cross:</strong> <br />
          Website: <a href="https://www.redcross.org" className="text-[#004D40] underline">https://www.redcross.org</a> <br />
          Phone: 1-800-RED-CROSS (1-800-733-2767)
        </li>
        <li>
          <strong>National Weather Service (NWS):</strong> <br />
          Website: <a href="https://www.weather.gov" className="text-[#004D40] underline">https://www.weather.gov</a>
        </li>
        <li>
          <strong>Centers for Disease Control and Prevention (CDC) Emergency Preparedness:</strong> <br />
          Website: <a href="https://www.cdc.gov/prepyourhealth" className="text-[#004D40] underline">https://www.cdc.gov/prepyourhealth</a>
        </li>
        <li>
          <strong>Ready.gov:</strong> <br />
          Website: <a href="https://www.ready.gov" className="text-[#004D40] underline">https://www.ready.gov</a>
        </li>
        <li>
          <strong>National Suicide Prevention Lifeline:</strong> <br />
          Website: <a href="https://suicidepreventionlifeline.org" className="text-[#004D40] underline">https://suicidepreventionlifeline.org</a> <br />
          Phone: 988
        </li>
        <li>
          <strong>Local Emergency Contacts:</strong> <br />
          Check your local government website or contact local emergency management agencies for area-specific resources.
        </li>
      </ul>
    </main>
  );
} 