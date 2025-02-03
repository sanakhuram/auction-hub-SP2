import { displayListings } from './listing/display';

export function initializeCarousel() {
  console.log('✅ Initializing category carousel...');

  const carousel = document.getElementById('category-carousel');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const categories = document.querySelectorAll('.category-item');

  if (!carousel || !prevBtn || !nextBtn || categories.length === 0) {
    console.error('❌ Carousel elements not found!');
    return;
  }

  let currentIndex = 0;
  const totalItems = categories.length;
  const slideWidth = carousel.clientWidth;

  function updateCarousel() {
    console.log(`🔄 Moving to index: ${currentIndex}`);
    carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalItems - 1) {
      currentIndex++;
      updateCarousel();
    } else {
      currentIndex = 0;
      updateCarousel();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    } else {
      currentIndex = totalItems - 1;
      updateCarousel();
    }
  });

  categories.forEach((category) => {
    category.addEventListener('click', () => {
      const selectedCategory = category.querySelector('img').alt;
      console.log(`🟢 Category Selected: ${selectedCategory}`);
      displayListings(selectedCategory);
    });
  });

  updateCarousel();
}
