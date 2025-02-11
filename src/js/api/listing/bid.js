import { API_AUCTION_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";
import { getListingById } from "./read.js";

/**
 * Formats a number into USD currency format.
 * @param {number} amount - The amount to format.
 * @returns {string} - Formatted currency string.
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Places a bid on a listing.
 * @param {string} listingId - The ID of the listing.
 * @param {number} bidAmount - The amount to bid.
 * @returns {Promise<Object>} - The bid response.
 */
export async function placeBid(listingId, bidAmount) {
  try {
    const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}/bids`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify({ amount: bidAmount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error placing bid:", error);
    alert(`Failed to place bid: ${error.message}`);
    return null;
  }
}

/**
 * Fetches bid history for a given listing.
 * @param {string} listingId - The ID of the listing.
 * @returns {Promise<Array>} - Sorted bid history.
 */
export async function fetchBids(listingId) {
  try {
    const listingResponse = await getListingById(listingId); // Fetch full listing
    if (!listingResponse || !listingResponse.data) {
      console.warn("⚠️ No listing data found.");
      return [];
    }

    const listing = listingResponse.data;
    const bids = listing.bids || [];

    return bids.sort((a, b) => b.amount - a.amount); // Sort bids from highest to lowest
  } catch (error) {
    console.error("❌ Error fetching listing with bids:", error);
    return [];
  }
}
