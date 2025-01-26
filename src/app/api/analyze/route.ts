import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface AnalysisRequest {
  location: string;
  householdSize: number;
  housingType: string;
  specialNeeds: boolean;
  pets: boolean;
  mobilityIssues: boolean;
}

async function getWolframData(location: string) {
  try {
    // Query for natural disasters, climate, and geographical data
    const queries = [
      `natural disasters ${location}`,
      `climate ${location}`,
      `elevation ${location}`,
      `geographical features near ${location}`
    ];

    const results = await Promise.all(queries.map(async (query) => {
      const url = `https://api.wolframalpha.com/v2/query?input=${encodeURIComponent(query)}&appid=${process.env.WOLFRAM_APP_ID}&output=json&format=plaintext`;
      const response = await fetch(url);
      const data = await response.json();
      return { query, data };
    }));

    return results;
  } catch (error) {
    console.error('Wolfram API error:', error);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const data: AnalysisRequest = await req.json();

    // 1. Get comprehensive location analysis from Wolfram
    const wolframData = await getWolframData(data.location);

    // 2. Format the data for OpenAI
    const prompt = `
      Generate a detailed emergency preparedness plan for a location with the following details:
      Location: ${data.location}
      Household Size: ${data.householdSize}
      Housing Type: ${data.housingType}
      Special Needs: ${data.specialNeeds ? 'Yes' : 'No'}
      Pets: ${data.pets ? 'Yes' : 'No'}
      Mobility Issues: ${data.mobilityIssues ? 'Yes' : 'No'}

      Based on Wolfram analysis: ${JSON.stringify(wolframData)}

      Generate a response in the following JSON format:
      {
        "location": {
          "city": string,
          "state": string,
          "zipCode": string,
          "formatted_address": string,
          "coordinates": { "lat": number, "lng": number }
        },
        "activeDisasters": string[],  // Array of disaster IDs from: earthquake, wildfire, flood, winter, landslide, tornado, hurricane, drought, heatwave, tsunami
        "customSupplies": [
          {
            "category": string,
            "items": string[],
            "reason": string
          }
        ]
      }

      Consider:
      1. Local geography and climate patterns from the Wolfram data
      2. Historical disaster data and frequency
      3. Seasonal risks based on climate data
      4. Household-specific needs (${data.householdSize} people, ${data.housingType})
      5. Special considerations for ${data.pets ? 'pets, ' : ''}${data.specialNeeds ? 'medical needs, ' : ''}${data.mobilityIssues ? 'mobility issues' : ''}
      6. Housing type-specific preparations for ${data.housingType}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an emergency preparedness expert who provides detailed, location-specific disaster preparedness plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Fix the linter error by checking for null
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty response');
    }

    const analysisResult = JSON.parse(content);

    // Validate and clean the response
    const validDisasters = ['earthquake', 'wildfire', 'flood', 'winter', 'landslide', 'tornado', 'hurricane', 'drought', 'heatwave', 'tsunami'];
    analysisResult.activeDisasters = analysisResult.activeDisasters.filter(
      (disaster: string) => validDisasters.includes(disaster)
    );

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    );
  }
} 