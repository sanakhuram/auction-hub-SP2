import { deleteListing } from '../../api/listing/delete';
import { fetchProfile } from '../../api/profile/read';

export async function displayUserListings() {
  const listingsContainer = document.querySelector('#myListings');
  if (!listingsContainer) return;

  listingsContainer.innerHTML =
    '<p class="text-purple-600 font-semibold text-lg">Loading listings...</p>';

  try {
    const username = localStorage.getItem('username');
    if (!username) {
      listingsContainer.innerHTML = `<p class="text-red-500 text-center">You need to log in to view your listings.</p>`;
      return;
    }

    const profileData = await fetchProfile(username);

    if (!profileData || !profileData.listings) {
      listingsContainer.innerHTML = `<p class="text-gray-500 text-center">No listings available.</p>`;
      return;
    }

    const userListings = profileData.listings;

    if (userListings.length === 0) {
      listingsContainer.innerHTML = `<p class="text-gray-500 text-center">You have no active listings.</p>`;
      return;
    }

    listingsContainer.innerHTML = userListings
      .map((listing) => createListingCard(listing))
      .join('');
  } catch (error) {
    listingsContainer.innerHTML =
      '<p class="text-red-500 font-semibold text-lg ">Error loading your listings.</p>';
  }
}

function createListingCard(listing) {
  return `
    <div class="p-4 border rounded-lg shadow-lg bg-olive relative max-w-[1400px] mx-auto w-full">
      <a href="/listing/?id=${listing.id}" class="block">
        <img src="${getValidImage(listing.media)}"
          alt="${listing.media?.[0]?.alt || listing.title}"
          class="w-full h-40 object-cover rounded-md cursor-pointer transition-transform hover:scale-105"
          onerror="this.src='/images/placeholder.jpg';" />
      </a>
      <h3 class="text-lg mt-2 font-semibold">${listing.title}</h3>
      <p class="text-gray-700">Current Bid: <strong>${
        listing.bidCount || 'N/A'
      } Credits</strong></p>
      <p class="text-gray-700">Ends on: ${new Date(
        listing.endsAt
      ).toLocaleDateString()}</p>

      <a href="/listing/edit/?id=${listing.id}" 
        class="inline-block bg-btn-gradient text-white px-4 py-2 mt-3 rounded-lg border border-gray-300 transition hover:bg-blue-700">
        ✏️ Edit
      </a>

      <button data-id="${listing.id}" 
        class="delete-listing bg-red-500 text-white px-4 py-2 mt-3 rounded-lg hover:bg-red-700 transition">
        🗑️ Delete
      </button>
    </div>
  `;
}


async function deleteListingHandler(listingId) {
  const confirmDelete = confirm(
    'Are you sure you want to delete this listing?'
  );
  if (!confirmDelete) return;

  try {
    const success = await deleteListing(listingId);
    if (success) {
      alert('✅ Listing deleted successfully!');
      displayUserListings();
    } else {
      alert('❌ Failed to delete listing. Please try again.');
    }
  } catch (error) {
    alert('Error deleting listing. Check console logs.');
  }
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-listing')) {
    const listingId = event.target.getAttribute('data-id');
    deleteListingHandler(listingId);
  }
});

function getValidImage(media) {
  if (Array.isArray(media) && media.length > 0 && media[0]?.url) {
    return media[0].url;
  }
  return '/images/placeholder.jpg';
}
