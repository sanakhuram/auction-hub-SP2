//src/js/ui/listing/create.js

import { createListing } from '../../api/listing/create.js'; 
import { getListingById } from '../../api/listing/read.js';

document.addEventListener('DOMContentLoaded', async () => {
  const listingDetailsContainer = document.getElementById('listing-details');

  if (!listingDetailsContainer) {
    console.error('❌ #listing-details container NOT FOUND IN DOM!');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const listingId = params.get('id');

  if (!listingId) {
    listingDetailsContainer.innerHTML =
      "<p class='text-red-500'>Listing not found.</p>";
    return;
  }

  console.log(`🔵 Fetching listing details for ID: ${listingId}`);

  try {
    const listing = await getListingById(listingId);

    if (!listing) {
      listingDetailsContainer.innerHTML =
        "<p class='text-red-500'>Listing not found.</p>";
      return;
    }

    listingDetailsContainer.innerHTML = `
      <h1 class="text-2xl font-bold">${listing.title}</h1>
      <img src="${listing.media?.[0]?.url || '/images/placeholder.jpg'}" alt="${
      listing.media?.[0]?.alt || listing.title
    }" class="w-full h-60 object-cover rounded-md">
      <p class="text-gray-700">${
        listing.description || 'No description available'
      }</p>
      <p class="text-sm text-gray-500">Ends on: ${new Date(
        listing.endsAt
      ).toLocaleString()}</p>
    `;
  } catch (error) {
    console.error('❌ Error loading listing details:', error);
    listingDetailsContainer.innerHTML =
      "<p class='text-red-500'>Failed to load listing.</p>";
  }
});
/**
 * Handles the form submission to create a new listing.
 * @param {Event} event - The form submission event.
 */
export async function onCreateListing(event) {
  event.preventDefault();

  const title = document.getElementById('listingTitleForm')?.value.trim();
  const description = document
    .getElementById('listingContentForm')
    ?.value.trim();
  const imageUrl = document.getElementById('imageURL')?.value.trim();
  const imageAlt = document.getElementById('imageAltText')?.value.trim();
  const endsAt = document.getElementById('endsAt')?.value;

  // ✅ Define allowed tags (adjust these based on what the API accepts)
  const allowedTags = [
    'art',
    'vintage',
    'watches',
    'games',
    'interior',
    'jewelry',
    'books',
    'toys',
    'vintage'
  ];

  // ✅ Get checked tags, convert to lowercase, and filter out invalid ones
  const tagElements = document.querySelectorAll("input[name='tags']:checked");
  let tags = Array.from(tagElements)
    .map((tag) => tag.value.toLowerCase())
    .filter((tag) => allowedTags.includes(tag)); // Remove invalid tags

   if (tags.length === 0) {
    tags = undefined;
  }

  if (!title || !endsAt) {
    alert('Title and End Date are required!');
    return;
  }

  // ✅ Fix `endsAt` to ensure correct ISO 8601 format
  const formattedEndsAt = new Date(endsAt).toISOString();

  // ✅ Ensure `media` is correctly structured
  const media = imageUrl ? [{ url: imageUrl, alt: imageAlt || title }] : [];

  const listingData = {
    title,
    description,
    tags, // ✅ Now properly formatted and validated
    media,
    endsAt: formattedEndsAt, // ✅ Proper ISO format
  };

  console.log(
    '📤 Submitting listing with data:',
    JSON.stringify(listingData, null, 2)
  );

  try {
    const response = await createListing(listingData);
    console.log('✅ Response from API:', response);

    if (response) {
      alert('Listing created successfully!');
      window.location.href = '/';
    }
  } catch (error) {
    console.error('❌ Error creating listing:', error);
    alert('Failed to create listing: ' + error.message);
  }
}

