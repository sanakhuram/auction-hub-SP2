import { API_AUCTION_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";

/**
 * Creates a new auction listing.
 * @param {Object} listingData - The listing data.
 * @returns {Promise<Object>} - The created listing data.
 */
export async function createListing(listingData) {
  try {
    console.log("📡 Sending POST request to:", API_AUCTION_LISTINGS);
    console.log("📝 Data being sent:", JSON.stringify(listingData, null, 2));

    const response = await fetch(API_AUCTION_LISTINGS, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ Error ${response.status}:`, errorData);
      throw new Error(errorData.message || "Failed to create listing");
    }

    const responseData = await response.json();
    console.log("✅ API Response Data:", responseData);
    return responseData;
  } catch (error) {
    console.error("❌ API Error:", error);
    throw new Error("An error occurred while creating your listing.");
  }
}
