import { getSellerProfile } from "../../api/profile/fetchProfile.js";
import { fetchBids, formatCurrency } from "../../api/listing/bid.js";

/**
 * Loads and displays the seller's profile information, including their listings, bids, and wins.
 * - Fetches seller data from the API.
 * - Dynamically updates the UI with seller information.
 * - Renders listings, bids, and wins with appropriate labels (Winning, Losing, Expired).
 *
 * @returns {Promise<void>} - Resolves once the seller profile is loaded and rendered.
 */

export async function loadSellerProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const sellerUsername = urlParams.get("seller");

  if (!sellerUsername) return;

  const profile = await getSellerProfile(sellerUsername);
  if (!profile || !profile.data) {
    document.getElementById("sellerListings").innerHTML =
      "<p class='text-red-500 text-center'>Seller profile not found.</p>";
    return;
  }

  const sellerData = profile.data;

  document.getElementById("sellerName").textContent =
    sellerData.name || "Unknown Seller";
  document.getElementById("sellerEmail").textContent =
    sellerData.email || "No Email Provided";
  document.getElementById("sellerBio").textContent =
    sellerData.bio || "No bio available.";
  document.getElementById("sellerAvatar").src =
    sellerData.avatar?.url || "/images/default-avatar.png";
  document.getElementById("sellerBanner").src =
    sellerData.banner?.url || "/images/banner.png";
  document.getElementById("sellerCredits").textContent =
    `Credits: ${formatCurrency(sellerData.credits || 0)}`;
  document.getElementById("sellerTotalListings").textContent =
    `Listings: ${sellerData._count?.listings || 0}`;
  document.getElementById("sellerWins").textContent =
    `Wins: ${sellerData._count?.wins || 0}`;

  const listingsContainer = document.getElementById("sellerListings");
  const bidContainer = document.getElementById("sellerBids");
  const winsContainer = document.getElementById("sellerWinsContainer");

  let listings = sellerData.listings || [];
  let allBids = [];
  let visibleListings = 4;
  let visibleBids = 4;

  for (const listing of listings) {
    const bids = await fetchBids(listing.id);

    listing.highestBid = bids.length
      ? Math.max(...bids.map((bid) => bid.amount))
      : 0;

    listing.highestBidder = bids.length
      ? bids.find((bid) => bid.amount === listing.highestBid)?.bidder?.name
      : null;

    bids.forEach((bid) => {
      allBids.push({
        amount: bid.amount,
        bidder: bid.bidder?.name || "Anonymous",
        bidderAvatar: bid.bidder?.avatar?.url || "/images/default-avatar.png",
        listingTitle: listing.title,
        listingImage: listing.media?.[0]?.url || "/images/placeholder.jpg",
        highestBidder: listing.highestBidder, // Track highest bidder
      });
    });
  }

  /**
 * Renders the seller's auction listings.
 * 
 * @param {Array} listings - The array of seller's listings.
 * @param {HTMLElement} container - The HTML container for listings.
 * @param {number} visibleListings - The number of listings to display initially.
 */

  function renderListings() {
    listingsContainer.innerHTML = "";
    const visibleItems = listings.slice(0, visibleListings);

    visibleItems.forEach((listing) => {
      listingsContainer.innerHTML += createListingCard(listing);
    });

    if (visibleListings < listings.length) {
      listingsContainer.appendChild(loadMoreListingsButton);
      loadMoreListingsButton.style.display = "block";
    } else {
      loadMoreListingsButton.style.display = "none";
    }
  }

  /**
 * Renders the seller's bids.
 * 
 * @param {Array} bids - The array of bids placed by the seller.
 * @param {HTMLElement} container - The HTML container for bids.
 * @param {number} visibleBids - The number of bids to display initially.
 * @param {string} sellerName - The seller's name to check for winning bids.
 */

  function renderBids() {
    bidContainer.innerHTML = "";
    const visibleItems = allBids.slice(0, visibleBids);

    visibleItems.forEach((bid) => {
      const isWinning = bid.highestBidder === sellerData.name;
      const statusLabel = isWinning
        ? `<span class="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded opacity-80 text-xs">Winning</span>`
        : `<span class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded opacity-80 text-xs">Losing</span>`;

      const bidElement = document.createElement("div");
      bidElement.className =
        "relative border p-4 rounded-lg shadow-dark bg-muted hover:shadow-dark transition transform hover:scale-105 text-center";

      bidElement.innerHTML = `
        ${statusLabel}
        <img src="${bid.listingImage}" alt="Listing Image" class="w-full h-40 object-cover rounded-lg shadow-soft">
        <h4 class="text-lg font-heading text-dark">${bid.listingTitle}</h4>
        <div class="flex items-center justify-center gap-3 mt-2">
          <img src="${bid.bidderAvatar}" alt="Bidder Avatar" class="w-10 h-10 rounded-full border border-olive shadow-md">
          <span class="text-grey-800 font-bold">${bid.bidder}</span>
        </div>
        <p class="text-red-800 font-bold">Bid: ${formatCurrency(bid.amount)}</p>
      `;

      bidContainer.appendChild(bidElement);
    });

    if (visibleBids < allBids.length) {
      bidContainer.appendChild(loadMoreBidsButton);
      loadMoreBidsButton.style.display = "block";
    } else {
      loadMoreBidsButton.style.display = "none";
    }
  }

  if (sellerData.wins && sellerData.wins.length) {
    winsContainer.innerHTML = sellerData.wins.map(createListingCard).join("");
  } else {
    winsContainer.innerHTML = `<p class="text-gray-500 text-center">No wins yet.</p>`;
  }

  const loadMoreListingsButton = document.createElement("button");
  loadMoreListingsButton.innerHTML = `<i class="fas fa-chevron-down"></i>`;
  loadMoreListingsButton.className =
    "block mx-auto mt-4 text-2xl text-dark bg-transparent hover:text-white transition cursor-pointer";
  loadMoreListingsButton.style.display = "none";

  loadMoreListingsButton.addEventListener("click", () => {
    visibleListings += 4;
    renderListings();
  });

  const loadMoreBidsButton = document.createElement("button");
  loadMoreBidsButton.innerHTML = `<i class="fas fa-chevron-down"></i>`;
  loadMoreBidsButton.className =
    "block mx-auto mt-4 text-2xl text-dark bg-transparent hover:text-white transition cursor-pointer";
  loadMoreBidsButton.style.display = "none";

  loadMoreBidsButton.addEventListener("click", () => {
    visibleBids += 4;
    renderBids();
  });

  bidContainer.appendChild(loadMoreBidsButton);
  listingsContainer.appendChild(loadMoreListingsButton);

  renderListings();
  renderBids();
}

