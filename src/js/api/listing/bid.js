import { API_AUCTION_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";
import { getListingById } from "./read.js";
import { showAlert } from "../../utilities/alert"; // Import showAlert function

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
 * @returns {Promise<Object|null>} - The bid response or null on failure.
 */
export async function placeBid(listingId, bidAmount) {
  try {
    const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}/bids`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify({ amount: bidAmount }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.message || "Failed to place bid. Please try again.",
      );
    }

    showAlert("Bid placed successfully!", "success");
    return responseData;
  } catch (error) {
    console.error("❌ Error placing bid:", error);

    showAlert(`Failed to place bid: ${error.message}`, "error");
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
    showAlert("Failed to fetch bid history. Please try again.", "error");
    return [];
  }
}
