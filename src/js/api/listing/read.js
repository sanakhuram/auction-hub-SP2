import { API_AUCTION_LISTINGS } from '../constants.js';

export async function getListings() {
  try {
    console.log('🟡 Fetching listings from API...');
    const response = await fetch(API_AUCTION_LISTINGS);

    if (!response.ok) throw new Error(`❌ API Error: ${response.status}`);

    const { data } = await response.json(); // Extract only the data array
    console.log('✅ Listings Data Extracted:', data);

    if (!Array.isArray(data)) {
      console.error('❌ API did not return an array:', data);
      return [];
    }

    return data; // Return only the listings array
  } catch (error) {
    console.error('❌ Failed to fetch listings:', error);
    return [];
  }
}
