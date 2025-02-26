import "./css/style.css";
import router from "./js/router/index.js";
import { initializeApp } from "./js/setupEvents.js";
import { setupDarkModeToggle } from "./js/utilities/toggle.js";
import "./js/utilities/activeNav.js";
import { setupBackToTop } from "./js/utilities/backToTop.js";

/**
 * Initializes the application:
 * - Runs the router to handle page-specific logic.
 * - Sets up event listeners for UI elements.
 * - Enables dark mode toggle and "Back to Top" button functionality.
 */

async function init() {
  await router(window.location.pathname);
  initializeApp();
  setupDarkModeToggle();
  setupBackToTop();
}

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader");

  function hideLoader() {
    if (loader) {
      loader.style.display = "none";
    }
  }
  setTimeout(() => {
    hideLoader();
  }, 600);
});
