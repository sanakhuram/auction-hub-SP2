import { showAlert, showConfirmAlert } from "../utilities/alert";
import { fetchProfile } from "./profile/read";

export function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  sessionStorage.clear();

  document.getElementById("logoutBtn")?.classList.add("hidden");
  document.getElementById("loginBtn")?.classList.remove("hidden");
  document.getElementById("user-profile-desktop")?.classList.add("hidden");
  document.getElementById("user-profile-mobile")?.classList.add("hidden");
  document
    .getElementById("user-avatar-desktop")
    ?.setAttribute("src", "/images/default-avatar.png");
  document
    .getElementById("user-avatar-mobile")
    ?.setAttribute("src", "/images/default-avatar.png");
  document.getElementById("mobile-logout")?.classList.add("hidden");
  document.getElementById("mobile-login")?.classList.remove("hidden");

  showAlert("You have been logged out.", "warning");

  setTimeout(() => (window.location.href = "/auth/login/"), 1000);
}

/**
 * Retrieves the logged-in user's information from localStorage.
 * @returns {Object|null} An object containing username and token, or null if no user is logged in.
 */
export function getLoggedInUser() {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  return username && token ? { username, token } : null;
}

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} True if the user is logged in, otherwise false.
 */
export function isUserLoggedIn() {
  return !!localStorage.getItem("token");
}

/**
 * Updates the user's information in localStorage.
 * @param {Object} updatedData - An object containing the updated user information.
 */
export function updateUserInfo(updatedData) {
  if (updatedData.name) localStorage.setItem("username", updatedData.name);
  if (updatedData.token) localStorage.setItem("token", updatedData.token);
}

/**
 * Loads the user's profile and updates the UI accordingly.
 */
export async function loadUserProfile() {
  const username = localStorage.getItem("username");
  const authToken = localStorage.getItem("token");

  if (!username || !authToken) {
    document.getElementById("loginLink")?.classList.remove("hidden");
    document.getElementById("logoutBtn")?.classList.add("hidden");
    document.getElementById("user-profile-desktop")?.classList.add("hidden");
    document.getElementById("user-profile-mobile")?.classList.add("hidden");
    document.getElementById("mobile-logout")?.classList.add("hidden");
    document.getElementById("mobile-login")?.classList.remove("hidden");

    showAlert("You are not logged in. Please sign in to bid.", "info");
    return;
  }

  try {
    const profileData = await fetchProfile(username);
    if (!profileData) throw new Error("No profile data received.");

    document.getElementById("user-profile-desktop")?.classList.remove("hidden");
    document.getElementById("user-profile-mobile")?.classList.remove("hidden");
    document.getElementById("logoutBtn")?.classList.remove("hidden");
    document.getElementById("mobile-logout")?.classList.remove("hidden");
    document.getElementById("mobile-login")?.classList.add("hidden");
    document.getElementById("loginLink")?.classList.add("hidden");

    const avatarUrl = profileData.avatar?.url || "/images/default-avatar.png";
    document
      .getElementById("user-avatar-desktop")
      ?.setAttribute("src", avatarUrl);
    document
      .getElementById("user-avatar-mobile")
      ?.setAttribute("src", avatarUrl);

    document
      .getElementById("user-avatar-desktop")
      ?.parentElement?.setAttribute("href", "/profile/");
    document
      .getElementById("user-avatar-mobile")
      ?.parentElement?.setAttribute("href", "/profile/");

    showAlert("Welcome back, " + username + "!", "success");
  } catch (error) {
    console.error("Error loading user profile:", error);
    showAlert("Failed to load profile. Please try again.", "error");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const mobileLogout = document.getElementById("mobile-logout");

  if (mobileLogout) {
    mobileLogout.addEventListener("click", function (event) {
      event.preventDefault();

      showConfirmAlert("Are you sure you want to log out?").then(
        (confirmed) => {
          if (confirmed) {
            logout();
          }
        },
      );
    });
  }
});
document.addEventListener("DOMContentLoaded", async function () {
  const coinCredits = document.getElementById("coin-credits");
  if (!coinCredits) return;

  try {
    const username = localStorage.getItem("username");
    if (!username) return;

    const profileData = await fetchProfile(username);
    if (!profileData) throw new Error("No profile data received.");

    const credits = profileData.credits || 0;

    coinCredits.textContent = `${credits}`;
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
  }
});
