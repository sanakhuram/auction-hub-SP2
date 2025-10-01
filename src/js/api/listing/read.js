import { API_AUCTION_LISTINGS } from "../constants.js";

/**
 * Fetches all auction listings from the API with optional filtering by category or search query.
 * Ensures that each listing has a seller object with a name and avatar, even if missing in the API response.
 *
 * @param {string} [categoryFilter=""] - Optional category to filter listings by.
 * @param {string} [searchQuery=""] - Optional search term to filter listings by title or tags.
 * @returns {Promise<Array<Object>>} - Returns a Promise that resolves to an array of listing objects.
 * Each listing object contains:
 *  - id {string} - Unique identifier of the listing.
 *  - title {string} - Listing title.
 *  - description {string} - Listing description.
 *  - category {string} - First tag or 'Other'.
 *  - tags {Array<string>} - Array of tags associated with the listing.
 *  - media {Array<Object>} - Array of media objects with `url` and `alt`.
 *  - created {string} - Creation timestamp.
 *  - endsAt {string} - Auction end timestamp.
 *  - bidCount {number} - Total number of bids.
 *  - bids {Array<Object>} - Array of bid objects.
 *  - startingPrice {number} - Starting price of the auction.
 *  - seller {Object} - Seller information:
 *      - name {string} - Seller name (fallback "Anonymous Seller").
 *      - avatar {Object} - Seller avatar:
 *          - url {string} - URL of the avatar (fallback "/images/default-avatar.png").
 */

export async function getListings(categoryFilter = "", searchQuery = "") {
  try {
    let apiUrl = `${API_AUCTION_LISTINGS}?sort=created&sortOrder=desc&_bids=true&_active=true&_seller=true`;

    if (searchQuery) {
      apiUrl = `${API_AUCTION_LISTINGS}/search?q=${encodeURIComponent(searchQuery)}&_bids=true&_seller=true`;
    } else if (categoryFilter) {
      apiUrl += `&_tag=${encodeURIComponent(categoryFilter)}&_bids=true&_seller=true`;
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
      tags: listing.tags || [],
      media: listing.media || [],
      created: listing.created,
      endsAt: listing.endsAt,
      bidCount: listing._count?.bids || 0,
      bids: listing.bids || [],
      startingPrice: listing.startingPrice || 0,
      seller: listing.seller
        ? {
            name: listing.seller.name || "Anonymous Seller",
            avatar: listing.seller.avatar || {
              url: "/images/default-avatar.png",
            },
          }
        : {
            name: "Anonymous Seller",
            avatar: { url: "/images/default-avatar.png" },
          },
    }));
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return [];
  }
}

/**
 * Fetches a single auction listing by ID, including seller and bids.
 *
 * @param {string} listingId - The unique ID of the listing to fetch.
 * @returns {Promise<Object|null>} - Returns a Promise resolving to a listing object or null if failed.
 * The returned object structure mirrors the objects returned by `getListings`.
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
