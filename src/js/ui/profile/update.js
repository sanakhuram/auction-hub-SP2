import { updateProfile } from "../../api/profile/update.js";
import { fetchProfile } from "../../api/profile/read.js";
import { showAlert } from "../../utilities/alert.js";
import { displayListings } from "../listing/display.js"; // ✅ Import for updating listings

/**
 * Handles profile updates when the user submits the form.
 * @param {Event} event - The form submission event.
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
    // Fetch current profile before updating
    const currentProfile = await fetchProfile(username);
    if (!currentProfile) {
      showAlert("Failed to fetch profile. Try again later.", "error");
      return;
    }

    // Get input values from the form
    const bioInput = document.getElementById("bioInput")?.value.trim();
    const avatarUrlInput = document.getElementById("avatarInput")?.value.trim();
    const bannerUrlInput = document.getElementById("bannerInput")?.value.trim();

    // Prepare only the changed data
    const updateData = {};
    if (bioInput && bioInput !== currentProfile.bio) updateData.bio = bioInput;
    if (avatarUrlInput && avatarUrlInput !== currentProfile.avatar?.url) {
      updateData.avatar = { url: avatarUrlInput, alt: "User Avatar" };
    }
    if (bannerUrlInput && bannerUrlInput !== currentProfile.banner?.url) {
      updateData.banner = { url: bannerUrlInput, alt: "User Banner" };
    }

    // Prevent empty update requests
    if (Object.keys(updateData).length === 0) {
      return showAlert(
        "No changes detected. Update at least one field.",
        "warning",
      );
    }

    // Send update request
    const updatedProfile = await updateProfile(username, updateData);
    showAlert("✅ Profile updated successfully!", "success");

    // Update UI with new data
    document.getElementById("profileBio").textContent =
      updatedProfile.bio || "";
    document.getElementById("profileAvatar").src =
      updatedProfile.avatar?.url || "/images/default-avatar.png";
    document.getElementById("profileBanner").src =
      updatedProfile.banner?.url || "/images/default-banner.jpg";

    // Refresh listings if available
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
