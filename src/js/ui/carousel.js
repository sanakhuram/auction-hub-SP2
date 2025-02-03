import { displayListings } from "./listing/display";

export function initializeCarousel() {
  console.log('✅ Initializing category carousel...');

  const carousel = document.getElementById('category-carousel');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const categories = document.querySelectorAll('.category-item img');

  if (!carousel || !prevBtn || !nextBtn || categories.length === 0) {
    console.error('❌ Carousel elements not found!');
    return;
  }

  let currentIndex = 0;
  const totalItems = categories.length;

  function updateCarousel() {
    console.log(`🔄 Moving to index: ${currentIndex}`);
    const offset = currentIndex * carousel.clientWidth;
    carousel.scrollTo({ left: offset, behavior: 'smooth' });
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalItems - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  // ✅ Clicking on a category updates listings
  categories.forEach((img) => {
    img.addEventListener('click', () => {
      const selectedCategory = img.alt;
      console.log(`🟢 Category Selected: ${selectedCategory}`);
      displayListings(selectedCategory);
    });
  });

  updateCarousel(); // Initialize position
}