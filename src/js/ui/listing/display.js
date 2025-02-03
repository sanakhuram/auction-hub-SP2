import { getListings } from "../../api/listing/read";

/**
 * Fetches and displays listings, supporting category filtering.
 * @param {string} categoryFilter - The category to filter by (optional).
 */
export async function displayListings(categoryFilter = '') {
  console.log(`🔵 Fetching listings... Category: ${categoryFilter || 'All'}`);

  const listingsContainer = document.querySelector('#listings-container');
  if (!listingsContainer) {
    console.error('❌ #listings-container NOT FOUND in DOM!');
    return;
  }

  listingsContainer.innerHTML =
    '<p class="text-purple-600 font-semibold text-lg">Loading listings...</p>';

  try {
    const listings = await getListings(categoryFilter);

    if (!Array.isArray(listings) || listings.length === 0) {
      listingsContainer.innerHTML =
        '<p class="text-red-500 font-semibold text-lg">No listings found for this category.</p>';
      return;
    }

    console.log(`✅ Listings received:`, listings);

    // Sorting listings
    const newestListings = [...listings].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
    const endingSoonListings = [...listings].sort(
      (a, b) => new Date(a.endsAt) - new Date(b.endsAt)
    );

    // Render Listings
    listingsContainer.innerHTML = `
      <h2 class="text-black font-bold text-xl  text-center bg-accent mb-8">Newest Listings</h2>
      <div class="overflow-x-auto whitespace-nowrap flex space-x-4 p-4 bg-accent">${renderListings(
        newestListings,
        'bg-muted border-purple-500'
      )}</div>

      <h2 class="text-black font-bold text-center text-xl mt-6 mb-8 bg-sepia ">Ending Soon</h2>
      <div class="overflow-x-auto whitespace-nowrap flex space-x-4 p-4 bg-olive">${renderListings(
        endingSoonListings,
        'bg-sepia border-grey'
      )}</div>

      <h2 class="text-black font-bold text-center text-xl mt-6 mb-8 bg-olive">All Listings</h2>
      <div class="overflow-y-auto whitespace-nowrap flex space-x-4 p-4 bg-secondary">${renderListings(
        listings,
        'bg-olive border-orange-500'
      )}</div>
    `;
  } catch (error) {
    console.error('❌ Error fetching listings:', error);
    listingsContainer.innerHTML =
      '<p class="text-red-500 font-semibold text-lg">Error loading listings.</p>';
  }
}

/**
 * Renders listings and adds `data-category` attribute for filtering. bg
 */
function renderListings(listings, colorClass) {
  return listings
    .map(
      (listing) => `
      <div class="listing-item p-4 border-2 rounded-lg ${colorClass} shadow-lg w-80"
           data-category="${listing.category || 'Other'}">
        <h3 class="text-lg font-semibold">${listing.title}</h3>
        <img src="${getValidImage(listing.media)}"
             alt="${listing.media?.[0]?.alt || listing.title}"
             class="w-full h-40 object-cover rounded-md mt-2"
             onerror="this.src='/images/placeholder.jpg';" />
        <p class="text-gray-700 mt-2">Current Bid: <strong>${
          listing.bidCount || 'N/A'
        } Credits</strong></p>
        <p class="text-gray-500">Ends on: ${new Date(
          listing.endsAt
        ).toLocaleDateString()}</p>
        <a href="/listing/index.html?id=${listing.id}" 
           class="inline-block bg-sepia text-white px-4 py-2 mt-3 rounded-lg hover:bg-blue-700 transition">
           View Listing
        </a>
      </div>
    `
    )
    .join('');
}

/**
 * Ensures the listing has a valid image or provides a placeholder.
 * @param {Array} media - The media array from API response.
 * @returns {string} - The valid image URL or a placeholder.
 */
function getValidImage(media) {
  if (Array.isArray(media) && media.length > 0 && media[0]?.url) {
    return media[0].url;
  }
  return '/images/placeholder.jpg';
}
