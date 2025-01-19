import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID;
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function queryWolfram(query: string) {
  const url = `http://api.wolframalpha.com/v2/query?input=${encodeURIComponent(query)}&format=plaintext&output=JSON&appid=${WOLFRAM_APP_ID}`;
  const response = await fetch(url);
  return response.json();
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { location, householdSize, housingType, specialNeeds, pets, mobilityIssues } = data;

    // Get Wolfram data for environmental factors
    const wolframData = await getWolframData(location);

    // Generate personalized plan using Llama 2
    const prompt = `You are an emergency preparedness expert. Create a detailed, personalized emergency preparedness plan based on this information:

Location: ${location}
Environmental Data: ${JSON.stringify(wolframData)}
Household Size: ${householdSize}
Housing Type: ${housingType}
Special Needs: ${specialNeeds ? 'Yes' : 'No'}
Pets: ${pets ? 'Yes' : 'No'}
Mobility Issues: ${mobilityIssues ? 'Yes' : 'No'}

Focus on:
1. Location-specific risks and preparations
2. Specific needs of the household
3. Seasonal considerations
4. Evacuation planning
5. Emergency supplies
6. Communication plans

Format your response as a JSON object with this exact structure (no explanation, just the JSON):
{
  "risks": {
    "riskType1": "level",
    "riskType2": "level"
  },
  "recommendations": [
    {
      "category": "category name",
      "items": ["recommendation 1", "recommendation 2"]
    }
  ]
}`;

    const output = await replicate.run(
      "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
      {
        input: {
          prompt,
          temperature: 0.1, // Low temperature for more focused output
          max_tokens: 1500,
          top_p: 0.9
        }
      }
    );

    // Parse the response and ensure it's valid JSON
    let plan;
    try {
      // Find the JSON object in the response
      const jsonStr = (output as string[]).join('').match(/\{[\s\S]*\}/)?.[0] || '{}';
      plan = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Error parsing Llama response:', e);
      plan = {
        risks: {},
        recommendations: []
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        ...plan,
        locationData: wolframData
      }
    });

  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze data' },
      { status: 500 }
    );
  }
}

async function getWolframData(location: string) {
  const queries = [
    `elevation ${location}`,
    `average temperature ${location}`,
    `average annual rainfall ${location}`,
    `population density ${location}`
  ];

  const responses = await Promise.all(
    queries.map(query => queryWolfram(query))
  );

  return {
    elevation: processWolframResponse(responses[0], 'elevation'),
    temperature: processWolframResponse(responses[1], 'temperature'),
    rainfall: processWolframResponse(responses[2], 'rainfall'),
    populationDensity: processWolframResponse(responses[3], 'population')
  };
}

function processWolframResponse(response: any, type: string) {
  try {
    // Extract relevant data from Wolfram Alpha response
    const pods = response.queryresult?.pods || [];
    
    switch(type) {
      case 'disasters':
        return extractDisasterInfo(pods);
      case 'rainfall':
        return extractNumericValue(pods, 'rainfall');
      case 'earthquake':
        return extractRiskLevel(pods);
      case 'elevation':
        return extractNumericValue(pods, 'elevation');
      case 'temperature':
        return extractTemperatureData(pods);
      case 'population':
        return extractNumericValue(pods, 'density');
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error processing ${type} data:`, error);
    return null;
  }
}

function extractDisasterInfo(pods: any[]) {
  // Look for pods with disaster-related information
  const relevantPod = pods.find(pod => 
    pod.title.toLowerCase().includes('natural disaster') ||
    pod.title.toLowerCase().includes('weather events')
  );

  if (!relevantPod) return [];

  // Extract text and look for disaster keywords
  const text = relevantPod.subpods[0]?.plaintext || '';
  const disasters = [
    'flood', 'hurricane', 'tornado', 'earthquake', 'wildfire',
    'drought', 'landslide', 'tsunami', 'volcanic'
  ];

  return disasters.filter(disaster => 
    text.toLowerCase().includes(disaster)
  );
}

function extractNumericValue(pods: any[], type: string) {
  const relevantPod = pods.find(pod => 
    pod.title.toLowerCase().includes(type)
  );

  if (!relevantPod) return null;

  const text = relevantPod.subpods[0]?.plaintext || '';
  const number = text.match(/\d+(\.\d+)?/);
  return number ? parseFloat(number[0]) : null;
}

function extractRiskLevel(pods: any[]) {
  const relevantPod = pods.find(pod => 
    pod.title.toLowerCase().includes('risk') ||
    pod.title.toLowerCase().includes('probability')
  );

  if (!relevantPod) return 'unknown';

  const text = relevantPod.subpods[0]?.plaintext || '';
  if (text.toLowerCase().includes('high')) return 'high';
  if (text.toLowerCase().includes('moderate')) return 'moderate';
  if (text.toLowerCase().includes('low')) return 'low';
  return 'unknown';
}

function extractTemperatureData(pods: any[]) {
  const relevantPod = pods.find(pod => 
    pod.title.toLowerCase().includes('temperature')
  );

  if (!relevantPod) return null;

  const text = relevantPod.subpods[0]?.plaintext || '';
  const numbers = text.match(/-?\d+(\.\d+)?/g);
  
  return numbers ? {
    average: parseFloat(numbers[0]),
    range: numbers.length > 1 ? {
      min: parseFloat(numbers[1]),
      max: parseFloat(numbers[2])
    } : null
  } : null;
} 