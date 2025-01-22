import axios from 'axios';

interface GeocodingResult {
  lat: number;
  lng: number;
  formatted_address: string;
}

interface WeatherData {
  current: {
    temperature: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    conditions: string;
  };
  alerts: Array<{
    event: string;
    description: string;
    start: number;
    end: number;
  }>;
  daily_forecast: Array<{
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    conditions: string;
    precipitation_probability: number;
  }>;
  hourly_forecast: Array<{
    time: string;
    temperature: number;
    conditions: string;
    precipitation_probability: number;
  }>;
}

async function getGeocodingData(location: string): Promise<GeocodingResult> {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${process.env.OPENCAGE_API_KEY}`;
    const response = await axios.get(url);
    
    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      return {
        lat: result.geometry.lat,
        lng: result.geometry.lng,
        formatted_address: result.formatted
      };
    }
    throw new Error('Location not found');
  } catch (err) {
    console.error("Error in geocoding:", err);
    throw new Error('Failed to geocode location');
  }
}

async function getWeatherData(lat: number, lng: number): Promise<WeatherData> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`;
    const response = await axios.get(url);
    
    const current = {
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      wind_speed: response.data.wind.speed,
      conditions: response.data.weather[0].description
    };

    // Get 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`;
    const forecastResponse = await axios.get(forecastUrl);
    
    const daily_forecast = forecastResponse.data.list
      .filter((item: any, index: number) => index % 8 === 0) // Get one reading per day
      .slice(0, 5)
      .map((day: any) => ({
        date: new Date(day.dt * 1000).toLocaleDateString(),
        temperature: {
          min: day.main.temp_min,
          max: day.main.temp_max
        },
        conditions: day.weather[0].description,
        precipitation_probability: day.pop * 100 || 0
      }));

    const hourly_forecast = forecastResponse.data.list
      .slice(0, 8) // Next 24 hours (3-hour intervals)
      .map((hour: any) => ({
        time: new Date(hour.dt * 1000).toLocaleTimeString(),
        temperature: hour.main.temp,
        conditions: hour.weather[0].description,
        precipitation_probability: hour.pop * 100 || 0
      }));

    return {
      current,
      alerts: [], // Basic API doesn't include alerts
      daily_forecast,
      hourly_forecast
    };
  } catch (err) {
    console.error("Error fetching weather data:", err);
    return {
      current: {
        temperature: 0,
        feels_like: 0,
        humidity: 0,
        wind_speed: 0,
        conditions: 'Weather data not available'
      },
      alerts: [],
      daily_forecast: [],
      hourly_forecast: []
    };
  }
}

async function getElevationData(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`;
    const response = await axios.get(url);
    
    if (response.data.results && response.data.results.length > 0) {
      return `${Math.round(response.data.results[0].elevation)} meters above sea level`;
    }
    return 'Elevation data not available';
  } catch (err) {
    console.error("Error fetching elevation data:", err);
    return 'Elevation data not available';
  }
}

function generatePlaceholderPlan() {
  return {
    primary_risks: [
      {
        title: "[Primary Risk 1]",
        description: "[Risk Description 1]",
        severity: "high"
      },
      {
        title: "[Primary Risk 2]",
        description: "[Risk Description 2]",
        severity: "medium"
      },
      {
        title: "[Primary Risk 3]",
        description: "[Risk Description 3]",
        severity: "low"
      }
    ],
    emergency_supplies: [
      {
        category: "Essential",
        items: [
          "Water (1 gallon per person per day)",
          "Non-perishable food",
          "First aid kit",
          "Flashlight and batteries",
          "Emergency radio"
        ]
      },
      {
        category: "Documents",
        items: [
          "ID and passports",
          "Insurance papers",
          "Medical records",
          "Emergency contacts list",
          "Bank documents"
        ]
      },
      {
        category: "Specific Needs",
        items: [
          "Prescription medications",
          "Pet supplies",
          "Special medical equipment",
          "Baby supplies",
          "Mobility aids"
        ]
      }
    ],
    evacuation_plan: {
      routes: [
        {
          name: "[Primary Route]",
          description: "[Route Description]",
          destinations: ["[Safe Location 1]", "[Safe Location 2]"]
        },
        {
          name: "[Secondary Route]",
          description: "[Route Description]",
          destinations: ["[Alternative Location 1]", "[Alternative Location 2]"]
        }
      ],
      meeting_points: [
        {
          name: "[Primary Meeting Point]",
          address: "[Address]",
          description: "[Description]"
        },
        {
          name: "[Secondary Meeting Point]",
          address: "[Address]",
          description: "[Description]"
        }
      ]
    },
    action_steps: {
      immediate: [
        "Gather emergency supplies",
        "Review evacuation routes",
        "Check weather updates"
      ],
      within_24_hours: [
        "Contact family members",
        "Secure important documents",
        "Fill vehicle with gas"
      ],
      within_72_hours: [
        "Stock up on supplies",
        "Prepare home",
        "Make long-term plans"
      ]
    },
    special_considerations: {
      household_specific: [
        "[Household Specific Consideration 1]",
        "[Household Specific Consideration 2]",
        "[Household Specific Consideration 3]"
      ],
      weather_related: [
        "[Weather Consideration 1]",
        "[Weather Consideration 2]",
        "[Weather Consideration 3]"
      ],
      seasonal: [
        "[Seasonal Consideration 1]",
        "[Seasonal Consideration 2]",
        "[Seasonal Consideration 3]"
      ]
    },
    local_resources: {
      emergency_services: [
        {
          name: "[Emergency Service 1]",
          contact: "[Contact Info]",
          description: "[Description]"
        },
        {
          name: "[Emergency Service 2]",
          contact: "[Contact Info]",
          description: "[Description]"
        }
      ],
      shelters: [
        {
          name: "[Shelter 1]",
          address: "[Address]",
          capacity: "[Capacity]"
        },
        {
          name: "[Shelter 2]",
          address: "[Address]",
          capacity: "[Capacity]"
        }
      ]
    }
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { location, householdSize, housingType, specialNeeds, pets, mobilityIssues } = body;
    
    if (!location) {
      return Response.json({ error: 'Location is required' }, { status: 400 });
    }

    // Get all data in parallel
    const geoData = await getGeocodingData(location);
    const [elevation, weather] = await Promise.all([
      getElevationData(geoData.lat, geoData.lng),
      getWeatherData(geoData.lat, geoData.lng)
    ]);

    const locationData = {
      formatted_address: geoData.formatted_address,
      coordinates: {
        lat: geoData.lat,
        lng: geoData.lng
      },
      elevation
    };

    // Generate placeholder emergency plan
    const emergencyPlan = generatePlaceholderPlan();

    return Response.json({
      location: locationData,
      weather,
      emergency_plan: emergencyPlan
    });
  } catch (err) {
    console.error("Analysis error:", err);
    return Response.json({ 
      error: 'Failed to analyze location',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { 
      status: 500 
    });
  }
} 