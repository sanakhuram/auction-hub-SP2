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

    const images = getValidImages(listing.media);

    let currentImageIndex = 0;

    function updateImage() {
      document.getElementById("listing-image").src = images[currentImageIndex];
    }

    document.getElementById("prev-image").addEventListener("click", () => {
      currentImageIndex =
        (currentImageIndex - 1 + images.length) % images.length;
      updateImage();
    });

    document.getElementById("next-image").addEventListener("click", () => {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateImage();
    });
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
  const endsAt = document.getElementById("endsAt")?.value;

  const image1 = document.getElementById("imageURL1")?.value.trim();
  const image2 = document.getElementById("imageURL2")?.value.trim();
  const image3 = document.getElementById("imageURL3")?.value.trim();

  const images = [image1, image2, image3].filter((url) => url !== "");

  const imageAlt = document.getElementById("imageAltText")?.value.trim();

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
  const media = images.map((url) => ({ url, alt: imageAlt || title }));

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

/**
 * Extracts up to 3 valid images from media array.
 * @param {Array} media - Listing media array.
 * @returns {Array} - Array of image URLs.
 */
function getValidImages(media) {
  if (!Array.isArray(media) || media.length === 0) {
    return ["/images/placeholder.jpg"];
  }
  return media.map((image) => image.url).slice(0, 3);
}
