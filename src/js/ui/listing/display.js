import { getListings } from "../../api/listing/read";
import {
  paginateListings,
  renderPaginationControls,
} from "../../utilities/pagination";
import { getCurrentSearchQuery } from "../../utilities/search";


export async function displayListings(
  categoryFilter = "",
  searchQuery = "",
  currentPage = 1,
) {
  const listingsContainer = document.querySelector("#listings-container");
  const loader = document.getElementById("loader");
  if (!listingsContainer || !loader) return;

  loader.style.display = "flex"; 

  try {
    if (!searchQuery) searchQuery = getCurrentSearchQuery();
    const listings = await getListings(categoryFilter, searchQuery);

    if (!Array.isArray(listings) || listings.length === 0) {
      listingsContainer.innerHTML =
        '<p class="text-red-500 font-semibold text-lg">No listings found.</p>';
      loader.style.display = "none"; 
      return;
    }

    const { paginatedItems, totalPages } = paginateListings(
      listings,
      currentPage,
    );
    const newestListings = [...listings]
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .slice(0, 8);
    const endingSoonListings = [...listings]
      .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt))
      .slice(0, 8);

    listingsContainer.innerHTML = `
      <h2 class="text-black text-xl text-center bg-accent mb-10 p-5 mt-6 shadow-secondary w-full">
        Newest Listings
      </h2>
      <div class="flex justify-center">
        <div class="overflow-x-auto whitespace-nowrap flex space-x-6 p-6 mt-5 bg-accent w-max shadow-dark rounded-lg">
          ${renderListings(newestListings, "bg-muted border-accent")}
        </div>
      </div>

      <h2 class="text-black text-center text-xl p-5 mt-12 mb-10 bg-sepia w-full shadow-accent">
        Ending Soon
      </h2>
      <div class="flex justify-center">
        <div class="overflow-x-auto whitespace-nowrap flex space-x-6 p-6 bg-olive w-max shadow-dark rounded-lg">
          ${renderListings(endingSoonListings, "bg-sepia border-olive")}
        </div>
      </div>

      <h2 class="text-black text-center text-xl p-5 mt-10 mb-8 bg-olive w-full shadow-primary">
        All Listings
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 bg-secondary rounded-lg m-10 shadow-primary">
        ${renderListings(paginatedItems, "bg-olive border-secondary")}
      </div>
    `;

    renderPaginationControls(totalPages, currentPage, (newPage) => {
      displayListings(categoryFilter, searchQuery, newPage);
    });
  } catch (error) {
    listingsContainer.innerHTML =
      '<p class="text-red-500 font-semibold text-lg">Error loading listings.</p>';
  } finally {
    loader.style.display = "none"; 
  }
}

function renderListings(listings, colorClass) {
  return listings
    .map((listing) => {
      const highestBid =
        listing.bids.length > 0
          ? Math.max(...listing.bids.map((bid) => bid.amount))
          : listing.startingPrice || 0;

      return `
      <div class="listing-item p-4 border-2 rounded-lg ${colorClass} shadow-dark w-full max-w-xs mx-auto transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
        <img src="${getValidImage(listing.media)}"
          alt="${listing.media?.[0]?.alt || listing.title}"
          class="w-full h-40 object-cover rounded-md mt-2"
          onerror="this.src='/images/placeholder.jpg';" />
        
        <h3 class="text-base font-bold font-secondary line-clamp-2 mt-2">${
          listing.title
        }</h3>

        <p class="text-gray-700 mt-2 dark:text-white">Current Bid: 
          <strong>${formatCurrency(highestBid)}</strong>
        </p>

        <p class="text-gray-700">Ends on: ${new Date(
          listing.endsAt,
        ).toLocaleDateString()}</p>

        <a href="/listing/?id=${listing.id}" 
          class="inline-block bg-btn-gradient text-dark px-4 py-2 mt-3 rounded-lg border border-body hover:bg-dark hover:text-white transition-all">
          Place Bid 
        </a>
      </div>
    `;
    })
    .join("");
}



/**
 * Formats a number into USD currency format.
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}


function getValidImage(media) {
  return Array.isArray(media) && media.length > 0 && media[0]?.url
    ? media[0].url
    : "/images/placeholder.jpg";
}
