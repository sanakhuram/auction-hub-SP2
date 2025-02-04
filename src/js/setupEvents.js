import { displayListings } from './ui/listing/display.js';
import { displaySingleListing } from './ui/listing/details.js';
import { logout } from './api/auth.js';
import { onLogin } from './ui/auth/login.js';
import { onRegister } from './ui/auth/register.js';
import { initializeCarousel } from './ui/carousel.js';
import { fetchProfile } from './api/profile/read.js';
import { onUpdateProfile } from './ui/profile/update.js';
import { authGuard } from './utilities/authGuard.js'; // ✅ Protect profile page

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
    // ✅ Declare `currentPath` inside function scope
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

      // ✅ Protect the profile page (redirect if not logged in)
      authGuard();

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

    // ✅ Attach event listeners once, outside the fetchProfile block
    attachEventListener("form[name='register']", 'submit', onRegister);
    attachEventListener("form[name='login']", 'submit', onLogin);
    attachEventListener('#logoutBtn', 'click', () => {
      logout();
      window.location.href = '/auth/login/';
    });

    // ✅ Attach event listener for updating profile properly
    attachEventListener('#updateProfileForm', 'submit', async (event) => {
      event.preventDefault(); // ✅ Prevent form submission reload
      await onUpdateProfile(event); // ✅ Pass event object correctly
    });

    // ✅ Initialize the category carousel
    initializeCarousel();
  } catch (error) {
    console.error('❌ Error initializing application:', error);
    alert(
      'An error occurred while initializing the application. Please try again.'
    );
  }
}

// ✅ Ensure event listeners are set when the DOM loads
document.addEventListener('DOMContentLoaded', initializeApp);

// ✅ Fix the Footer Subscribe Button Event Listener
document
  .getElementById('subscribe-btn')
  ?.addEventListener('click', function () {
    var emailInput = document.getElementById('email-input');
    var message = document.getElementById('subscribe-message');

    if (emailInput.value.trim() !== '') {
      message.classList.remove('hidden');
      message.textContent = 'Thank you for subscribing!';

      // Clear input & hide message after 3 seconds
      setTimeout(() => {
        message.classList.add('hidden');
        emailInput.value = ''; // Clears the input field
      }, 3000);
    } else {
      message.classList.remove('hidden');
      message.textContent = 'Please enter a valid email.';
    }
  });
