import { createListing } from "../../api/listing/create.js";
import { getListingById } from "../../api/listing/read.js";
import { showAlert } from "../../utilities/alert.js";

document.addEventListener("DOMContentLoaded", async () => {
  const listingDetailsContainer = document.getElementById("listing-details");

  if (!listingDetailsContainer) return; 

  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");

  if (!listingId) {
    listingDetailsContainer.innerHTML =
      "<p class='text-red-500'>Listing not found.</p>";
    return;
  }

  try {
    const listing = await getListingById(listingId);

    if (!listing) {
      listingDetailsContainer.innerHTML =
        "<p class='text-red-500'>Listing not found.</p>";
      return;
    }

    listingDetailsContainer.innerHTML = `
      <h1 class="text-2xl font-bold">${listing.title}</h1>
      <img src="${listing.media?.[0]?.url || "/images/placeholder.jpg"}" 
        alt="${listing.media?.[0]?.alt || listing.title}" 
        class="w-full h-60 object-cover rounded-md">
      <p class="text-gray-700">${
        listing.description || "No description available"
      }</p>
      <p class="text-sm text-gray-500">Ends on: ${new Date(
        listing.endsAt,
      ).toLocaleString()}</p>
    `;
  } catch (error) {
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

  const title = document.getElementById("listingTitleForm")?.value.trim();
  const description = document
    .getElementById("listingContentForm")
    ?.value.trim();
  const imageUrl = document.getElementById("imageURL")?.value.trim();
  const imageAlt = document.getElementById("imageAltText")?.value.trim();
  const endsAt = document.getElementById("endsAt")?.value;

  const allowedTags = [
    "art",
    "vintage",
    "watches",
    "games",
    "interior",
    "jewelry",
    "books",
    "collectibles",
    "cars",
    "toys",
  ];

  const tagElements = document.querySelectorAll("input[name='tags']:checked");
  let tags = Array.from(tagElements)
    .map((tag) => tag.value.toLowerCase())
    .filter((tag) => allowedTags.includes(tag));

  if (tags.length === 0) tags = undefined;
  if (!title || !endsAt) {
    showAlert("Title and End Date are required!", "error");
    return;
  }

  const formattedEndsAt = new Date(endsAt).toISOString();
  const media = imageUrl ? [{ url: imageUrl, alt: imageAlt || title }] : [];

  const listingData = {
    title,
    description,
    tags,
    media,
    endsAt: formattedEndsAt,
  };

  try {
    const response = await createListing(listingData);

    if (response) {
      showAlert("Listing created successfully!", "success");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  } catch (error) {
    showAlert("Failed to create listing: " + error.message, "error");
  }
}