import './css/style.css';
import router from './js/router/index.js';
import { initializeApp } from './js/setupEvents.js';

async function init() {
  await router(window.location.pathname); 
  initializeApp(); 
}

document.addEventListener('DOMContentLoaded', init);
