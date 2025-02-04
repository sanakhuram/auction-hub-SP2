import { displayListings } from './listing/display';

export function initializeCarousel() {
  console.log('✅ Initializing category carousel...');

  const carousel = document.getElementById('category-carousel');
  const dots = document.querySelectorAll('.dot');
  const categories = document.querySelectorAll('.category-item');

  if (!carousel || categories.length === 0) {
    console.error('❌ Carousel elements not found!');
    return;
  }

  let currentIndex = 0;
  const totalItems = categories.length;

  function updateCarousel() {
    console.log(`🔄 Moving to index: ${currentIndex}`);
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-gray-700', i === currentIndex);
      dot.classList.toggle('bg-white', i !== currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  }

  // Auto-scroll every 4 seconds
  let autoScroll = setInterval(nextSlide, 4000);

  // Click event for dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(autoScroll); // Stop auto-scroll on manual navigation
      currentIndex = i;
      updateCarousel();
      autoScroll = setInterval(nextSlide, 4000); // Restart auto-scroll
    });
  });

  categories.forEach((category) => {
    category.addEventListener('click', () => {
      const selectedCategory = category.querySelector('img').alt;
      console.log(`🟢 Category Selected: ${selectedCategory}`);
      displayListings(selectedCategory);
    });
  });

  updateCarousel(); // Initial update
}
