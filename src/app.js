import './css/style.css';
import router from './js/router/index.js';
import { initializeApp } from './js/setupEvents.js';

async function init() {
  await router(window.location.pathname); // Load correct page script
  initializeApp(); // Initialize events only after routing
}

document.addEventListener('DOMContentLoaded', init);
