//src/js/api/listing/read.js

import { API_AUCTION_LISTINGS } from '../constants.js';

export async function getListings() {
  try {
    console.log('🟡 Fetching listings from API:', API_AUCTION_LISTINGS);
    const response = await fetch(API_AUCTION_LISTINGS);

    if (!response.ok) {
      throw new Error(`❌ API Error: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('✅ API Response:', responseData);

    const listings = responseData.data || responseData; // Handle cases where API returns raw array
    if (!Array.isArray(listings)) {
      console.error('❌ API response is not an array:', listings);
      return [];
    }

    return listings;
  } catch (error) {
    console.error('❌ Failed to fetch listings:', error);
    return [];
  }
}
