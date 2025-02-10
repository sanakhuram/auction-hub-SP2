import { displayListings } from "../ui/listing/display.js";

let currentSearchQuery = "";

export function initializeSearch() {
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");

  if (!searchInput || !searchBtn) {
    console.warn("⚠️ Search elements not found in DOM.");
    return;
  }

  searchBtn.addEventListener("click", () => {
    currentSearchQuery = searchInput.value.trim();
    displayListings("", currentSearchQuery, 1);
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      currentSearchQuery = searchInput.value.trim();
      displayListings("", currentSearchQuery, 1);
    }
  });
}

export function getCurrentSearchQuery() {
  return currentSearchQuery;
}
