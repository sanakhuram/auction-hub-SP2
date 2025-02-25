/**
 * Paginates an array of listings.
 * @param {Array} listings - The full list of listings.
 * @param {number} currentPage - The current page number.
 * @param {number} itemsPerPage - Number of listings per page.
 * @returns {Object} - Contains paginated items, total pages, and current page.
 */
export function paginateListings(listings, currentPage = 1, itemsPerPage = 12) {
  const totalItems = listings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = listings.slice(startIndex, endIndex);

  return { paginatedItems, totalPages, currentPage };
}

/**
 * Renders pagination controls dynamically.
 * @param {number} totalPages - Total number of pages.
 * @param {number} currentPage - Current page number.
 * @param {Function} onPageChange - Callback function to change page.
 */
export function renderPaginationControls(
  totalPages,
  currentPage,
  onPageChange,
) {
  const paginationContainer = document.getElementById("pagination-controls");

  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  if (currentPage > 1) {
    paginationContainer.innerHTML += `
      <button class="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base rounded-md border border-secondary bg-olive dark:bg-dark hover:bg-secondary hover:text-white transition-transform transform hover:scale-105"
        data-page="${currentPage - 1}">
        ← Prev
      </button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `
      <button class="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base rounded-md border shadow-dark mt-2 
        ${i === currentPage ? "bg-secondary text-white" : "bg-muted"} hover:bg-olive transition-transform transform hover:scale-105" 
        data-page="${i}">
        ${i}
      </button>`;
  }

  if (currentPage < totalPages) {
    paginationContainer.innerHTML += `
      <button class="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base rounded-md border border-secondary bg-muted hover:bg-accent mt-2 transition-transform transform hover:scale-105"
        data-page="${currentPage + 1}">
        Next →
      </button>`;
  }

  paginationContainer.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const newPage = parseInt(event.target.getAttribute("data-page"));
      onPageChange(newPage);
    });
  });
}
