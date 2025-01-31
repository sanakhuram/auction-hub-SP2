//src/js/ui/listing/display.js

import { getListings } from '../../api/listing/read.js';

export async function displayListings() {
  const listingsContainer = document.querySelector('#listings-container');

  if (!listingsContainer) return; 

  listingsContainer.innerHTML = '<p>Loading listings...</p>';

  const listings = await getListings();
  console.log('Listings received:', listings); 

   if (!Array.isArray(listings) || listings.length === 0) {
    listingsContainer.innerHTML = '<p>No listings available.</p>';
    return;
  }

  listingsContainer.innerHTML = ''; 

  listings.forEach((listing) => {
    const listingElement = document.createElement('div');
    listingElement.classList.add('listing');
    listingElement.innerHTML = `
            <h2>${listing.title}</h2>
            <img src="${
              listing.media && listing.media.length
                ? listing.media[0]
                : '/images/placeholder.png'
            }" alt="${listing.title}" />
            <p>Current Bid: ${listing.price} Credits</p>
            <p>Ends on: ${new Date(listing.endsAt).toLocaleDateString()}</p>
        `;
    listingsContainer.appendChild(listingElement);
  });
}
