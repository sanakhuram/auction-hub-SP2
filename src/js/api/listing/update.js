import { API_AUCTION_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";
import { getToken } from "../../token.js";
/**
 * Updates an auction listing by ID.
 *
 * @param {string} id - The ID of the listing to update.
 * @param {Object} data - The updated listing data.
 * @returns {Promise<Object|null>} - The updated listing data if successful, or `null` if an error occurs.
 */
export async function updateListing(id, data) {
  const token = getToken();
  if (!token) {
    alert("Authentication token is missing.");
    return null;
  }

  try {
    const apiUrl = `${API_AUCTION_LISTINGS}/${id}`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: headers(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update listing: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Update Listing Error:", error);
    return null;
  }
}
