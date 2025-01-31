import { displayListings } from "./ui/listing/display";

// Ensure DOM is fully loaded before running
document.addEventListener('DOMContentLoaded', () => {
  // Check if we are on the home page
  if (
    window.location.pathname === '/' ||
    window.location.pathname === '/index.html'
  ) {
    displayListings();
  }

  // Add event listeners for login, register, and logout
  const loginBtn = document.querySelector("a[href='/auth/login/']");
  const registerBtn = document.querySelector("a[href='/auth/register/']");
  const logoutBtn = document.querySelector('button');

  if (loginBtn) {
    loginBtn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('Login button clicked');
      window.location.href = '/auth/login/';
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('Register button clicked');
      window.location.href = '/auth/register/';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('Logging out...');
      localStorage.removeItem('token'); // Example: Remove authentication token
      window.location.href = '/'; // Redirect to home
    });
  }
});
