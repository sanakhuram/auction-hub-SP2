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
 * - Handles pagination and updates countdown timers for auction end times.
 *
 * @async
 * @param {string} [categoryFilter=""] - Optional category to filter listings.
 * @param {string} [searchQuery=""] - Optional search query.
 * @param {number} [currentPage=1] - Current page for pagination.
 * @returns {Promise<void>} Resolves once listings are rendered and timers updated.
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
    const listings = await getListings(categoryFilter, searchQuery, {
      _seller: true,
      _bids: true,
    });

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
      .slice(0, 4);
    const endingSoonListings = [...listings]
      .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt))
      .slice(0, 4);

    listingsContainer.innerHTML = `
      <h2 class="text-black text-xl text-center bg-accent mb-4 p-4 mt-6 shadow-secondary w-full">
        Newest Listings
      </h2>
      <div class="relative flex justify-center items-center overflow-x-auto" id="newest-container">
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 w-full bg-accent ">
  ${renderListings(newestListings, "bg-accent")}
</div>

      </div>

      <h2 class="text-black text-center text-xl p-4 mt-12 mb-4 bg-olive w-full shadow-accent ">
        Ending Soon
      </h2>
      <div class="relative flex justify-center items-center overflow-x-auto" id="ending-container">

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 w-full bg-olive">
  ${renderListings(endingSoonListings, "bg-olive")}
</div>

      </div>

      <h2 class="text-black text-center text-xl p-4 mt-10 mb-8 bg-secondary w-full shadow-primary">
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
<div class="listing-item p-3 border-2 rounded-lg ${colorClass} shadow-dark w-full max-w-sm mx-auto transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
  <a href="/listing/?id=${listing.id}">
    <img src="${getValidImage(listing.media)}"
         alt="${listing.media?.[0]?.alt || listing.title}"
         class="w-full h-36 object-cover rounded-md mt-1 cursor-pointer hover:opacity-80 transition-opacity"
         onerror="this.src='/images/placeholder.jpg';" />
  </a>

  <h3 class="font-heading text-md line-clamp-2 mt-2 dark:text-dark">${listing.title}</h3>

  <div class="flex items-center gap-2 mt-1">
    <img src="${listing.seller?.avatar?.url || "/images/default-avatar.png"}" 
         alt="${listing.seller?.name || "Seller"}"
         class="w-5 h-5 rounded-full"/>
    <span class="text-sm text-gray-700">${listing.seller?.name || "Anonymous Seller"}</span>
  </div>

  <!-- Tags -->
  ${
    listing.tags && listing.tags.length > 0
      ? `<div class="flex flex-wrap gap-1 mt-1">
           ${listing.tags.map((tag) => `<span class="px-1 py-0.5 border border-dotted rounded text-xs">${tag}</span>`).join("")}
         </div>`
      : ""
  }

  <!-- Description snippet -->
  <p class="text-gray-600 text-sm mt-1 line-clamp-2">${listing.description || ""}</p>

  <!-- Highest bid and number of bids -->
  <p class="text-red-800 mt-2 text-sm">Current Bid: 
    <strong>${formatCurrency(highestBid)}</strong> 
    (${listing._count?.bids || listing.bids.length} bids)
  </p>

  <!-- Ends at timer -->
  <p class="text-gray-700 mt-1 text-sm">Ends: 
    <span class="countdown-timer px-2 py-0.5 rounded-lg text-white font-bold bg-btn-gradient shadow-sm" 
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
