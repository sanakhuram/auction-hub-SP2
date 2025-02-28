import { displayListings } from "./listing/display";

/**
 * Initializes the category carousel.
 * - Enables automatic scrolling through categories.
 * - Allows users to manually select categories.
 * - Updates the UI to reflect the current slide.
 */
export function initializeCarousel() {
  const carousel = document.getElementById("category-carousel");
  const dots = document.querySelectorAll(".dot");
  const categories = document.querySelectorAll(".category-item");
  const prevBtn = document.getElementById("prev-category");
  const nextBtn = document.getElementById("next-category");

  if (!carousel || categories.length === 0) return;

  let currentIndex = 0;
  const totalItems = categories.length;
  let autoScroll;

  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("bg-secondary", i === currentIndex);
      dot.classList.toggle("bg-white", i !== currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  }

  function startAutoScroll(interval = 4000) {
    clearInterval(autoScroll);
    autoScroll = setInterval(nextSlide, interval);
  }

  startAutoScroll();

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(autoScroll);
      currentIndex = i;
      updateCarousel();
      startAutoScroll(4000);
    });
  });

  categories.forEach((category) => {
    category.addEventListener("click", () => {
      const selectedCategory =
        category.getAttribute("data-tag") || category.innerText.trim();
      displayListings(selectedCategory);
    });
  });

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      clearInterval(autoScroll);
      prevSlide();
      startAutoScroll(4000);
    });

    nextBtn.addEventListener("click", () => {
      clearInterval(autoScroll);
      nextSlide();
      startAutoScroll(4000);
    });
  }

  updateCarousel();
}

/**
 * Sets up scroll arrow functionality for mobile scrolling.
 * This ensures the category list scrolls correctly when users tap the navigation arrows.
 * @param {string} containerId - The ID of the scrollable container.
 * @param {string} prevBtnId - The ID of the "previous" button.
 * @param {string} nextBtnId - The ID of the "next" button.
 */
function setupScrollArrows(containerId, prevBtnId, nextBtnId) {
  const container = document.getElementById(containerId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  if (!container || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener("click", () => {
    container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeCarousel();
  setupScrollArrows("category-carousel", "prev-category", "next-category");
});
