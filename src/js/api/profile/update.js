import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";
import { getAuthToken } from "../utils.js";

/**
 * Updates the user's profile with valid changes.
 * @param {string} username - The profile username.
 * @param {Object} updatedData - Only modified profile fields.
 * @returns {Promise<Object>} - The updated profile or an error.
 */
export async function updateProfile(username, updatedData) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication error. Please log in again.");
  }

  if (updatedData.avatar?.url && updatedData.avatar.url.length > 300) {
    throw new Error("Avatar URL cannot exceed 300 characters.");
  }
  if (updatedData.banner?.url && updatedData.banner.url.length > 300) {
    throw new Error("Banner URL cannot exceed 300 characters.");
  }

  delete updatedData.username;

  const apiUrl = `${API_AUCTION_PROFILES}/${username}`;

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: headers(true, token),
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("This profile information already exists.");
      }
      throw new Error(
        data.errors?.[0]?.message ||
          "Error updating profile. Please try again.",
      );
    }

    return data.data;
  } catch (error) {
    throw new Error(
      error.message || "Error updating profile. Please try again.",
    );
  }
}
