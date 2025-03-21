import { updateProfile } from "../../api/profile/update.js";
import { fetchProfile } from "../../api/profile/read.js";
import { showAlert } from "../../utilities/alert.js";
import { displayListings } from "../listing/display.js";

/**
 * Handles profile updates when the user submits the form.
 * - Checks for authentication before proceeding.
 * - Compares new input values with existing profile data.
 * - Sends update request only if there are changes.
 * - Updates the UI with new profile data after a successful update.
 *
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} - Resolves when the profile is updated and UI is refreshed.
 */

export async function onUpdateProfile(event) {
  if (event) event.preventDefault();

  const username = localStorage.getItem("username");

  if (!username) {
    showAlert("No username found. Redirecting to login...", "error");
    setTimeout(() => (window.location.href = "/auth/login/"), 2000);
    return;
  }

  try {
    const currentProfile = await fetchProfile(username);
    if (!currentProfile) {
      showAlert("Failed to fetch profile. Try again later.", "error");
      return;
    }

    const bioInput = document.getElementById("bioInput")?.value.trim();
    const avatarUrlInput = document.getElementById("avatarInput")?.value.trim();
    const bannerUrlInput = document.getElementById("bannerInput")?.value.trim();

    const updateData = {};
    if (bioInput && bioInput !== currentProfile.bio) updateData.bio = bioInput;
    if (avatarUrlInput && avatarUrlInput !== currentProfile.avatar?.url) {
      updateData.avatar = { url: avatarUrlInput, alt: "User Avatar" };
    }
    if (bannerUrlInput && bannerUrlInput !== currentProfile.banner?.url) {
      updateData.banner = { url: bannerUrlInput, alt: "User Banner" };
    }

    if (Object.keys(updateData).length === 0) {
      return showAlert(
        "No changes detected. Update at least one field.",
        "warning",
      );
    }

    const updatedProfile = await updateProfile(username, updateData);
    showAlert("✅ Profile updated successfully!", "success");

    document.getElementById("profileBio").textContent =
      updatedProfile.bio || "";
    document.getElementById("profileAvatar").src =
      updatedProfile.avatar?.url || "/images/default-avatar.png";
    document.getElementById("profileBanner").src =
      updatedProfile.banner?.url || "/images/default-banner.jpg";

    const latestProfile = await fetchProfile(username);
    if (latestProfile?.listings) {
      displayListings(latestProfile.listings);
    }

    document.getElementById("profileFormContainer").classList.add("hidden");
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    showAlert(
      "Failed to update profile. Please check your input values.",
      "error",
    );
  }
}
