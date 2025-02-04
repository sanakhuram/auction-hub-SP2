import { getListingById } from '../../api/listing/read.js';
import { placeBid } from '../../api/listing/bid.js';

/**
 * Fetches and displays a single listing dynamically.
 */
export async function displaySingleListing() {
  const listingContainer = document.getElementById('listing-details');

  if (!listingContainer) {
    console.error('❌ #listing-details container NOT FOUND in DOM!');
    return;
  }

  // Get listing ID from URL parameters
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get('id');

  if (!listingId) {
    listingContainer.innerHTML =
      "<p class='text-red-500 text-center'>Listing not found.</p>";
    return;
  }

  try {
    console.log(`🔍 Fetching listing with ID: ${listingId}`);
    const listingResponse = await getListingById(listingId);

    if (!listingResponse || !listingResponse.data) {
      console.error('❌ No listing data found.');
      listingContainer.innerHTML =
        "<p class='text-red-500 text-center'>Listing not found.</p>";
      return;
    }

    const listing = listingResponse.data;

    console.log('✅ Listing details fetched:', listing);

    // Generate HTML
    listingContainer.innerHTML = `
      <h1 class="text-2xl text-center bg-accent w-full p-4 mb-20 text-gray-800">${
        listing.title
      }</h1>
      <img src="${getValidImage(listing.media)}" 
        alt="${listing.media?.[0]?.alt || listing.title}"
        class="w-full max-w-lg object-cover rounded-md mt-4 mx-auto m-10 custom-border"
        onerror="this.src='/images/placeholder.jpg';"
      />
          
      <div class="flex flex-col items-center mt-2 border p-3 rounded-lg shadow-lg  bg-secondary">
        <img src="${
          listing.seller?.avatar?.url || '/images/default-avatar.png'
        }" 
          alt="Seller Avatar"
          class="w-16 h-16 rounded-full mr-4 border-2 border-gray-300"
        />
        <div>
          <p class="text-gray-700 font-semibold text-lg text-center p-5 ">${
            listing.seller?.name || 'Unknown Seller'
          }</p>
          <p class="text-black text-sm text-center">${
            listing.seller?.bio || 'No bio available.'
          }</p>
        </div>
        <h2 class="text-xl  mt-6 text-center">Description</h2>
      <p class="text-black mt-2 text-center bg-secondary p-5 m-10">${
        listing.description || 'No description available.'
      }</p>
      </div>
      <div class="mt-4">
        <p class="text-gray-700 text-center m-5"><strong>Current Bids:</strong> ${
          listing._count?.bids || 0
        }</p>
        <p class="text-gray-500 text-center m-5"><strong>Ends in:</strong> ${formatTimeLeft(
          listing.endsAt
        )}</p>
      </div>



      <div class="mt-6">
        <h2 class="text-xl text-center m-5">Bid Now</h2>
        <form id="bidForm" class="mt-3 text-center">
          <input type="number" id="bidAmount" min="1" required 
            class="p-2 border rounded-lg w-1/2" placeholder="Enter bid amount" />
          <button type="submit" class="text-white px-4 py-2 rounded-lg bg-btn-gradient hover:opacity-90 transition">
            Place Bid
          </button>
        </form>
        <p id="bidMessage" class="mt-3 text-green-600 hidden">Bid placed successfully!</p>
      </div>
    `;

    // Add event listener for placing a bid
    document
      .getElementById('bidForm')
      .addEventListener('submit', async (event) => {
        event.preventDefault();

        const bidAmount = parseFloat(
          document.getElementById('bidAmount').value
        );
        if (!bidAmount || bidAmount <= 0) {
          alert('Please enter a valid bid amount.');
          return;
        }

        const bidResponse = await placeBid(listingId, bidAmount);
        if (bidResponse) {
          document.getElementById('bidMessage').classList.remove('hidden');
          document.getElementById('bidMessage').textContent =
            'Bid placed successfully!';
          setTimeout(() => {
            location.reload(); // Refresh page to show updated bid count
          }, 2000);
        }
      });
  } catch (error) {
    console.error('❌ Error fetching listing:', error);
    listingContainer.innerHTML =
      "<p class='text-red-500 text-center'>Error loading listing details.</p>";
  }
}

/**
 * Ensures the listing has a valid image or provides a placeholder.
 */
function getValidImage(media) {
  return media?.[0]?.url || '/images/placeholder.jpg';
}

/**
 * Formats the remaining time until the listing ends.
 */
function formatTimeLeft(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const timeLeft = end - now;
  if (timeLeft <= 0) return 'Auction ended';
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}
