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
    const currentPath = window.location.pathname;
    console.log(`🔹 Current Page: ${currentPath}`);

    if (currentPath === '/' || currentPath === '/') {
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
        fetchProfile(username);
      } else {
        console.warn('No username found in local storage.');
        window.location.href = '/auth/login/';
      }
    }

    // Attach event listeners for authentication forms
    attachEventListener("form[name='register']", 'submit', onRegister);
    attachEventListener("form[name='login']", 'submit', onLogin);

    // Attach logout functionality
    attachEventListener('#logoutBtn', 'click', () => {
      logout();
      window.location.href = '/auth/login/';
    });

    // ✅ Attach event listener for updating profile
    attachEventListener('#updateProfileForm', 'submit', async (event) => {
      event.preventDefault();
      await onUpdateProfile();
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

// Ensure event listeners are set when the DOM loads
document.addEventListener('DOMContentLoaded', initializeApp);
