import { getListingById } from "../../api/listing/read.js";
import { placeBid } from "../../api/listing/bid.js";
import { showAlert } from "../../utilities/alert.js";
import { loadBidHistory } from "../../api/listing/bidHistory.js";

export async function displaySingleListing() {
  const listingContainer = document.getElementById("listing-details");

  if (!listingContainer) return;

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

    const images = getValidImages(listing.media);
    let currentImageIndex = 0;

    function updateImage() {
      document.getElementById("listing-image").src = images[currentImageIndex];
    }

    listingContainer.innerHTML = `
      <h1 class="text-2xl text-center bg-accent w-full shadow-secondary p-4 mb-6 text-gray-800">
        ${listing.title}
      </h1>

      <!-- Image Carousel -->
      <div class="relative flex justify-center items-center">
        ${
          images.length > 1
            ? `<button id="prev-image" class="absolute left-0 bg-muted text-white px-3 py-2 rounded-l m-3">◀</button>`
            : ""
        }
        <img id="listing-image" class="w-full max-w-lg object-cover rounded-md shadow-secondary custom-border m-5" src="${images[0]}" />
        ${
          images.length > 1
            ? `<button id="next-image" class="absolute right-0 bg-muted text-white px-3 py-2 rounded-r m-3">▶</button>`
            : ""
        }
      </div>

      <div class="flex flex-col items-center mt-8 border p-3 rounded-lg shadow-accent bg-secondary">
        <a href="/profile/seller?seller=${listing.seller?.name}">
          <img src="${
            listing.seller?.avatar?.url || "/images/default-avatar.png"
          }" 
            alt="Seller Avatar"
            class="w-16 h-16 rounded-full border-2 border-gray-300 hover:shadow-lg transition"
          />
        </a>
        <div>
          <p class="text-gray-700 font-semibold text-lg text-center p-5">
            <a href="/profile/seller?seller=${listing.seller?.name}" 
               class="text-black hover:underline">
               ${listing.seller?.name || "Unknown Seller"}
            </a>
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

    if (images.length > 1) {
      document.getElementById("prev-image").addEventListener("click", () => {
        currentImageIndex =
          (currentImageIndex - 1 + images.length) % images.length;
        updateImage();
      });

      document.getElementById("next-image").addEventListener("click", () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImage();
      });
    }

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
 * Extracts up to 3 valid images from media array.
 * @param {Array} media - Listing media array.
 * @returns {Array} - Array of image URLs.
 */
function getValidImages(media) {
  if (!Array.isArray(media) || media.length === 0) {
    return ["/images/placeholder.jpg"];
  }
  return media.map((image) => image.url).slice(0, 3);
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
