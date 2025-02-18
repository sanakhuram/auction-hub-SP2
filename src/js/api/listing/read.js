import { API_AUCTION_LISTINGS } from "../constants.js";

/**
 * Fetches listings from the API, supporting search and category filtering.
 * @param {string} categoryFilter - The category to filter by (optional).
 * @param {string} searchQuery - The search query for filtering (optional).
 * @returns {Promise<Array>} - The fetched listings.
 */
export async function getListings(categoryFilter = "", searchQuery = "") {
  try {
    let apiUrl = `${API_AUCTION_LISTINGS}?sort=created&sortOrder=desc&_bids=true&_active=true`;

    if (searchQuery) {
      apiUrl = `${API_AUCTION_LISTINGS}/search?q=${encodeURIComponent(searchQuery)}&_bids=true`;
    } else if (categoryFilter) {
      apiUrl += `&_tag=${encodeURIComponent(categoryFilter)}`;
    }

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    const listings = data.data || [];

    return listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description || "",
      category: listing.tags?.[0] || "Other",
      media: listing.media || [],
      created: listing.created,
      endsAt: listing.endsAt,
      bidCount: listing._count?.bids || 0,
      bids: listing.bids || [],
      startingPrice: listing.startingPrice || 0,
      seller: listing.seller?.name || "Unknown Seller",
    }));
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return [];
  }
}

/**
 * Fetches a single listing by its ID, including seller details.
 * @param {string} listingId - The ID of the listing to fetch.
 * @returns {Promise<Object>} - The listing data.
 */
export async function getListingById(listingId) {
  try {
    const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}?_seller=true&_bids=true`;
    const response = await fetch(apiUrl);

    if (!response.ok)
      throw new Error(`Failed to fetch listing ID ${listingId}`);

    return await response.json();
  } catch (error) {
    console.error(`Error fetching listing ID ${listingId}:`, error);
    return null;
  }
}
