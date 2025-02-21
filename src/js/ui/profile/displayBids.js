import { fetchUserBids } from "../../api/profile/getBids.js";

export async function displayUserBids() {
  const bidsContainer = document.querySelector("#myBidsSlider");
  if (!bidsContainer) return;

  bidsContainer.innerHTML = `<p class="text-purple-600 font-semibold text-lg">Loading bids...</p>`;

  try {
    const username = localStorage.getItem("username");
    if (!username) {
      bidsContainer.innerHTML = `<p class="text-red-500 text-center">You need to log in to view your bids.</p>`;
      return;
    }

    const userBids = await fetchUserBids(username);

    if (!Array.isArray(userBids) || userBids.length === 0) {
      bidsContainer.innerHTML = `<p class="text-gray-500 text-center">You have not placed any bids.</p>`;
      return;
    }

    bidsContainer.innerHTML = `
      <div class="relative w-full overflow-hidden">
        <div id="bidsSliderTrack" class="flex space-x-4 transition-transform">
          ${userBids
            .map((bid) => {
              const bidUSD = formatCurrency(bid.amount);
              const listing = bid.listing;

              if (!listing) return ""; // Skip if listing data is missing

              const { auctionEnded, highestBid, highestBidder, userWon } = bid;

              const username = localStorage.getItem("username")?.toLowerCase();
              let isWinning =
                highestBidder && highestBidder.toLowerCase() === username;

              // ✅ Debugging logs
              console.log(`
                📌 Listing: ${listing.title}
                💰 Your Bid: ${bid.amount}
                🏆 Highest Bid: ${highestBid}
                👤 Highest Bidder: ${highestBidder}
                👤 Your Username: ${username}
                ✅ Winning? ${isWinning}
              `);

              let statusLabel = "";
              if (auctionEnded) {
                statusLabel = userWon
                  ? `<span class="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded opacity-80 text-xs">🏆 Won</span>`
                  : `<span class="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded opacity-80 text-xs">❌ Lost</span>`;
              } else {
                statusLabel = isWinning
                  ? `<span class="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded opacity-80 text-xs">✔ Winning</span>`
                  : `<span class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded opacity-80 text-xs">🚨 Losing</span>`;
              }

              return `
                <div class="relative p-4 border rounded-lg shadow-md bg-muted text-white mb-5 w-72 flex-shrink-0 shadow-dark">
                  ${statusLabel}
                  <a href="/listing/?id=${listing.id}" class="block">
                    <img src="${listing.media?.[0]?.url || "/images/placeholder.jpg"}"
                      alt="${listing.title || "Unknown Item"}"
                      class="w-full h-40 object-cover rounded-md cursor-pointer transition-transform hover:scale-105" />
                  </a>
                  <h3 class="text-lg mt-2">${listing.title || "Unknown Item"}</h3>
                  <p class="text-gray-800">Your Bid: <strong>${bidUSD}</strong></p>
                  <p class="text-gray-800">
                    Highest Bid: ${highestBid && !isNaN(highestBid) && highestBid > 0 ? formatCurrency(highestBid) : "No bids yet"}
                  </p>
                </div>
              `;
            })
            .join("")}
        </div>
        <button id="prevBid" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 rounded-full">
          &lt;
        </button>
        <button id="nextBid" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 rounded-full">
          &gt;
        </button>
      </div>
    `;

    initializeBidSlider();
  } catch (error) {
    bidsContainer.innerHTML = `<p class="text-red-500 text-center">Error loading your bids.</p>`;
    console.error("❌ Error fetching user bids:", error);
  }
}

/**
 * Initializes the bid slider functionality.
 */
function initializeBidSlider() {
  const sliderTrack = document.querySelector("#bidsSliderTrack");
  const prevBtn = document.querySelector("#prevBid");
  const nextBtn = document.querySelector("#nextBid");

  if (!sliderTrack || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const slideWidth = 288;

  prevBtn.addEventListener("click", () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  });

  nextBtn.addEventListener("click", () => {
    const maxIndex = sliderTrack.children.length - 1;
    currentIndex = Math.min(currentIndex + 1, maxIndex);
    sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  });
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
