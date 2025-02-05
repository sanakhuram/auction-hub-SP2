import { displayListings } from './ui/listing/display.js';
import { displaySingleListing } from './ui/listing/details.js';
import { logout } from './api/auth.js';
import { onLogin } from './ui/auth/login.js';
import { onRegister } from './ui/auth/register.js';
import { initializeCarousel } from './ui/carousel.js';
import { fetchProfile } from './api/profile/read.js';
import { onUpdateProfile } from './ui/profile/update.js';
import { authGuard } from './utilities/authGuard.js';
import { loadUserProfile } from './api/auth.js';
import { onCreateListing } from './ui/listing/create.js';

/**
 * Utility function to safely attach event listeners.
 */
function attachEventListener(selector, event, handler) {
  const element = document.querySelector(selector);
  if (element) {
    element.addEventListener(event, handler);
  }
}

/**
 * Initializes the application by setting up event listeners and displaying listings.
 */
export function initializeApp() {
  try {
    attachEventListener('#createListingForm', 'submit', onCreateListing);
    const currentPath = window.location.pathname;
    console.log(`🔹 Current Page: ${currentPath}`);

    if (currentPath === '/') {
      console.log('🏠 Home Page Detected - Displaying Listings...');
      displayListings();
    } else if (currentPath.includes('/listing/')) {
      console.log('📄 Listing Details Page Detected - Displaying Details...');
      displaySingleListing();
    } else if (currentPath.includes('/profile/')) {
      console.log('👤 Profile Page Detected - Fetching Profile...');
      authGuard();

      const username = localStorage.getItem('username');
      if (username) {
        fetchProfile(username)
          .then((profileData) => {
            if (!profileData) return;

            // ✅ Fix: Ensure elements exist before assignment
            const profileNameEl = document.getElementById('profileName');
            if (profileNameEl)
              profileNameEl.textContent = profileData.name || 'Unknown User';

            const profileEmailEl = document.getElementById('profileEmail');
            if (profileEmailEl)
              profileEmailEl.textContent =
                profileData.email || 'No Email Provided';

            const profileBioEl = document.getElementById('profileBio');
            if (profileBioEl)
              profileBioEl.textContent = profileData.bio || 'No bio available';

            const profileAvatarEl = document.getElementById('profileAvatar');
            if (profileAvatarEl)
              profileAvatarEl.src =
                profileData.avatar?.url || '/images/default-avatar.png';

            const profileBannerEl = document.getElementById('profileBanner');
            if (profileBannerEl)
              profileBannerEl.src =
                profileData.banner?.url || '/images/default-banner.jpg';

            const profileCreditsEl = document.getElementById('profileCredits');
            if (profileCreditsEl)
              profileCreditsEl.textContent = `Credits: ${
                profileData.credits || 0
              }`;

            const profileListingsEl =
              document.getElementById('profileListings');
            if (profileListingsEl)
              profileListingsEl.textContent = `Listings: ${
                profileData._count?.listings || 0
              }`;

            const profileWinsEl = document.getElementById('profileWins');
            if (profileWinsEl)
              profileWinsEl.textContent = `Wins: ${
                profileData._count?.wins || 0
              }`;

            console.log('✅ Profile Data Loaded Successfully:', profileData);
          })
          .catch((error) => console.error('❌ Error fetching profile:', error));
      } else {
        console.warn('⚠️ No username found in local storage.');
        window.location.href = '/auth/login/';
      }
    }

    attachEventListener("form[name='register']", 'submit', onRegister);
    attachEventListener("form[name='login']", 'submit', onLogin);
    attachEventListener('#logoutBtn', 'click', () => {
      logout();
      window.location.href = '/auth/login/';
    });

    attachEventListener('#updateProfileForm', 'submit', async (event) => {
      event.preventDefault();
      await onUpdateProfile(event);
    });

    initializeCarousel();
  } catch (error) {
    console.error('❌ Error initializing application:', error);
    alert(
      'An error occurred while initializing the application. Please try again.'
    );
  }
}

// ✅ Ensure event listeners are set when the DOM loads
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  loadUserProfile();
});

// ✅ Fix: Ensure subscribe button exists before adding an event listener
const subscribeBtn = document.getElementById('subscribe-btn');
if (subscribeBtn) {
  subscribeBtn.addEventListener('click', function () {
    var emailInput = document.getElementById('email-input');
    var message = document.getElementById('subscribe-message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(emailInput.value.trim())) {
      message.classList.remove('hidden');
      message.textContent = 'Thank you for subscribing!';
      setTimeout(() => {
        message.classList.add('hidden');
        emailInput.value = '';
      }, 3000);
    } else {
      message.classList.remove('hidden');
      message.textContent = 'Please enter a valid email.';
    }
  });
}
