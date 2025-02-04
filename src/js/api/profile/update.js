//src/js/api/profile/update.js
import { API_AUCTION_PROFILES } from '../constants.js';
import { headers } from '../headers.js';
import { getAuthToken, isValidUrl } from '../utils.js';

/**
 * Sends a PUT request to update the user's profile.
 * @param {string} username - The username of the profile being updated.
 * @param {Object} data - The profile data to update (bio, avatar, banner).
 * @returns {Promise<Object>} - The updated profile data or an error.
 */
export async function updateProfile(username, data) {
  const token = getAuthToken();
  if (!username || !token) {
    throw new Error('Authentication error. Please log in again.');
  }

  // ✅ Validate URLs
  if (data.avatar?.url && !isValidUrl(data.avatar.url)) {
    throw new Error('Invalid Avatar URL. Please enter a valid image URL.');
  }
  if (data.banner?.url && !isValidUrl(data.banner.url)) {
    throw new Error('Invalid Banner URL. Please enter a valid image URL.');
  }

  console.log('🔹 Sending API Request:', JSON.stringify(data));

  try {
    const response = await fetch(`${API_AUCTION_PROFILES}/${username}`, {
      method: 'PUT',
      headers: headers(true, token),
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ API Update Failed:', responseData);
      throw new Error(
        `Failed to update profile: ${
          responseData.errors
            ? responseData.errors[0].message
            : response.statusText
        }`
      );
    }

    return responseData.data; // ✅ Return updated profile data
  } catch (error) {
    console.error('❌ Error updating profile via API:', error);
    throw error;
  }
}


