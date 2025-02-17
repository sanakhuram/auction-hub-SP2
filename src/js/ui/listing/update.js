import { updateListing } from "../../api/listing/update.js";
import { showAlert } from "../../utilities/alert.js";

/**
 * Creates a new auction listing.
 * @param {Object} listingData - The listing data.
 * @returns {Promise<Object>} - The created listing data.
 */

export function populateEditListingForm(listing) {
  if (!listing || Object.keys(listing).length === 0) {
    showAlert("Error: Listing data could not be loaded.", "error");
    return;
  }

  document.getElementById("listingTitleForm").value = listing.data.title || "";
  document.getElementById("listingContentForm").value =
    listing.data.description || "";
  document.getElementById("endsAt").value = listing.data.endsAt
    ? new Date(listing.data.endsAt).toISOString().slice(0, 16)
    : "";

  document.querySelectorAll('input[name="tags"]').forEach((checkbox) => {
    checkbox.checked = listing.data.tags.includes(checkbox.value);
  });

  const images = listing.data.media || [];
  document.getElementById("imageURL1").value = images[0]?.url || "";
  document.getElementById("imageURL2").value = images[1]?.url || "";
  document.getElementById("imageURL3").value = images[2]?.url || "";

  document.getElementById("imageAltText").value = images[0]?.alt || "";
}

/**
 * Deletes a listing by ID.
 * @param {string} listingId - The ID of the listing to delete.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
export async function onUpdateEdit(event) {
  event.preventDefault();

  const editListingForm = event.target;
  const listingId = editListingForm.dataset.id;

  if (!listingId) {
    showAlert("Error: No listing ID found.", "error");
    return;
  }

  const updatedData = {
    title: document.getElementById("listingTitleForm").value.trim(),
    description: document.getElementById("listingContentForm").value.trim(),
    endsAt: document.getElementById("endsAt").value,
    tags: Array.from(
      document.querySelectorAll('input[name="tags"]:checked'),
    ).map((input) => input.value),
    media: [
      {
        url: document.getElementById("imageURL1").value.trim(),
        alt: document.getElementById("imageAltText").value.trim(),
      },
      {
        url: document.getElementById("imageURL2").value.trim(),
        alt: document.getElementById("imageAltText").value.trim(),
      },
      {
        url: document.getElementById("imageURL3").value.trim(),
        alt: document.getElementById("imageAltText").value.trim(),
      },
    ].filter((image) => image.url !== ""), 
  };

  try {
    const updatedListing = await updateListing(listingId, updatedData);
    if (updatedListing) {
      showAlert("✅ Listing updated successfully!", "success");
      setTimeout(() => {
        window.location.href = `/listing/?id=${listingId}`;
      }, 2000);
    } else {
      showAlert("❌ Failed to update listing.", "error");
    }
  } catch (error) {
    console.error("❌ Error updating listing:", error);
    showAlert("Error updating listing. Please try again.", "error");
  }
}
