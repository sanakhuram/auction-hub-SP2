import { API_AUCTION_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";

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
    console.error(`Error placing bid:`, error);
    alert(`Failed to place bid: ${error.message}`);
    return null;
  }
}

/**
 * Fetches bid history for a given listing and updates the UI.
 * @param {string} listingId - The ID of the listing.
 */
export async function fetchBids(listingId) {
  try {
    const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}/bids`;
    const response = await fetch(apiUrl, { headers: headers() });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("No bid history found. Returning empty list.");
        return []; // Return empty array instead of error
      }
      throw new Error("Failed to fetch bid history");
    }

    const bids = await response.json();
    bids.sort((a, b) => b.amount - a.amount);
    return bids;
  } catch (error) {
    console.error("Error fetching bids:", error);
    return [];
  }
}

/**
 * Loads bid history when the page loads and displays it in the UI.
 * @param {string} listingId - The ID of the listing.
 */
export async function loadBidHistory(listingId) {
  const bids = await fetchBids(listingId);

  const bidHistoryContainer = document.getElementById("bid-history");
  if (bidHistoryContainer) {
    bidHistoryContainer.innerHTML =
      `<h2 class="text-xl text-center m-5">Bid History</h2>` +
      (bids.length
        ? bids
            .map(
              (bid) =>
                `<div class="p-3 border-b text-center"><strong>${
                  bid.bidder || "Anonymous"
                }:</strong> $$${
                  bid.amount
                } <span class='text-gray-500'>(${new Date(
                  bid.timestamp,
                ).toLocaleString()})</span></div>`,
            )
            .join("")
        : '<p class="text-gray-500 text-center">No bids yet.</p>');
  }
}
