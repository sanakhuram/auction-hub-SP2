//src/js/ui/profile/read.js

import { authGuard } from '../../utilities/authGuard.js';
import { fetchProfile } from '../../api/profile/read.js';


authGuard();
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Page Loaded!');

  const username = localStorage.getItem('username');
  if (!username) {
    alert('No username found. Redirecting to login...');
    window.location.href = '/auth/login/';
    return;
  }

  try {
    const profile = await fetchProfile(username);
    if (!profile || !profile.data) throw new Error('Profile data is empty!');

    console.log('✅ Profile Data Loaded Successfully:', profile);
    const userData = profile.data;

      document.getElementById('profileAvatar').src =
      userData.avatar?.url || '/images/placeholder.jpg';
    document.getElementById('profileBanner').src =
      userData.banner?.url || '/images/banner.png';
    document.getElementById('profileName').textContent =
      userData.name || 'No name';
    document.getElementById('profileEmail').textContent =
      userData.email || 'No email';
    document.getElementById('profileBio').textContent =
      userData.bio || 'No bio available';
    document.getElementById('profileCredits').textContent = `Credits: ${
      userData.credits || 0
    }`;
    document.getElementById('profileListings').textContent = `Listings: ${
      userData._count?.listings || 0
    }`;
    document.getElementById('profileWins').textContent = `Wins: ${
      userData._count?.wins || 0
    }`;

    console.log(
      '🔄 Attempting to update listings on page...',
      userData.listings
    );
    displayListings(userData.listings);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    alert('Failed to load profile. Please try again.');
  }
});

function displayListings(listings) {
  const myListingsContainer = document.getElementById('myListings');

  if (!myListingsContainer) {
    console.error(
      "❌ Error: Could not find 'myListings' container in the DOM."
    );
    return;
  }

  console.log('📌 Listings received for rendering:', listings);

  myListingsContainer.innerHTML = ''; 

  if (!Array.isArray(listings) || listings.length === 0) {
    myListingsContainer.innerHTML = `<p class="text-gray-500 text-center">No listings available</p>`;
    return;
  }

  listings.forEach((listing) => {
    console.log('🖼 Rendering Listing:', listing);

    const title = listing.title || 'Untitled';
    const description = listing.description || 'No description available';
    const imageUrl = listing.media?.[0]?.url || '/images/placeholder.jpg';
    const altText = listing.media?.[0]?.alt || 'No image available';
    const endsAt = listing.endsAt
      ? new Date(listing.endsAt).toLocaleString()
      : 'N/A';

    const listingElement = document.createElement('div');
    listingElement.classList.add(
      'p-4',
      'border',
      'rounded-lg',
      'shadow-sm',
      'bg-gray-100'
    );

    listingElement.innerHTML = `
      <img src="${imageUrl}" alt="${altText}" class="w-full h-40 object-cover rounded-lg mb-2">
      <h3 class="text-lg font-semibold">${title}</h3>
      <p class="text-gray-700">${description}</p>
      <p class="text-gray-600"><strong>Ends At:</strong> ${endsAt}</p>
    `;

    myListingsContainer.appendChild(listingElement);
  });
}


