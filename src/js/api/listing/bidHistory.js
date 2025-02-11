import { fetchBids } from "./bid.js"; // Import fetchBids function

/**
 * Loads and displays bid history with a toggle feature in grid format.
 * @param {string} listingId - The ID of the listing.
 */
export async function loadBidHistory(listingId) {
  const bids = await fetchBids(listingId);

  const bidHistoryContainer = document.getElementById("bid-history");
  if (bidHistoryContainer) {
    bidHistoryContainer.innerHTML = `
      <button id="toggleBidHistory" class="bg-accent text-white px-4 py-2 rounded-lg w-full text-center">
        Show Bid History ▼
      </button>
      <div id="bidHistoryContent" class="hidden mt-4 p-4 border rounded-lg shadow-md bg-accent">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px] mx-auto">
          ${
            bids.length
              ? bids
                  .map((bid) => {
                    const bidderName = bid.bidder?.name || "Anonymous";
                    const bidderAvatar =
                      bid.bidder?.avatar?.url || "/images/default-avatar.png";
                    const bidAmount = formatCurrency(bid.amount);
                    const bidDate = new Date(
                      bid.created || bid.timestamp || bid.createdAt,
                    ).toLocaleString();

                    return `
                      <div class="p-3 border rounded-lg shadow-md bg-muted flex items-center justify-between">
                        <!-- Left Section: Avatar + Name -->
                        <div class="flex items-center gap-3">
                          <img src="${bidderAvatar}" alt="${bidderName}"
                            class="w-10 h-10 rounded-full border border-olive shadow-md" />
                          <strong class="text-sm">${bidderName}</strong>
                        </div>

                        <!-- Right Section: Amount & Date -->
                        <div class="text-right">
                          <p class="text-gray-600 font-bold">${bidAmount}</p>
                          <span class="text-gray-800 text-xs">${bidDate}</span>
                        </div>
                      </div>`;
                  })
                  .join("")
              : '<p class="text-gray-500 text-center col-span-2">No bids yet.</p>'
          }
        </div>
      </div>`;

    // Add event listener for toggle button
    document
      .getElementById("toggleBidHistory")
      .addEventListener("click", () => {
        const bidContent = document.getElementById("bidHistoryContent");
        const toggleButton = document.getElementById("toggleBidHistory");

        bidContent.classList.toggle("hidden");
        toggleButton.innerHTML = bidContent.classList.contains("hidden")
          ? "Show Bid History ▼"
          : "Hide Bid History ▲";
      });
  }
}

/**
 * Formats a number into USD currency format.
 * @param {number} amount - The amount to format.
 * @returns {string} - Formatted currency string.
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
