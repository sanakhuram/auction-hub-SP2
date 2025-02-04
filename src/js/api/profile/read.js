//src/js/api/profile/read.js

import { API_AUCTION_PROFILES } from '../constants.js';
import { headers } from '../headers.js';
import { getAuthToken } from '../utils.js';

/**
 * Fetches a user's profile data from the API.
 * @param {string} username - The username to fetch.
 * @returns {Promise<Object>} - The profile data.
 */
export async function fetchProfile(username) {
  const token = getAuthToken();
  if (!token) {
    alert('Authentication token is missing. Redirecting to login...');
    window.location.href = '/auth/login.html';
    return null;
  }

  const apiUrl = `${API_AUCTION_PROFILES}/${username}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: headers(false, token),
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert('Unauthorized. Redirecting to login...');
        window.location.href = '/auth/login.html';
        return null;
      }
      const errorData = await response.json();
      throw new Error(
        `Failed to load profile: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data?.data || null; // Ensure we return only the `data` field from API response
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    return null;
  }
}
