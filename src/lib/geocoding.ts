interface GeocodingResult {
  city: string;
  state: string;
  zipCode: string;
  formatted_address: string;
  lat: number;
  lng: number;
}

export async function getGeocodingData(location: string): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${process.env.OPENCAGE_API_KEY}&limit=1`
    );

    if (!response.ok) {
      throw new Error('Geocoding API error');
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    const components = result.components;
    
    return {
      city: components.city || components.town || components.village || '',
      state: components.state || '',
      zipCode: components.postcode || '',
      formatted_address: result.formatted,
      lat: result.geometry.lat,
      lng: result.geometry.lng
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
} 