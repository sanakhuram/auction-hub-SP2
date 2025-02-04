//app.js

import './css/style.css';
import router from './js/router';
import { initializeApp } from './js/setupEvents.js';

async function init() {
  await router(window.location.pathname);
  initializeApp();
}

document.addEventListener('DOMContentLoaded', init);

