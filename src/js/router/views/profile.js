import { authGuard } from "../../utilities/authGuard";
import { fetchProfile } from "../../api/profile/read";
import { onUpdateProfile } from "../../ui/profile/update.js";
import { displayUserListings } from "../../ui/listing/profileListing.js";

// ✅ Protect Route
authGuard();

document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("No username found. Redirecting to login...");
    window.location.href = "/auth/login.html";
    return;
  }

  try {
    const profileData = await fetchProfile(username);
    if (!profileData) throw new Error("Profile data is empty!");

    document.getElementById("profileName").textContent =
      profileData.name || "No Name";
    document.getElementById("profileEmail").textContent =
      profileData.email || "No Email Provided";
    document.getElementById("profileBio").textContent =
      profileData.bio || "No Bio Available";
    document.getElementById("profileAvatar").src =
      profileData.avatar?.url || "/images/default-avatar.png";
    document.getElementById("profileBanner").src =
      profileData.banner?.url || "/images/default-banner.jpg";
    document.getElementById("profileCredits").textContent =
      `Credits: ${profileData.credits || 0}`;
    document.getElementById("profileListings").textContent =
      `Listings: ${profileData._count?.listings || 0}`;
    document.getElementById("profileWins").textContent =
      `Wins: ${profileData._count?.wins || 0}`;

    document.getElementById("bioInput").value = profileData.bio || "";
    document.getElementById("avatarInput").value =
      profileData.avatar?.url || "";
    document.getElementById("bannerInput").value =
      profileData.banner?.url || "";
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    alert("Failed to load profile. Please try again.");
  }
});

document
  .getElementById("updateProfileForm")
  ?.addEventListener("submit", onUpdateProfile);
displayUserListings();
