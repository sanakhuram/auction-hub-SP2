import { getListingById } from "../../api/listing/read.js";
import { placeBid } from "../../api/listing/bid.js";
import { showAlert } from "../../utilities/alert.js";
import { loadBidHistory } from "../../api/listing/bidHistory.js";


export async function displaySingleListing() {
  const listingContainer = document.getElementById("listing-details");

  if (!listingContainer) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");

  if (!listingId) {
    listingContainer.innerHTML =
      "<p class='text-red-500 text-center'>Listing not found.</p>";
    return;
  }

  try {
    const listingResponse = await getListingById(listingId);

    if (!listingResponse || !listingResponse.data) {
      listingContainer.innerHTML =
        "<p class='text-red-500 text-center'>Listing not found.</p>";
      return;
    }

    const listing = listingResponse.data;
    const highestBid =
      listing.bids && listing.bids.length
        ? Math.max(...listing.bids.map((bid) => bid.amount))
        : 0;

    listingContainer.innerHTML = `
      <h1 class="text-2xl text-center bg-accent w-full shadow-secondary p-4 mb-20 text-gray-800">
        ${listing.title}
      </h1>
      <img src="${getValidImage(listing.media)}" 
        alt="${listing.media?.[0]?.alt || listing.title}"
        class="w-full max-w-lg object-cover rounded-md mt-4 mx-auto m-10 custom-border shadow-secondary"
        onerror="this.src='/images/placeholder.jpg';"
      />
          
      <div class="flex flex-col items-center mt-2 border p-3 rounded-lg shadow-accent bg-secondary">
        <img src="${
          listing.seller?.avatar?.url || "/images/default-avatar.png"
        }" 
          alt="Seller Avatar"
          class="w-16 h-16 rounded-full mr-4 border-2 border-gray-300"
        />
        <div>
          <p class="text-gray-700 font-semibold text-lg text-center p-5">
            ${listing.seller?.name || "Unknown Seller"}
          </p>
          <p class="text-black text-sm text-center">
            ${listing.seller?.bio || "No bio available."}
          </p>
        </div>
        <h2 class="text-xl mt-6 text-center">Description</h2>
        <p class="text-black mt-2 text-center bg-secondary p-5 m-10">
          ${listing.description || "No description available."}
        </p>
      </div>
      <div class="mt-4">
        <p class="text-gray-700 text-center dark:text-white m-5"><strong>Current Bids:</strong> 
          ${formatCurrency(highestBid)}
        </p>
        <p class="text-gray-700 text-center dark:text-white m-5"><strong>Starting Price:</strong> 
          ${formatCurrency(listing.startingPrice || 1)}
        </p>
        <p class="text-gray-500 text-center m-5 dark:text-white"><strong>Ends in:</strong> 
          ${formatTimeLeft(listing.endsAt)}
        </p>
      </div>
<div id="bid-history" class="mt-6 p-4 border rounded-lg shadow-lg bg-primary">
  <h2 class="text-xl text-center m-5">Bid History</h2>
  <p class="text-gray-500 text-center">Loading bid history...</p>
</div>

      <div class="mt-6">
        <h2 class="text-xl text-center m-5 dark:text-white">Bid Now</h2>
        <form id="bidForm" class="mt-3 text-center">
          <input type="number" id="bidAmount" min="1" required 
            class="p-2 border rounded-lg w-1/2 shadow-accent focus:ring-2 focus:ring-secondary focus:outline-none" 
            placeholder="Enter bid amount" />
          <button type="submit" class="text-white px-4 py-2 rounded-lg bg-btn-gradient hover:opacity-90 transition shadow-dark dark:shadow-orange-300 border border-white">
            Place Bid
          </button>
        </form>
        <p id="bidMessage" class="mt-3 text-center text-secondary hidden"></p>
      </div>
    `;
loadBidHistory(listingId);

    document
      .getElementById("bidForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const bidAmount = parseFloat(
          document.getElementById("bidAmount").value,
        );
        if (!bidAmount || bidAmount <= 0) {
          showAlert("Please enter a valid bid amount.", "error");
          return;
        }

        const bidResponse = await placeBid(listingId, bidAmount);
        if (bidResponse) {
          const bidMessage = document.getElementById("bidMessage");
          bidMessage.classList.remove("hidden");
          bidMessage.textContent = `Bid placed successfully! Your bid: ${formatCurrency(bidAmount)}`;
          setTimeout(() => {
            location.reload();
          }, 2000);
        }
      });
  } catch (error) {
    listingContainer.innerHTML =
      "<p class='text-red-500 text-center'>Error loading listing details.</p>";
  }
}


/**
 * Returns a valid image URL or a placeholder if no media exists.
 * @param {Array} media - Listing media array
 * @returns {string} - Image URL
 */
function getValidImage(media) {
  return media?.[0]?.url || "/images/placeholder.jpg";
}

/**
 * Formats the remaining time for the auction.
 * @param {string} endDate - The auction end date
 * @returns {string} - Formatted time left
 */
function formatTimeLeft(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const timeLeft = end - now;
  if (timeLeft <= 0) return "Auction ended";
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
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
 * Runs displaySingleListing only if #listing-details exists.
 */
document.addEventListener("DOMContentLoaded", function () {
  const listingContainer = document.getElementById("listing-details");

  if (listingContainer) {
    displaySingleListing();
    }
});

