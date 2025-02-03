import { displayListings } from '../../ui/listing/display.js';
import { authGuard } from '../../utilities/authGuard.js';

authGuard();

document.addEventListener('DOMContentLoaded', async () => {
  console.log('📌 DOM Loaded - Calling displayListings()...');
  try {
    await displayListings();
  } catch (error) {
    console.error('❌ Error loading listings:', error);
  }
});
