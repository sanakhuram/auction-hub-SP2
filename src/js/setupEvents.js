import { displayListings } from './ui/listing/display.js';
import { displaySingleListing } from './ui/listing/details.js';
import { logout } from './api/auth.js';
import { onLogin } from './ui/auth/login.js';
import { onRegister } from './ui/auth/register.js';
import { initializeCarousel } from './ui/carousel.js';
import { fetchProfile } from './api/profile/read.js';
import { onUpdateProfile } from './ui/profile/update.js';
import { authGuard } from './utilities/authGuard.js'; // ✅ Protect profile page
import { loadUserProfile } from './api/auth.js';

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

      authGuard(); // ✅ Protect profile pages

      const username = localStorage.getItem('username');
      if (username) {
        fetchProfile(username)
          .then((profileData) => {
            if (!profileData) return;

            // ✅ Safely select and update elements
            const nameEl = document.getElementById('profileName');
            const emailEl = document.getElementById('profileEmail');
            const bioEl = document.getElementById('profileBio');
            const avatarEl = document.getElementById('profileAvatar');
            const bannerEl = document.getElementById('profileBanner');
            const creditsEl = document.getElementById('profileCredits');
            const listingsEl = document.getElementById('profileListings');
            const winsEl = document.getElementById('profileWins');

            if (nameEl) nameEl.textContent = profileData.name || 'Unknown User';
            if (emailEl)
              emailEl.textContent = profileData.email || 'No Email Provided';
            if (bioEl)
              bioEl.textContent = profileData.bio || 'No bio available';
            if (avatarEl)
              avatarEl.src =
                profileData.avatar?.url || '/images/default-avatar.png';
            if (bannerEl)
              bannerEl.src =
                profileData.banner?.url || '/images/default-banner.jpg';
            if (creditsEl)
              creditsEl.textContent = `Credits: ${profileData.credits || 0}`;
            if (listingsEl)
              listingsEl.textContent = `Listings: ${
                profileData._count?.listings || 0
              }`;
            if (winsEl)
              winsEl.textContent = `Wins: ${profileData._count?.wins || 0}`;

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
  loadUserProfile(); // ✅ Load user profile to show avatar & logout button
});

// ✅ Fix the Footer Subscribe Button Event Listener
document
  .getElementById('subscribe-btn')
  ?.addEventListener('click', function () {
    var emailInput = document.getElementById('email-input');
    var message = document.getElementById('subscribe-message');

    if (emailInput.value.trim() !== '') {
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
