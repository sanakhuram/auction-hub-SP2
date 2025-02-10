import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";
import { getAuthToken } from "../utils.js";

/**
 * Updates the user's profile if there are changes.
 * @param {string} username - The profile username.
 * @param {Object} updatedData - Only modified profile fields.
 * @returns {Promise<Object>} - The updated profile or an error.
 */
export async function updateProfile(username, updatedData) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication error. Please log in again.");
  }

  // API URL
  const apiUrl = `${API_AUCTION_PROFILES}/${username}`;

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: headers(true, token),
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.errors?.[0]?.message ||
          "Error updating profile. Please try again.",
      );
    }

    return data.data;
  } catch (error) {
    console.error("❌ Error in updateProfile:", error);
    throw new Error("Error updating profile. Please try again.");
  }
}
