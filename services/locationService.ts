import { MapData } from '../types';

export class LocationService {
  async findLocation(query: string): Promise<MapData> {
    try {
      // Simulasi geocoding (di production gunakan Google Maps Geocoding API)
      // Untuk sekarang return data dummy
      
      return {
        latitude: -6.2088,
        longitude: 106.8456,
        placeName: query,
        address: `Alamat untuk ${query}`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      };
    } catch (error) {
      console.error("Location Service Error:", error);
      throw error;
    }
  }
}

export const locationService = new LocationService();
