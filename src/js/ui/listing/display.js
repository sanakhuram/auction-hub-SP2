//src/js/ui/listing/display.js

import { getListings } from '../../api/listing/read.js';

/**
 * Fetches and displays listings sorted into categories:
 * - Newest (Purple)
 * - Ending Soon (Green)
 * - All Listings (Orange)
 */
export async function displayListings() {
  console.log(`🔵 Fetching and displaying listings...`);

  const listingsContainer = document.querySelector('#listings-container');
  if (!listingsContainer) {
    console.error('❌ #listings-container NOT FOUND in DOM!');
    return;
  }

  listingsContainer.innerHTML =
    '<p class="text-purple-600 font-semibold text-lg">Loading listings...</p>';

  const listings = await getListings();
  if (!Array.isArray(listings) || listings.length === 0) {
    listingsContainer.innerHTML =
      '<p class="text-red-500 font-semibold text-lg">No listings available.</p>';
    return;
  }

  console.log('✅ Listings received:', listings); // Debugging line

  // Sorting listings into categories
  const newestListings = [...listings].sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );
  const endingSoonListings = [...listings].sort(
    (a, b) => new Date(a.endsAt) - new Date(b.endsAt)
  );

  // Render the listings
  listingsContainer.innerHTML = `
    <h2 class="text-purple-600 font-bold text-xl mb-2">Newest Listings</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${renderListings(
      newestListings,
      'bg-purple-200 border-purple-500'
    )}</div>

    <h2 class="text-green-600 font-bold text-xl mt-6 mb-2">Ending Soon</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${renderListings(
      endingSoonListings,
      'bg-green-200 border-green-500'
    )}</div>

    <h2 class="text-orange-600 font-bold text-xl mt-6 mb-2">All Listings</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${renderListings(
      listings,
      'bg-orange-200 border-orange-500'
    )}</div>
  `;
}

/**
 * Renders a list of listings into Tailwind-styled cards
 * @param {Array} listings - The listings to render
 * @param {string} colorClass - Tailwind background & border classes
 * @returns {string} - HTML content for listings
 */
function renderListings(listings, colorClass) {
  return listings
    .map(
      (listing) => `
      <div class="p-4 border-2 rounded-lg ${colorClass} shadow-lg">
        <h3 class="text-lg font-semibold">${listing.title}</h3>
        <img src="${getValidImage(listing.media)}"
          alt="${listing.media?.[0]?.alt || listing.title}"
          class="w-full h-40 object-cover rounded-md mt-2"
          onerror="this.src='/images/placeholder.jpg';"
        />
        <p class="text-gray-700 mt-2">Current Bid: <strong>${
          listing.price || 'N/A'
        } Credits</strong></p>
        <p class="text-gray-500">Ends on: ${new Date(
          listing.endsAt
        ).toLocaleDateString()}</p>
<a href="/listing/index.html?id=${listing.id}" 
   class="inline-block bg-blue-500 text-white px-4 py-2 mt-3 rounded-lg hover:bg-blue-700 transition">
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
