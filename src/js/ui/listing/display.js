//src/js/ui/listing/display.js

import { getListings } from '../../api/listing/read.js';

export async function displayListings() {
  console.log('🔵 displayListings() function is running...');

  const listingsContainer = document.querySelector('#listings-container');
  if (!listingsContainer) {
    console.error('❌ #listings-container NOT FOUND in DOM!');
    return;
  }

  listingsContainer.innerHTML =
    '<p class="text-purple-600">Loading listings...</p>';

  const listings = await getListings();
  console.log('✅ Listings received:', listings);

  // Check if listings is an array
  if (!Array.isArray(listings) || listings.length === 0) {
    console.warn('⚠️ No listings received or API returned empty array.');
    listingsContainer.innerHTML =
      '<p class="text-red-500">No listings available.</p>';
    return;
  }

  // Render Listings
  renderListings(listings, listingsContainer);
}

// Function to render listings dynamically
function renderListings(listings, container) {
  container.innerHTML = listings
    .map(
      (listing) => `
      <div class="p-4 shadow-lg rounded-lg bg-white">
        <h3 class="text-lg font-semibold">${listing.title}</h3>
        <img src="${listing.media?.[0] || '/images/placeholder.png'}" 
             alt="${listing.title}" 
             class="w-full h-40 object-cover rounded-md" />
        <p class="text-gray-700">Current Bid: <strong>${
          listing.price || 'N/A'
        } Credits</strong></p>
        <p class="text-gray-500">Ends on: ${
          new Date(listing.endsAt).toLocaleDateString() || 'N/A'
        }</p>
      </div>
    `
    )
    .join('');
}
