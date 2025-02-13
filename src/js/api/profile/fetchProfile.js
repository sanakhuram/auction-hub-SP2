import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";

/**
 * Fetch seller profile data from API
 * @param {string} username - The seller's username
 * @returns {Promise<Object|null>} - Seller profile data or null on error
 */
export async function getSellerProfile(username) {
  try {
    if (!username) {
      throw new Error("Seller username is required");
    }

    const apiUrl = `${API_AUCTION_PROFILES}/${username}?_listings=true&_wins=true&_bids=true&_highestBid=true&_media=true&_created=true`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers(),
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    return null;
  }
}
