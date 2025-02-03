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
    return responseData.data || responseData;
  } catch (error) {
    console.error('❌ Failed to fetch listings:', error);
    return [];
  }
}

/**
 * Fetches a single listing by its ID.
 * @param {string} listingId - The ID of the listing to fetch.
 * @returns {Promise<Object>} - The listing data.
 */
export async function getListingById(listingId) {
  try {
    console.log(`🔎 Fetching listing with ID: ${listingId}`);

    const response = await fetch(`${API_AUCTION_LISTINGS}/${listingId}`);

    if (!response.ok) {
      throw new Error(`❌ API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', data); // Debugging Output
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch listing:', error);
    return null;
  }
}
