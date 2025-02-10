import { updateListing } from "../../api/listing/update.js";

export function populateEditListingForm(listing) {
  if (!listing || Object.keys(listing).length === 0) {
    alert("Error: Listing data could not be loaded.");
    return;
  }

  document.getElementById("listingTitleForm").value = listing.data.title || "";
  document.getElementById("listingContentForm").value =
    listing.data.description || "";
  document.getElementById("imageURL").value =
    listing.data.media?.[0]?.url || "";
  document.getElementById("imageAltText").value =
    listing.data.media?.[0]?.alt || "";
  document.getElementById("endsAt").value = listing.data.endsAt
    ? new Date(listing.data.endsAt).toISOString().slice(0, 16)
    : "";

  document.querySelectorAll('input[name="tags"]').forEach((checkbox) => {
    checkbox.checked = listing.data.tags.includes(checkbox.value);
  });
}

export async function onUpdateEdit(event) {
  event.preventDefault();

  const editListingForm = event.target;
  const listingId = editListingForm.dataset.id;

  if (!listingId) {
    alert("Error: No listing ID found.");
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
        url: document.getElementById("imageURL").value.trim(),
        alt: document.getElementById("imageAltText").value.trim(),
      },
    ],
  };

  const updatedListing = await updateListing(listingId, updatedData);
  if (updatedListing) {
    alert("Listing updated successfully!");
    window.location.href = `/listing/?id=${listingId}`;
  } else {
    alert("Failed to update listing.");
  }
}
