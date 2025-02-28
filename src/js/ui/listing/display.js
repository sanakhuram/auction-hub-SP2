import { getListings } from "../../api/listing/read";
import {
  paginateListings,
  renderPaginationControls,
} from "../../utilities/pagination";
import { getCurrentSearchQuery } from "../../utilities/search";
import { showAlert } from "../../utilities/alert";

/**
 * Fetches and displays listings based on filters, search query, and pagination.
 * - Displays newest listings, ending soon listings, and all listings.
 * - Handles pagination and updates timers for auction end times.
 */
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
      showAlert("No listings found for the given filters.", "warning");
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
      <div class="relative flex justify-center items-center">
        <button id="prev-newest" class="absolute left-2 bg-black bg-opacity-50 text-white p-3 rounded-full z-50">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div id="newest-container" class="overflow-x-auto whitespace-nowrap flex space-x-6 p-6 mt-5 bg-accent w-max shadow-dark rounded-lg">
          ${renderListings(newestListings, "bg-muted border-accent")}
        </div>
        <button id="next-newest" class="absolute right-2 bg-black bg-opacity-50 text-white p-3 rounded-full z-50">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <h2 class="text-black text-center text-xl p-5 mt-12 mb-10 bg-sepia w-full shadow-accent">
        Ending Soon
      </h2>
      <div class="relative flex justify-center items-center">
        <button id="prev-ending" class="absolute left-2 bg-black bg-opacity-50 text-white p-3 rounded-full z-50">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div id="ending-container" class="overflow-x-auto whitespace-nowrap flex space-x-6 p-6 bg-olive w-max shadow-dark rounded-lg">
          ${renderListings(endingSoonListings, "bg-sepia border-olive")}
        </div>
        <button id="next-ending" class="absolute right-2 bg-black bg-opacity-50 text-white p-3 rounded-full z-50">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <h2 class="text-black text-center text-xl p-5 mt-10 mb-8 bg-olive w-full shadow-primary">
        All Listings
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-6xl mx-auto bg-secondary rounded-lg shadow-primary">
        ${renderListings(paginatedItems, "bg-olive border-secondary")}
      </div>
    `;

    renderPaginationControls(totalPages, currentPage, (newPage) => {
      displayListings(categoryFilter, searchQuery, newPage);
    });

    updateTimers();
    setupScrollArrows("newest-container", "prev-newest", "next-newest");
    setupScrollArrows("ending-container", "prev-ending", "next-ending");
  } catch (error) {
    listingsContainer.innerHTML =
      '<p class="text-red-500 font-semibold text-lg">Error loading listings.</p>';
    showAlert(`Error loading listings: ${error.message}`, "error");
  } finally {
    loader.style.display = "none";
  }
}

/**
 * Sets up scroll arrow functionality for both desktop and mobile.
 * Ensures the listings container scrolls left/right when users tap the navigation arrows.
 *
 * @param {string} containerId - The ID of the scrollable container.
 * @param {string} prevBtnId - The ID of the "previous" button.
 * @param {string} nextBtnId - The ID of the "next" button.
 */
function setupScrollArrows(containerId, prevBtnId, nextBtnId) {
  const container = document.getElementById(containerId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  if (!container || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener("click", () => {
    container.scrollBy({
      left: -container.clientWidth / 2,
      behavior: "smooth",
    });
  });

  nextBtn.addEventListener("click", () => {
    container.scrollBy({ left: container.clientWidth / 2, behavior: "smooth" });
  });
}
/**
 * Generates HTML markup for a list of listings.
 *
 * @param {Array} listings - The array of listing objects.
 * @param {string} colorClass - Tailwind CSS class for styling listing cards.
 * @returns {string} - HTML string containing the listings.
 */

function renderListings(listings, colorClass) {
  return listings
    .map((listing) => {
      const highestBid =
        listing.bids.length > 0
          ? Math.max(...listing.bids.map((bid) => bid.amount))
          : listing.startingPrice || 0;

      return `
      <div class="listing-item p-4 border-2 rounded-lg ${colorClass} shadow-dark w-full max-w-sm mx-auto transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
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

        <p class="text-gray-700 mt-2">Ends: 
          <span class="countdown-timer px-3 py-1 rounded-lg text-white font-bold bg-btn-gradient shadow-sm " 
            data-end-time="${listing.endsAt}">
          </span>
        </p>
      </div>
    `;
    })
    .join("");
}

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
 * Retrieves a valid image URL for a listing or returns a placeholder if none exist.
 *
 * @param {Array} media - Media array containing image objects.
 * @returns {string} - Valid image URL or placeholder image path.
 */

function getValidImage(media) {
  return Array.isArray(media) && media.length > 0 && media[0]?.url
    ? media[0].url
    : "/images/placeholder.jpg";
}
