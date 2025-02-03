import { displayListings } from './ui/listing/display.js';
import { displaySingleListing } from './ui/listing/details.js';
import { logout } from './api/auth.js';
import { onLogin } from './ui/auth/login.js';
import { onRegister } from './ui/auth/register.js';

/**
 * Utility function to safely attach event listeners.
 * @param {string} selector - Selector for the target element.
 * @param {string} event - Event type.
 * @param {Function} handler - Event handler function.
 */
function attachEventListener(selector, event, handler) {
  const element = document.querySelector(selector);
  if (element) {
    element.addEventListener(event, handler);
  }
}

/**
 * Initializes the application by setting up event listeners and displaying listings or details based on the page.
 */
export function initializeApp() {
  try {
    const currentPath = window.location.pathname;
    console.log(`🔹 Current Page: ${currentPath}`);

    if (currentPath === '/' || currentPath === '/index.html') {
      console.log('🏠 Home Page Detected - Displaying Listings...');
      displayListings();
    } else if (currentPath.includes('/listing/index.html')) {
      console.log('📄 Listing Details Page Detected - Displaying Details...');
      displaySingleListing();
    } else {
      console.warn('⚠️ Unknown Page: No specific initialization found.');
    }

    // Attach event listeners for authentication forms
    attachEventListener("form[name='register']", 'submit', onRegister);
    attachEventListener("form[name='login']", 'submit', onLogin);

    // Attach logout functionality
    attachEventListener('#logoutBtn', 'click', () => {
      logout();
      window.location.href = '/auth/login.html'; // Redirect after logout
    });
  } catch (error) {
    console.error('❌ Error initializing application:', error);
    alert(
      'An error occurred while initializing the application. Please try again.'
    );
  }
}

// Ensure event listeners are set when the DOM loads
document.addEventListener('DOMContentLoaded', initializeApp);
