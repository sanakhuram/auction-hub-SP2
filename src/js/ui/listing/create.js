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
    listingDetailsContainer.innerHTML = `
      <h1 class="text-2xl font-bold text-center mb-4">${listing.title}</h1>
      
      <div class="relative flex justify-center items-center">
        <button id="prev-image" class="absolute left-0 bg-gray-600 text-white px-3 py-2 rounded-l">◀</button>
        <img id="listing-image" class="w-full max-w-lg object-cover rounded-md" src="${images[0]}" />
        <button id="next-image" class="absolute right-0 bg-gray-600 text-white px-3 py-2 rounded-r">▶</button>
      </div>

      <p class="text-gray-700 mt-4 text-center">${
        listing.description || "No description available"
      }</p>

      <p class="text-sm text-gray-500 text-center">Ends on: ${new Date(
        listing.endsAt,
      ).toLocaleString()}</p>
    `;
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
    "fashion",
    "sports",
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
      }, 1000);
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
