//src/js/router/views/display.js
import { authGuard } from '../../utilities/authGuard';
import { displayListings } from '../../ui/listing/display';

export default async function router(path) {
  const appContainer = document.querySelector('#app'); // Main container in index.html

  switch (path) {
    case '/':
    case '/index.html':
      appContainer.innerHTML =
        "<h1>Home</h1><div id='listings-container'></div>";
      await displayListings(); // Fetch and render listings
      break;

    case '/profile/':
      authGuard(); // Restrict access if needed
      appContainer.innerHTML = '<h1>My Profile</h1>';
      break;

    default:
      appContainer.innerHTML = '<h1>404 - Page Not Found</h1>';
  }
}
