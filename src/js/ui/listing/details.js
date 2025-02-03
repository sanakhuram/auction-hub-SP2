import { getListingById } from '../../api/listing/read.js';

/**
 * Displays a single listing on the listing details page.
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
    const listing = await getListingById(listingId);

    if (!listing) {
      console.error('❌ No listing data found.');
      listingContainer.innerHTML =
        "<p class='text-red-500 text-center'>Listing not found.</p>";
      return;
    }

    console.log('✅ Listing details fetched:', listing);

    // Clear container and create elements dynamically
    listingContainer.innerHTML = '';
    const listingDiv = document.createElement('div');
    listingDiv.className =
      'p-6 border rounded-lg shadow-lg bg-white max-w-xl mx-auto';

    listingDiv.innerHTML = `
      <h1 class="text-3xl font-bold text-gray-800">${listing.title}</h1>
      <img src="${getValidImage(listing.media)}" 
        alt="${listing.media?.[0]?.alt || listing.title}"
        class="w-full max-w-lg object-cover rounded-md mt-4"
        onerror="this.src='/images/placeholder.jpg';"
      />
      <p class="text-gray-600 mt-2">${
        listing.description || 'No description available.'
      }</p>
      <p class="text-gray-700 mt-2"><strong>Price:</strong> ${
        listing.price || 'N/A'
      } Credits</p>
      <p class="text-gray-500"><strong>Seller:</strong> ${
        listing.seller?.name || 'Unknown'
      }</p>
      <p class="text-gray-500"><strong>Ends in:</strong> ${formatTimeLeft(
        listing.endsAt
      )}</p>
    `;

    // Create the bid button dynamically
    const bidButton = document.createElement('button');
    bidButton.id = 'placeBidBtn';
    bidButton.className =
      'bg-blue-500 text-white px-4 py-2 mt-3 rounded-lg hover:bg-blue-700 transition';
    bidButton.textContent = 'Place Bid';

    bidButton.addEventListener('click', () => {
      alert('Bidding functionality coming soon!');
    });

    listingDiv.appendChild(bidButton);
    listingContainer.appendChild(listingDiv);
  } catch (error) {
    console.error('❌ Error fetching listing:', error);
    listingContainer.innerHTML =
      "<p class='text-red-500 text-center'>Error loading listing details.</p>";
  }
}

/**
 * Ensures the listing has a valid image or provides a placeholder.
 * @param {Array} media - The media array from API response.
 * @returns {string} - The valid image URL or a placeholder.
 */
function getValidImage(media) {
  if (Array.isArray(media) && media.length > 0 && media[0]?.url) {
    return media[0].url;
  }
  return '/images/placeholder.jpg'; // Default placeholder image
}

/**
 * Formats the remaining time until the listing ends.
 * @param {string} endDate - The end date/time of the listing.
 * @returns {string} - A formatted time string.
 */
function formatTimeLeft(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const timeLeft = end - now;

  if (timeLeft <= 0) {
    return 'Auction ended';
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m`;
}
