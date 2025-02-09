document.addEventListener('DOMContentLoaded', function () {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('text-secondary', 'font-bold'); 
      link.querySelector('i')?.classList.add('text-secondary'); 
    } else {
      link.classList.remove('text-secondary', 'font-bold');
      link.querySelector('i')?.classList.remove('text-secondary');
    }
  });
});
