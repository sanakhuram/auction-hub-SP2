import { displayListings } from '../ui/listing/display.js';

let currentSearchQuery = ''; // ✅ Store the search query globally

/**
 * Initializes the search functionality by updating listings dynamically.
 */
export function initializeSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  if (!searchInput || !searchBtn) {
    console.warn('⚠️ Search elements not found in DOM.');
    return;
  }

  searchBtn.addEventListener('click', () => {
    currentSearchQuery = searchInput.value.trim(); // ✅ Store query globally
    displayListings('', currentSearchQuery, 1); // ✅ Always reset to page 1 when searching
  });

  // Enable search on "Enter" keypress
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if inside a form
      currentSearchQuery = searchInput.value.trim();
      displayListings('', currentSearchQuery, 1);
    }
  });
}

/**
 * Returns the stored search query to ensure pagination keeps search results.
 */
export function getCurrentSearchQuery() {
  return currentSearchQuery;
}
