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
              return `
                  <div class="p-4 border rounded-lg shadow-md bg-muted text-white mb-5 w-72 flex-shrink-0 shadow-dark">
                    <a href="/listing/?id=${bid.listing?.id || bid.id}" class="block">
                      <img src="${bid.listing?.media?.[0]?.url || "/images/placeholder.jpg"}"
                        alt="${bid.listing?.title || "Unknown Item"}"
                        class="w-full h-40 object-cover rounded-md cursor-pointer transition-transform hover:scale-105" />
                    </a>
                    <h3 class="text-lg mt-2">${bid.listing?.title || "Unknown Item"}</h3>
                    <p class="text-gray-800">Bid Amount: <strong>${bidUSD}</strong></p>
                    <p class="text-gray-800">Placed On: ${new Date(bid.created).toLocaleDateString()}</p>
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
  }
}

function initializeBidSlider() {
  const sliderTrack = document.querySelector("#bidsSliderTrack");
  const prevBtn = document.querySelector("#prevBid");
  const nextBtn = document.querySelector("#nextBid");

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
