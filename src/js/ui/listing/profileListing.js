import { deleteListing } from "../../api/listing/delete.js";
import { fetchProfile } from "../../api/profile/read.js";
import { showAlert, showConfirmAlert } from "../../utilities/alert.js";
import { getListingById } from "../../api/listing/read.js";

export async function displayUserListings() {
  const listingsContainer = document.querySelector("#myListings");
  if (!listingsContainer) return;

  listingsContainer.innerHTML =
    '<p class="text-purple-600 font-semibold text-lg">Loading listings...</p>';

  try {
    const username = localStorage.getItem("username");
    if (!username) {
      listingsContainer.innerHTML = `<p class="text-red-500 text-center">You need to log in to view your listings.</p>`;
      return;
    }

    const profileData = await fetchProfile(username);
    let userListings = profileData?.listings || [];

    if (userListings.length === 0) {
      listingsContainer.innerHTML = `<p class="text-gray-500 text-center">You have no active listings.</p>`;
      return;
    }

    const fullListings = await Promise.all(
      userListings.map(async (listing) => {
        const fullListing = await getListingById(listing.id);
        return fullListing?.data || listing;
      }),
    );

    window.allUserListings = fullListings;
    renderListings();
  } catch (error) {
    listingsContainer.innerHTML =
      '<p class="text-red-500 font-semibold text-lg">Error loading your listings.</p>';
    console.error("❌ Error fetching listings:", error);
  }
}

function renderListings() {
  const listingsContainer = document.querySelector("#myListings");
  listingsContainer.innerHTML = `
    <div class="max-w-[1200px] mx-auto">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        ${window.allUserListings.map((listing) => createListingCard(listing)).join("")}
      </div>
    </div>
  `;
  attachDeleteEventListeners();
}

/**
 * Creates a listing card HTML structure.
 * @param {Object} listing - Listing object from API.
 * @returns {string} - The generated listing card HTML.
 */
function createListingCard(listing) {
  const bidArray = listing.bids?.data || listing.bids || [];
  const highestBid =
    bidArray.length > 0
      ? Math.max(...bidArray.map((bid) => bid.amount))
      : listing.startingPrice || 0;
  const isExpired = new Date(listing.endsAt) <= new Date();

  return `
    <div class="p-4 border rounded-lg shadow-lg bg-sepia relative mx-auto w-full shadow-dark ${isExpired ? "opacity-50" : ""}">
      ${isExpired ? '<span class="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">❌ Expired</span>' : ""}
      <a href="/listing/?id=${listing.id}" class="block">
        <img src="${getValidImage(listing.media)}"
          alt="${listing.media?.[0]?.alt || listing.title}"
          class="w-full h-40 object-cover rounded-md cursor-pointer transition-transform hover:scale-105"
          onerror="this.src='/images/placeholder.jpg';" />
      </a>
      <h3 class="text-lg mt-2 mb-2">${listing.title}</h3>
      <p class="text-gray-700">Current Bid: <strong>${formatCurrency(highestBid)}</strong></p>
      <p class="text-gray-700">Ends on: ${new Date(listing.endsAt).toLocaleDateString()}</p>
      ${
        isExpired
          ? ""
          : `
      <a href="/listing/edit/?id=${listing.id}" 
        class="inline-block bg-btn-gradient text-white px-4 py-2 mt-3 rounded-lg border border-gray-300 
              transition-all duration-300 ease-in-out transform hover:scale-105 hover:brightness-110 hover:shadow-lg">
        ✏️ Edit
      </a>
      <button data-id="${listing.id}" 
        class="delete-listing bg-red-500 text-white px-4 py-2 mt-3 rounded-lg transition-all duration-300 ease-in-out 
              transform hover:scale-105 hover:bg-red-700 hover:shadow-lg active:scale-95 active:brightness-90 
              focus:ring-4 focus:ring-red-300 focus:outline-none">
        🗑️ Delete
      </button>`
      }
    </div>
  `;
}
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Handles deleting a listing after confirmation.
 * @param {string} listingId - The ID of the listing to delete.
 */
async function deleteListingHandler(listingId) {
  const confirmDelete = await showConfirmAlert(
    "Are you sure you want to delete this listing?",
  );
  if (!confirmDelete) return;

  try {
    const success = await deleteListing(listingId);
    if (success) {
      showAlert("✅ Listing deleted successfully!", "success");
      displayUserListings();
    } else {
      showAlert("❌ Failed to delete listing. Please try again.", "error");
    }
  } catch (error) {
    showAlert("Error deleting listing. Check console logs.", "error");
    console.error("❌ Error deleting listing:", error);
  }
}

function attachDeleteEventListeners() {
  document.querySelectorAll(".delete-listing").forEach((button) => {
    button.addEventListener("click", function () {
      const listingId = this.getAttribute("data-id");
      deleteListingHandler(listingId);
    });
  });
}

/**
 * Returns a valid image URL for the listing.
 * @param {Array} media - The media array from API.
 * @returns {string} - The valid image URL or placeholder.
 */
function getValidImage(media) {
  if (Array.isArray(media) && media.length > 0 && media[0]?.url) {
    return media[0].url;
  }
  return "/images/placeholder.jpg";
}
