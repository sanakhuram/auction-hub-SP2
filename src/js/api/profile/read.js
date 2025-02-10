import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";
import { getAuthToken } from "../utils.js";

/**
 * Fetches a user's profile data from the API, including their listings.
 * @param {string} username - The username to fetch.
 * @returns {Promise<Object|null>} - The profile data or null if an error occurs.
 */
export async function fetchProfile(username) {
  const token = getAuthToken();
  if (!token) {
    alert("Authentication token is missing. Redirecting to login...");
    window.location.href = "/auth/login/";
    return null;
  }

  const apiUrl = `${API_AUCTION_PROFILES}/${username}?_listings=true`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers(false, token),
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("Unauthorized. Redirecting to login...");
        window.location.href = "/auth/login/";
        return null;
      }
      const errorData = await response.json();
      throw new Error(
        `Failed to load profile: ${errorData.message || response.statusText}`,
      );
    }

    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return null;
  }
}
