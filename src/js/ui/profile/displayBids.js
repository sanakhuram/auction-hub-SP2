import { fetchUserBids } from "../../api/profile/getBids.js";

/**
 * Fetches and displays user bids in the UI without slider functionality.
 *
 * @async
 * @function displayUserBids
 * @returns {Promise<void>}
 */
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

    // Display bids in a grid layout wrapped in a container of max width 1200px
    bidsContainer.innerHTML = `
      <div class="max-w-[1200px] mx-auto">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          ${userBids
            .map((bid) => {
              const bidUSD = formatCurrency(bid.amount);
              const listing = bid.listing;

              if (!listing) return "";

              const { auctionEnded, highestBid, highestBidder, userWon } = bid;
              const usernameLower = localStorage.getItem("username")?.toLowerCase();
              const isWinning = highestBidder && highestBidder.toLowerCase() === usernameLower;

              let statusLabel = auctionEnded
                ? userWon
                  ? `<span class="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded opacity-80 text-xs">🏆 Won</span>`
                  : `<span class="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded opacity-80 text-xs">❌ Lost</span>`
                : isWinning
                  ? `<span class="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded opacity-80 text-xs">✔ Winning</span>`
                  : `<span class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded opacity-80 text-xs">🚨 Losing</span>`;

              return `
                <div class="relative p-4 border rounded-lg shadow-md bg-muted text-white mb-5">
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
      </div>
    `;
  } catch (error) {
    bidsContainer.innerHTML = `<p class="text-red-500 text-center">Error loading your bids.</p>`;
    console.error("Error fetching user bids:", error);
  }
}

/**
 * Formats a given number into a USD currency string.
 *
 * @param {number} amount - The numerical value to be formatted as currency.
 * @returns {string} - The formatted currency string (e.g., "$1,234.56").
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
