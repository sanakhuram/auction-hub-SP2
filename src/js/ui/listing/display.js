import { getListings } from '../../api/listing/read.js';

export async function displayListings() {
  const listingsContainer = document.querySelector('#listings-container');

  if (!listingsContainer) return; // Ensure container exists

  listingsContainer.innerHTML =
    '<p class="text-purple-600">Loading listings...</p>';

  const listings = await getListings();
  console.log('Listings received:', listings);

  // 🛑 Ensure listings is an array before proceeding
  if (!Array.isArray(listings) || listings.length === 0) {
    listingsContainer.innerHTML =
      '<p class="text-red-500">No listings available.</p>';
    return;
  }

  // 📌 Sort and Categorize Listings
  const newestListings = [...listings]
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, 5);

  const endingSoonListings = [...listings]
    .filter((listing) => new Date(listing.endsAt) > new Date())
    .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt))
    .slice(0, 5);

  // 📌 Create Sections in HTML
  listingsContainer.innerHTML = `
    <h2 class="text-purple-700 text-2xl font-bold mb-2">Newest Listings</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="new-listings"></div>

    <h2 class="text-green-700 text-2xl font-bold mt-6 mb-2">Ending Soon</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="ending-soon"></div>

    <h2 class="text-orange-700 text-2xl font-bold mt-6 mb-2">All Listings</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="all-listings"></div>
  `;

  // 📌 Render Listings
  renderListings(newestListings, '#new-listings', 'bg-purple-100');
  renderListings(endingSoonListings, '#ending-soon', 'bg-green-100');
  renderListings(listings, '#all-listings', 'bg-orange-100'); // Show all listings
}

// 📌 Function to Render Listings
function renderListings(listings, containerSelector, bgColor) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML =
    listings.length === 0
      ? '<p class="text-gray-500">No listings available.</p>'
      : listings
          .map(
            (listing) => `
        <div class="p-4 shadow-lg rounded-lg ${bgColor}">
          <h3 class="text-lg font-semibold text-gray-900">${listing.title}</h3>
          <img src="${listing.media?.[0] || '/images/placeholder.png'}" alt="${
              listing.title
            }" class="w-full h-40 object-cover rounded-md" />
          <p class="text-gray-700 mt-2">Current Bid: <span class="font-bold">${
            listing.price
          } Credits</span></p>
          <p class="text-gray-500">Ends on: ${new Date(
            listing.endsAt
          ).toLocaleDateString()}</p>
        </div>
      `
          )
          .join('');
}
