
//src/app.js

import './css/style.css';
import router from './js/router/index.js';
import { initializeApp } from './js/setupEvents.js';
import { setupDarkModeToggle } from './js/utilities/toggle.js';
import './js/utilities/activeNav.js'


async function init() {
  await router(window.location.pathname); 
  initializeApp();
  setupDarkModeToggle();
}

document.addEventListener('DOMContentLoaded', init);
