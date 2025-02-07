//src/js/api/listing/bid.js

import { API_AUCTION_LISTINGS } from '../constants.js';

/**
 * Places a bid on a listing.
 * @param {string} listingId - The ID of the listing.
 * @param {number} bidAmount - The amount to bid.
 * @returns {Promise<Object>} - The bid response.
 */
export async function placeBid(listingId, bidAmount) {
  try {
    const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}/bids`;

    const token = localStorage.getItem('authToken'); 
    if (!token) {
      alert('You must be logged in to place a bid.');
      window.location.href = '/auth/login/';
      return;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: bidAmount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`❌ API Error: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error placing bid:`, error);
    alert(`Failed to place bid: ${error.message}`);
    return null;
  }
}
