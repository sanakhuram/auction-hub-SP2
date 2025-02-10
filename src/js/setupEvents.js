// Import necessary modules
import { displayListings } from "./ui/listing/display.js";
import { displaySingleListing } from "./ui/listing/details.js";
import { logout } from "./api/auth.js";
import { onLogin } from "./ui/auth/login.js";
import { onRegister } from "./ui/auth/register.js";
import { initializeCarousel } from "./ui/carousel.js";
import { fetchProfile } from "./api/profile/read.js";
import { onUpdateProfile } from "./ui/profile/update.js";
import { authGuard } from "./utilities/authGuard.js";
import { loadUserProfile } from "./api/auth.js";
import { onCreateListing } from "./ui/listing/create.js";
import { initializeEditPage } from "./router/views/listingEdit.js";
import { initializeSearch } from "./utilities/search";
import { showAlert } from "./utilities/alert.js";


function attachEventListener(selector, event, handler) {
  const element = document.querySelector(selector);
  if (element) {
    element.addEventListener(event, handler);
  }
}


export function initializeApp() {
  try {
    attachEventListener("#createListingForm", "submit", onCreateListing);
    const currentPath = window.location.pathname;

    const carousel = document.getElementById("carouselContainer");
    const listingContainer = document.getElementById("listingContainer");


    if (currentPath === "/") {
      if (carousel) carousel.style.display = "block";
      if (listingContainer) listingContainer.style.display = "block";
      displayListings();
      initializeCarousel();
    } else {
      if (carousel) carousel.style.display = "none";
      if (listingContainer) listingContainer.style.display = "none";
    }

    if (currentPath.includes("/listing/edit/")) {
      authGuard();
      initializeEditPage();
    } else if (currentPath.includes("/listing/")) {
      displaySingleListing();
    } else if (currentPath.includes("/profile/")) {
      authGuard();
      loadProfilePage();
    }

 
    attachEventListener("form[name='register']", "submit", onRegister);
    attachEventListener("form[name='login']", "submit", onLogin);
    attachEventListener("#logoutBtn", "click", () => {
      logout();
      window.location.href = "/auth/login/";
    });

    attachEventListener("#updateProfileForm", "submit", async (event) => {
      event.preventDefault();
      await onUpdateProfile(event);
    });
  } catch (error) {
    showAlert(
      "An error occurred while initializing the application. Please try again.","error",
    );
  }
}

function loadProfilePage() {
  const username = localStorage.getItem("username");
  if (!username) {
    window.location.href = "/auth/login/";
    return;
  }

  fetchProfile(username)
    .then((profileData) => {
      if (!profileData) return;

      const profileElements = {
        profileName: profileData.name || "Unknown User",
        profileEmail: profileData.email || "No Email Provided",
        profileBio: profileData.bio || "No bio available",
        profileAvatar: profileData.avatar?.url || "/images/default-avatar.png",
        profileBanner: profileData.banner?.url || "/images/default-banner.jpg",
        profileCredits: `Credits: ${profileData.credits || 0}`,
        profileListings: `Listings: ${profileData._count?.listings || 0}`,
        profileWins: `Wins: ${profileData._count?.wins || 0}`,
      };

      Object.keys(profileElements).forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          if (id === "profileAvatar" || id === "profileBanner") {
            element.src = profileElements[id];
          } else {
            element.textContent = profileElements[id];
          }
        }
      });

       const editIcon = document.getElementById("editProfileIcon");
      const profileForm = document.getElementById("profileFormContainer");

      if (editIcon && profileForm) {
        editIcon.addEventListener("click", function () {
          profileForm.classList.toggle("hidden"); 
        });
      }
    })
    .catch(() => {});
}

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  loadUserProfile();
});

if (window.location.pathname === "/") {
  initializeSearch();
}


const subscribeBtn = document.getElementById("subscribe-btn");
if (subscribeBtn) {
  subscribeBtn.addEventListener("click", function () {
    const emailInput = document.getElementById("email-input");
    const message = document.getElementById("subscribe-message");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(emailInput.value.trim())) {
      message.classList.remove("hidden");
      message.textContent = "Thank you for subscribing!";
      setTimeout(() => {
        message.classList.add("hidden");
        emailInput.value = "";
      }, 3000);
    } else {
      message.classList.remove("hidden");
      message.textContent = "Please enter a valid email.";
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("/profile/")) {
    const editIcon = document.getElementById("editProfileIcon");
    const profileForm = document.getElementById("profileFormContainer");

    if (editIcon && profileForm) {
      editIcon.addEventListener("click", function () {
        profileForm.classList.toggle("hidden"); 
      });
    }
  }
});
