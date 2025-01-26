interface WeatherData {
  temperature: number;
  humidity: number;
  conditions: string;
  windSpeed: number;
  precipitation: number;
}

export async function getWeatherData(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`
    );

    if (!response.ok) {
      throw new Error('Weather API error');
    }

    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      conditions: data.weather[0].main,
      windSpeed: data.wind.speed,
      precipitation: data.rain ? data.rain['1h'] || 0 : 0
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
} 