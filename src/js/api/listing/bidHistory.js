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
      <button id="toggleBidHistory" class="bg-btn-gradient text-white px-4 py-2 rounded-lg w-full text-center font-semibold shadow-lg transition hover:brightness-110">
        Show Bid History ▼
      </button>
      <div id="bidHistoryContent" class="hidden mt-4 p-4 border rounded-lg shadow-md bg-muted">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[900px] mx-auto">
          ${
            bids.length
              ? bids
                  .map((bid) => {
                    const bidderName = bid.bidder?.name || "Anonymous Bidder";
                    const bidderAvatar =
                      bid.bidder?.avatar?.url || "/images/default-avatar.png";
                    const bidAmount = formatCurrency(bid.amount);
                    const bidDate = formatDate(
                      bid.created || bid.timestamp || bid.createdAt,
                    );

                    return `
                      <div class="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-900 flex items-center justify-between gap-4 hover:shadow-xl transition">
                        <!-- Left Section: Avatar + Name -->
                        <div class="flex items-center gap-3">
                          <a href="/profile/seller?seller=${bidderName}" class="hover:brightness-110">
                            <img src="${bidderAvatar}" alt="${bidderName}"
                              class="w-12 h-12 rounded-full border-2 border-primary shadow-md transition hover:scale-105" />
                          </a>
                          <strong class="text-sm text-gray-900 dark:text-light">
                            <a href="/profile/seller?seller=${bidderName}" class="hover:text-secondary">
                              ${bidderName}
                            </a>
                          </strong>
                        </div>

                        <!-- Right Section: Amount & Date -->
                        <div class="text-right">
                          <p class="text-green-600 dark:text-green-400 text-lg font-bold">${bidAmount}</p>
                          <span class="text-gray-600 dark:text-gray-300 text-xs">${bidDate}</span>
                        </div>
                      </div>`;
                  })
                  .join("")
              : '<p class="text-gray-800 text-center col-span-2">No bids yet.</p>'
          }
        </div>
      </div>`;

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

/**
 * Formats timestamp to a readable date.
 * @param {string} dateString - Timestamp from API
 * @returns {string} - Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
