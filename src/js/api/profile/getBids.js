import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";
import { getAuthToken } from "../utils.js";

/**
 * Fetches all bids placed by the user, ensuring listings are included.
 * @param {string} username - The profile username.
 * @returns {Promise<Array>} - The user's bid history.
 */
export async function fetchUserBids(username) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication error. Please log in again.");
  }

  const apiUrl = `${API_AUCTION_PROFILES}/${username}/bids?_listings=true`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers(false, token),
    });

    if (!response.ok) {
      throw new Error(`Error fetching bids: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}
