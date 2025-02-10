import { getListingById } from "../../api/listing/read.js";
import {
  populateEditListingForm,
  onUpdateEdit,
} from "../../ui/listing/update.js";

export async function initializeEditPage() {
  const editListingForm = document.getElementById("editListingForm");
  if (!editListingForm) {
    return;
  }

  editListingForm.addEventListener("submit", onUpdateEdit);

  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get("id");

  if (!listingId) {
    window.location.href = "/profile/";
    return;
  }

  try {
    const listing = await getListingById(listingId);

    if (!listing || !listing.data || Object.keys(listing.data).length === 0) {
      alert("Error: Listing not found.");
      return;
    }

    editListingForm.dataset.id = listingId;
    populateEditListingForm(listing);
  } catch (error) {
    alert("Error loading listing.");
  }
}

document.addEventListener("DOMContentLoaded", initializeEditPage);
