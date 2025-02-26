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

  if (!carousel || categories.length === 0) return;

  let currentIndex = 0;
  const totalItems = categories.length;

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

  let autoScroll = setInterval(nextSlide, 4000);

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(autoScroll);
      currentIndex = i;
      updateCarousel();
      autoScroll = setInterval(nextSlide, 6000);
    });
  });

  categories.forEach((category) => {
    category.addEventListener("click", () => {
      const selectedCategory =
        category.getAttribute("data-tag") || category.innerText.trim();
      displayListings(selectedCategory);
    });
  });

  updateCarousel();
}
