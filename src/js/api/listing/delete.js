import { API_AUCTION_LISTINGS } from '../constants';
import { headers } from '../headers';
import { getToken } from '../../token';

/**
 * Deletes a listing by ID.
 * @param {string} listingId - The ID of the listing to delete.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
export async function deleteListing(listingId) {
  const token = getToken();
  if (!token) {
    alert('❌ Authentication token is missing.');
    return false;
  }

  const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}`;

  try {
    console.log(`🗑 Sending DELETE request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: headers(false),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to delete listing: ${errorText}`);
      throw new Error(`Failed to delete listing. Status: ${response.status}`);
    }

    console.log(`✅ Listing ${listingId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error('🚨 API Error deleting listing:', error);
    return false;
  }
}
