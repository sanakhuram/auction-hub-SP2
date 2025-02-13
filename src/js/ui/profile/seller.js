import { getSellerProfile } from "../../api/profile/fetchProfile.js";
import { fetchBids, formatCurrency } from "../../api/listing/bid.js";

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

  // Set profile details
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

  // Containers
  const listingsContainer = document.getElementById("sellerListings");
  const bidContainer = document.getElementById("sellerBids");
  const winsContainer = document.getElementById("sellerWinsContainer");

  let listings = sellerData.listings || [];
  let allBids = [];
  let visibleListings = 4;
  let visibleBids = 4;

  // Fetch all bids
  for (const listing of listings) {
    const bids = await fetchBids(listing.id);
    bids.forEach((bid) => {
      allBids.push({
        amount: bid.amount,
        bidder: bid.bidder?.name || "Anonymous",
        bidderAvatar: bid.bidder?.avatar?.url || "/images/default-avatar.png",
        listingTitle: listing.title,
        listingImage: listing.media?.[0]?.url || "/images/placeholder.jpg",
      });
    });
  }

  // Function to render Listings
  function renderListings() {
    listingsContainer.innerHTML = "";
    const visibleItems = listings.slice(0, visibleListings);

    visibleItems.forEach((listing) => {
      const listingElement = document.createElement("a");
      listingElement.href = `/listing/?id=${listing.id}`;
      listingElement.className =
        "block border p-4 rounded-lg shadow-dark bg-sepia hover:shadow-xl transition transform hover:scale-105";

      listingElement.innerHTML = `
        <img src="${listing.media?.[0]?.url || "/images/placeholder.jpg"}" alt="Listing Image" class="w-full h-40 object-cover rounded-lg shadow-soft">
        <h4 class="text-lg font-heading mt-2 text-dark">${listing.title}</h4>
        <p class="text-gray-700">Total Bids: ${listing.bids?.length || 0}</p>
        <p class="text-red-800 font-bold">Highest Bid: ${formatCurrency(listing.highestBid || 0)}</p>
      `;

      listingsContainer.appendChild(listingElement);
    });

    if (visibleListings < listings.length) {
      listingsContainer.appendChild(loadMoreListingsButton);
      loadMoreListingsButton.style.display = "block";
    } else {
      loadMoreListingsButton.style.display = "none";
    }
  }

  // Function to render Bids
  function renderBids() {
    bidContainer.innerHTML = "";
    const visibleItems = allBids.slice(0, visibleBids);

    visibleItems.forEach((bid) => {
      const bidElement = document.createElement("div");
      bidElement.className =
        "border p-4 rounded-lg shadow-dark bg-muted hover:shadow-dark transition transform hover:scale-105 text-center";

      bidElement.innerHTML = `
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

  // Render Wins (Unchanged)
  if (sellerData.wins && sellerData.wins.length) {
    winsContainer.innerHTML = "";
    sellerData.wins.forEach((win) => {
      const winElement = document.createElement("div");
      winElement.className =
        "border p-4 rounded-lg shadow-dark bg-olive hover:shadow-xl transition transform hover:scale-105 text-center";

      winElement.innerHTML = `
        <img src="${win.media?.[0]?.url || "/images/placeholder.jpg"}" alt="Win Image" class="w-full h-40 object-cover rounded-lg shadow-soft">
        <h4 class="text-lg font-heading text-dark">${win.title}</h4>
        <p class="text-red-800 font-bold">Final Price: ${formatCurrency(win.finalBid || 0)}</p>
      `;

      winsContainer.appendChild(winElement);
    });
  } else {
    winsContainer.innerHTML = `<p class="text-gray-500 text-center">No wins yet.</p>`;
  }

  // Load More Buttons
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
    "block mx-auto mt-4 text-2xl text-dark bg-transparent hover:text-white  transition cursor-pointer";
  loadMoreBidsButton.style.display = "none";

  loadMoreBidsButton.addEventListener("click", () => {
    visibleBids += 4;
    renderBids();
  });

  renderListings();
  renderBids();
}

document.addEventListener("DOMContentLoaded", loadSellerProfile);
