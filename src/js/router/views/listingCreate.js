//src/js/router/views/listingCreate.js
import { onCreateListing } from '../../ui/listing/create';
import { authGuard } from '../../utilities/authGuard';

authGuard(); // Ensure user is authenticated

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createListingForm');
  if (form) {
    form.addEventListener('submit', onCreateListing);
  } else {
    console.error('Create Listing form not found');
  }
});

