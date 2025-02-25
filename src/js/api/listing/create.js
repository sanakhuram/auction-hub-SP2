import { API_AUCTION_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";

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
      throw new Error(errorData.message || "Failed to create listing");
    }

    return await response.json();
  } catch (error) {
    console.error("Create Listing Error:", error);
    throw new Error("An error occurred while creating your listing.");
  }
}
