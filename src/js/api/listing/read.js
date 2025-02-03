import { API_AUCTION_LISTINGS } from '../constants.js';

/**
 * Fetches listings from the API, optionally filtering by category.
 * @param {string} [categoryFilter] - The category to filter by (optional).
 * @returns {Promise<Array>} - The fetched listings.
 */
export async function getListings(categoryFilter = '') {
  try {
    let apiUrl = `${API_AUCTION_LISTINGS}?sort=created&sortOrder=desc&_active=true`;

    // ✅ Correct category filtering using `_tag`
    if (categoryFilter) {
      apiUrl += `&_tag=${encodeURIComponent(categoryFilter)}`;
    }

    console.log('🟡 Fetching listings from API:', apiUrl);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`❌ API Error: ${response.status}`);
    }

    const data = await response.json();

    // ✅ Ensure we extract the listings array from `data`
    const listings = data.data || [];

    return listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description || '',
      category: listing.tags?.[0] || 'Other', // ✅ Get the first tag as category
      media: listing.media || [],
      created: listing.created,
      endsAt: listing.endsAt,
      bidCount: listing._count?.bids || 0, // ✅ Extract bid count
      seller: listing.seller?.name || 'Unknown Seller',
    }));
  } catch (error) {
    console.error('❌ Failed to fetch listings:', error);
    return [];
  }
}

/**
 * Fetches a single listing by its ID.
 * @param {string} listingId - The ID of the listing to fetch.
 * @returns {Promise<Object>} - The listing data.
 */
export async function getListingById(listingId) {
  try {
    const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}`;
    console.log(`🔵 Fetching single listing: ${apiUrl}`);

    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`❌ Failed to fetch listing ID ${listingId}`);

    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching listing ID ${listingId}:`, error);
    return null;
  }
}
