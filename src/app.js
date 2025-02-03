import './css/style.css'; 
import router from './js/router'; 
import { initializeApp } from './js/setupEvents'; 

/**
 * Initializes the app and handles routing based on the current path.
 */
async function init() {
  await router(window.location.pathname); 
  initializeApp(); 
}

document.addEventListener('DOMContentLoaded', init);
