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

    updateTimers(); // Start the countdown timers
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
        
        <a href="/listing/?id=${listing.id}">
          <img src="${getValidImage(listing.media)}"
            alt="${listing.media?.[0]?.alt || listing.title}"
            class="w-full h-40 object-cover rounded-md mt-2 cursor-pointer hover:opacity-80 transition-opacity"
            onerror="this.src='/images/placeholder.jpg';" />
        </a>

        <h3 class="font-heading text-lg line-clamp-2 mt-2 dark:text-dark">${
          listing.title
        }</h3>

        <p class="text-red-800 mt-8">Current Bid: 
          <strong>${formatCurrency(highestBid)}</strong>
        </p>

        <p class="text-gray-700 mt-2">Ends on: 
          <span class="countdown-timer px-3 py-1 rounded-lg text-white font-semibold bg-btn-gradient shadow-sm " 
            data-end-time="${listing.endsAt}">
          </span>
        </p>
      </div>
    `;
    })
    .join("");
}

/**
 * Updates the countdown timers for each listing
 */
function updateTimers() {
  setInterval(() => {
    document.querySelectorAll(".countdown-timer").forEach((timerElement) => {
      const endTime = new Date(
        timerElement.getAttribute("data-end-time"),
      ).getTime();
      const now = new Date().getTime();
      const timeRemaining = endTime - now;

      if (timeRemaining <= 0) {
        timerElement.innerHTML =
          "<span class='text-red-600 font-bold'>Expired</span>";
        return;
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      timerElement.innerHTML = `
        ${days}d ${hours}h ${minutes}m ${seconds}s
      `;
    });
  }, 1000);
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

/**
 * Gets a valid image URL or returns a placeholder if none exist
 * @param {Array} media - Media array containing images
 * @returns {string} - Valid image URL
 */
function getValidImage(media) {
  return Array.isArray(media) && media.length > 0 && media[0]?.url
    ? media[0].url
    : "/images/placeholder.jpg";
}
