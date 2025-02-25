import { API_AUCTION_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";
import { getToken } from "../../token";

/**
 * Creates a new auction listing.
 * @param {Object} listingData - The listing data.
 * @returns {Promise<Object>} - The created listing data.
 */
export async function createListing(listingData) {
  try {
    const response = await fetch(API_AUCTION_LISTINGS, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Create Listing Error:", errorData);
      throw new Error(errorData.message || "Failed to create listing");
    }

    return await response.json();
  } catch (error) {
    console.error("Create Listing Error:", error);
    throw new Error("An error occurred while creating your listing.");
  }
}

/**
 * Deletes a listing by ID.
 * @param {string} listingId - The ID of the listing to delete.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
export async function deleteListing(listingId) {
  const token = getToken();
  if (!token) {
    alert("❌ Authentication token is missing.");
    return false;
  }

  const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: headers(false),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete Listing API Response:", errorText);
      throw new Error(
        `Failed to delete listing. Status: ${response.status} - ${errorText}`,
      );
    }
    return true;
  } catch (error) {
    console.error("Delete Listing Error:", error);
    return false;
  }
}