document.addEventListener("DOMContentLoaded", loadSellerProfile);

/**
 * Creates a bid card with labels for winning or losing.
 * 
 * @param {Object} bid - The bid object.
 * @param {boolean} isWinning - Whether the bid is currently winning.
 * @returns {string} - The generated HTML for the bid card.
 */ 

function createListingCard(listing) {
  const isWinning = listing.highestBidder === localStorage.getItem("username");
  const now = new Date();
  const endsAt = new Date(listing.endsAt);
  const isExpired = endsAt < now; 

  let statusLabel = "";

  if (isExpired) {
    statusLabel = `<span class="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded opacity-80 text-xs">Expired</span>`;
  } else if (isWinning) {
    statusLabel = `<span class="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded opacity-80 text-xs">Winning</span>`;
  } else if (listing.highestBidder) {
    statusLabel = `<span class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded opacity-80 text-xs">Losing</span>`;
  }

  return `
    <div class="relative p-4 border rounded-lg shadow-lg bg-olive max-w-[1400px] mx-auto w-full shadow-dark">
      ${statusLabel}
      <a href="/listing/?id=${listing.id}" class="block">
        <img src="${listing.media?.[0]?.url || "/images/placeholder.jpg"}"
          alt="${listing.title}"
          class="w-full h-40 object-cover rounded-md cursor-pointer transition-transform hover:scale-105" />
      </a>
      <h3 class="text-lg mt-2 mb-2">${listing.title}</h3>
      <p class="text-gray-700">Ends on: ${endsAt.toLocaleDateString()}</p>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {

  const sellerTabListings = document.getElementById("sellerTabListings");
  const sellerTabBids = document.getElementById("sellerTabBids");
  const sellerTabWins = document.getElementById("sellerTabWins");

  if (sellerTabListings && sellerTabBids && sellerTabWins) {
    sellerTabListings.addEventListener("click", () => {
      hideAllSellerSections();
      document.getElementById("sellerListingsSection").classList.remove("hidden");
    });

    sellerTabBids.addEventListener("click", () => {
      hideAllSellerSections();
      document.getElementById("sellerBidsSection").classList.remove("hidden");
    });

    sellerTabWins.addEventListener("click", () => {
      hideAllSellerSections();
      document.getElementById("sellerWinsSection").classList.remove("hidden");
    });
  }
});

function hideAllSellerSections() {
  document.querySelectorAll('.section-content').forEach(section => {
    section.classList.add('hidden');
  });
}
