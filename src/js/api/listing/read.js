//src/js/api/listing/read.js

import { API_AUCTION_LISTINGS } from '../constants.js';

export async function getListings() {
  try {
    const response = await fetch(API_AUCTION_LISTINGS);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    console.log("Fetched Listings:", data); // Debug log
    return data;
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return [];
  }
}
