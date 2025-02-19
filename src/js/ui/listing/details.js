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
    const highestBid = listing.bids?.length
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : 0;
    const images = getValidImages(listing.media);
    let currentImageIndex = 0;

    function updateImage(index) {
      document.getElementById("listing-image").src = images[index];
    }

    const tagsHtml =
      listing.tags && listing.tags.length
        ? listing.tags
            .map(
              (tag) =>
                `<span class="px-3 py-1 bg-primary text-white rounded-lg text-sm m-1 shadow-md">#${tag}</span>`,
            )
            .join("")
        : "<span class='text-gray-500'>No tags available</span>";

    listingContainer.innerHTML = `
      <h1 class="text-2xl text-center bg-accent w-full shadow-secondary p-4 mb-6 text-gray-800">
        ${listing.title}
      </h1>
      <div class="flex flex-col lg:flex-row gap-8 p-6 ">
        <!-- Left Side: Image and Thumbnails -->
        <div class="w-full lg:w-1/2 flex flex-col items-center">
          <img id="listing-image" class="w-full max-w-lg object-cover rounded-md shadow-md custom-border" src="${images[0]}" />
          <div class="flex justify-center gap-3 mt-4">
            ${images
              .map(
                (img, index) =>
                  `<img src="${img}" class="w-16 h-16 object-cover rounded-md cursor-pointer border shadow-md hover:opacity-80" data-index="${index}" />`,
              )
              .join(" ")}
          </div>
        </div>

 <!-- Right Side: Seller Info -->
<div class="w-full lg:w-1/2 bg-secondary p-6 rounded-lg shadow-lg">
<div class="flex flex-col items-center text-center gap-4 p-4">
  <img src="${listing.seller?.avatar?.url || "/images/default-avatar.png"}" class="w-14 h-14 rounded-full" />
  <div>
    <p class="font-semibold">${listing.seller?.name || "Unknown Seller"}</p>
    <p class="text-sm text-dark">${listing.seller?.bio || "No bio available."}</p>
  </div>
</div>

  <div class="mt-6 p-6 ">
    <h2 class="text-lg text-center">Description</h2>
    <div class="flex flex-wrap justify-center text-center m-5">${tagsHtml}</div>
    <p class="text-dark text-center mb-4">${listing.description || "No description available."}</p>
  </div>

  <!-- Bid Info -->
  <div class="mt-6 text-lg text-center text-white bg-btn-gradient rounded-md p-10 ">
  <h3 class="text-xl text-center mb-5 text-white">Bid Info</h3>
    <p class="text-green-700">Current Bid: ${formatCurrency(highestBid)}</p>
    <p>Starting Price: ${formatCurrency(listing.startingPrice || 1)}</p>
    <p class=" px-3 py-1 rounded-lg text-white font-bold shadow-sm ">Ends in: ${formatTimeLeft(listing.endsAt)}</p>
  </div>

  <!-- Bid Now Section -->
  <h2 class="text-xl text-center m-5 dark:text-white">Bid Now</h2>
  <form id="bidForm" class="mt-3 text-center">
    <input type="number" id="bidAmount" min="1" required class="p-2 border rounded-lg w-1/2 shadow-accent focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="Enter bid amount" />
    <button type="submit" class="text-white px-4 py-2 rounded-lg bg-btn-gradient hover:bg-btn-alt-gradient hover:text-black shadow-dark dark:shadow-orange-300 border border-white">Place Bid</button>
  </form>
  <p id="bidMessage" class="mt-3 text-center text-secondary hidden"></p>
</div>
</div>
<!-- Bid History Section (Remains Unchanged) -->
<div class="mt-6">
  <div id="bid-history" class="mt-6 bg-primary p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Bid History</h2>
    <p class="text-gray-500">Loading bid history...</p>
  </div>


    `;

    loadBidHistory(listingId);

    document.querySelectorAll(".flex img").forEach((thumbnail) => {
      thumbnail.addEventListener("click", (e) => {
        updateImage(e.target.dataset.index);
      });
    });

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
          showAlert(
            `Bid placed successfully! Your bid: ${formatCurrency(bidAmount)}`,
            "success",
          );
          setTimeout(() => location.reload(), 2000);
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
