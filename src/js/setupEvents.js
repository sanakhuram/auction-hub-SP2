import { displayListings } from './ui/listing/display.js';
import { logout } from './api/auth.js'; // Use the unified logout function
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
 * Initializes the application by setting up event listeners and displaying listings.
 */
export function initializeApp() {
  try {
    // Display Listings if on Home Page
    if (
      window.location.pathname === '/' ||
      window.location.pathname === '/index.html'
    ) {
      displayListings();
    }

    // Attach event listeners for authentication
    attachEventListener("form[name='register']", 'submit', onRegister);
    attachEventListener("form[name='login']", 'submit', onLogin);
    attachEventListener('#logoutBtn', 'click', logout); // Attach the logout function
  } catch (error) {
    console.error('Error initializing application:', error);
    alert(
      'An error occurred while initializing the application. Please try again.'
    );
  }
}

// Ensure event listeners are set when the DOM loads
document.addEventListener('DOMContentLoaded', initializeApp);
