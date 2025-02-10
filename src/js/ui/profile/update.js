import { updateProfile } from "../../api/profile/update.js";
import { fetchProfile } from "../../api/profile/read.js";
import { showAlert } from "../../utilities/alert.js";
/**
 * Handles updating the profile UI when the user submits the form.
 * @param {Event} event - The form submission event.
 */
export async function onUpdateProfile(event) {
  if (event) event.preventDefault();

  const username = localStorage.getItem("username");
  if (!username) {
    showAlert("No username found. Redirecting to login...", "error");
    setTimeout(() => {
      window.location.href = "/auth/login/";
    }, 2000);
    return;
  }

  const bio = document.getElementById("bioInput")?.value.trim();
  const avatarUrl = document.getElementById("avatarInput")?.value.trim();
  const bannerUrl = document.getElementById("bannerInput")?.value.trim();

  const updateData = {};
  if (bio) updateData.bio = bio;
  if (avatarUrl) updateData.avatar = { url: avatarUrl, alt: "User Avatar" };
  if (bannerUrl) updateData.banner = { url: bannerUrl, alt: "User Banner" };

  if (Object.keys(updateData).length === 0) {
    alert("Please update at least one field.");
    return;
  }

  try {
    const updatedProfile = await updateProfile(username, updateData);

    if (updatedProfile.bio)
      document.getElementById("profileBio").textContent = updatedProfile.bio;
    if (updatedProfile.avatar?.url)
      document.getElementById("profileAvatar").src = updatedProfile.avatar.url;
    if (updatedProfile.banner?.url)
      document.getElementById("profileBanner").src = updatedProfile.banner.url;

    if (updatedProfile.credits !== undefined) {
      document.getElementById("profileCredits").textContent =
        `Credits: ${updatedProfile.credits}`;
    }
    if (updatedProfile.bids !== undefined) {
      document.getElementById("profileBids").textContent =
        `Bids: ${updatedProfile.bids.length}`;
    }
    if (updatedProfile.wins !== undefined) {
      document.getElementById("profileWins").textContent =
        `Wins: ${updatedProfile.wins.length}`;
    }

    document.getElementById("updateMessage").textContent =
      "✅ Profile updated successfully!";

    const latestProfile = await fetchProfile(username);
    if (latestProfile?.listings) {
      displayListings(latestProfile.listings);
    }
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    showAlert(
      "Failed to update profile. Please check your input values.",
      "error",
    );
  }
}

/**
 * Updates the listings UI after profile update.
 * @param {Array} listings - Array of listing objects.
 */
function displayListings(listings) {
  const myListingsContainer = document.getElementById("myListings");
  if (!myListingsContainer) return;

  myListingsContainer.innerHTML = ""; // Clear previous content

  if (!Array.isArray(listings) || listings.length === 0) {
    myListingsContainer.innerHTML = `<p class="text-gray-500 text-center">No listings available</p>`;
    return;
  }

  listings.forEach((listing) => {
    const title = listing.title || "Untitled";
    const description = listing.description || "No description available";
    const imageUrl = listing.media?.[0]?.url || "/images/placeholder.jpg";
    const altText = listing.media?.[0]?.alt || "No image available";
    const endsAt = listing.endsAt
      ? new Date(listing.endsAt).toLocaleString()
      : "N/A";

    const listingElement = document.createElement("div");
    listingElement.classList.add(
      "p-4",
      "border",
      "rounded-lg",
      "shadow-sm",
      "bg-olive",
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
