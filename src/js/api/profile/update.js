import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";
import { getAuthToken, isValidUrl } from "../utils.js";

/**
 * Sends a PUT request to update the user's profile.
 * @param {string} username - The username of the profile being updated.
 * @param {Object} data - The profile data to update (bio, avatar, banner).
 * @returns {Promise<Object>} - The updated profile data or an error.
 */
export async function updateProfile(username, data) {
  const token = getAuthToken();
  if (!username || !token) {
    throw new Error("Authentication error. Please log in again.");
  }

  // ✅ Validate URLs
  if (data.avatar?.url && !isValidUrl(data.avatar.url)) {
    throw new Error("Invalid Avatar URL. Please enter a valid image URL.");
  }
  if (data.banner?.url && !isValidUrl(data.banner.url)) {
    throw new Error("Invalid Banner URL. Please enter a valid image URL.");
  }

  try {
    const response = await fetch(`${API_AUCTION_PROFILES}/${username}`, {
      method: "PUT",
      headers: headers(true, token),
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(
        responseData.errors
          ? responseData.errors[0].message
          : response.statusText,
      );
    }

    return responseData.data; // ✅ Return updated profile data
  } catch (error) {
    throw new Error("Error updating profile. Please try again.");
  }
}
