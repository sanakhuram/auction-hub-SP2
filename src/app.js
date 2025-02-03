//app.js

import './css/style.css';
import router from './js/router';
import { initializeApp } from './js/setupEvents'; // ✅ Carousel now handled in setupEvents.js

async function init() {
  await router(window.location.pathname);
  initializeApp();
}

document.addEventListener('DOMContentLoaded', init);
