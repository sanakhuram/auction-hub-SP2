import { getListings } from '../../api/listing/read';
import {
  paginateListings,
  renderPaginationControls,
} from '../../utilities/pagination';
import { getCurrentSearchQuery } from '../../utilities/search';

export async function displayListings(
  categoryFilter = '',
  searchQuery = '',
  currentPage = 1
) {
  const listingsContainer = document.querySelector('#listings-container');
  if (!listingsContainer) return;

  listingsContainer.innerHTML =
    '<p class="text-purple-600 font-semibold text-lg">Loading listings...</p>';

  try {
    if (!searchQuery) searchQuery = getCurrentSearchQuery();
    const listings = await getListings(categoryFilter, searchQuery);

    if (!Array.isArray(listings) || listings.length === 0) {
      listingsContainer.innerHTML =
        '<p class="text-red-500 font-semibold text-lg">No listings found.</p>';
      return;
    }

    // Apply pagination
    const { paginatedItems, totalPages } = paginateListings(
      listings,
      currentPage
    );

    // Sort listings by newest and soonest ending
    const newestListings = [...listings]
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .slice(0, 8);
    const endingSoonListings = [...listings]
      .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt))
      .slice(0, 8);

    listingsContainer.innerHTML = `
      <h2 class="text-black text-xl text-center bg-accent mb-10 p-5 w-full">Newest Listings</h2>
      <div class="flex justify-center">
        <div class="overflow-x-auto whitespace-nowrap flex space-x-4 p-4 bg-accent w-max">
          ${renderListings(newestListings, 'bg-muted border-purple-500')}
        </div>
      </div>

      <h2 class="text-black text-center text-xl p-5 mt-10 mb-10 bg-sepia w-full">Ending Soon</h2>
      <div class="flex justify-center">
        <div class="overflow-x-auto whitespace-nowrap flex space-x-4 p-4 bg-olive w-max">
          ${renderListings(endingSoonListings, 'bg-sepia border-grey')}
        </div>
      </div>

      <h2 class="text-black text-center text-xl p-5 mt-8 mb-6 bg-olive w-full">All Listings</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-secondary rounded-lg m-10">
        ${renderListings(paginatedItems, 'bg-olive border-orange-500')}
      </div>
    `;

    renderPaginationControls(totalPages, currentPage, (newPage) => {
      displayListings(categoryFilter, searchQuery, newPage);
    });
  } catch (error) {
    listingsContainer.innerHTML =
      '<p class="text-red-500 font-semibold text-lg">Error loading listings.</p>';
  }
}

function renderListings(listings, colorClass) {
  return listings
    .map(
      (listing) => `
      <div class="listing-item p-4 border-2 rounded-lg ${colorClass} shadow-lg w-full max-w-xs mx-auto">
        <img src="${getValidImage(listing.media)}"
          alt="${listing.media?.[0]?.alt || listing.title}"
          class="w-full h-40 object-cover rounded-md mt-2"
          onerror="this.src='/images/placeholder.jpg';" />
        <h3 class="text-base font-bold font-secondary line-clamp-2 mt-2">${
          listing.title
        }</h3>
        <p class="text-gray-700 mt-2">Current Bid: <strong>${
          listing.bidCount || 'N/A'
        } Credits</strong></p>
        <p class="text-gray-500">Ends on: ${new Date(
          listing.endsAt
        ).toLocaleDateString()}</p>
        <a href="/listing/?id=${
          listing.id
        }" class="inline-block bg-btn-gradient text-dark px-4 py-2 mt-3 rounded-lg hover:bg-blue-700 transition border border-body">Place Bid</a>
      </div>
    `
    )
    .join('');
}

function getValidImage(media) {
  return Array.isArray(media) && media.length > 0 && media[0]?.url
    ? media[0].url
    : '/images/placeholder.jpg';
}
