export function setupDarkModeToggle() {
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeIconMobile = document.getElementById('theme-icon-mobile');

  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  const themeIconDesktop = document.getElementById('theme-icon-desktop');

  const html = document.documentElement;
  const logoLight = document.getElementById('logo-light');
  const logoDark = document.getElementById('logo-dark');
  const themeImage = document.getElementById('theme-image'); // Image that changes in dark mode

  if (
    !themeToggleMobile ||
    !themeToggleDesktop ||
    !themeIconMobile ||
    !themeIconDesktop ||
    !logoLight ||
    !logoDark ||
    !themeImage
  )
    return;

  function updateThemeElements(isDarkMode) {
    if (isDarkMode) {
      // Switch to dark mode logo
      logoLight.classList.add('hidden');
      logoDark.classList.remove('hidden');

      // Change to dark mode image
      themeImage.src = '/images/dark.jpg';
    } else {
      // Switch to light mode logo
      logoLight.classList.remove('hidden');
      logoDark.classList.add('hidden');

      // Change to light mode image
      themeImage.src = '/images/light.jpg';
    }
  }

  function enableDarkMode() {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    themeIconMobile.classList.replace('fa-moon', 'fa-sun');
    themeIconDesktop.classList.replace('fa-moon', 'fa-sun');
    updateThemeElements(true);
  }

  function enableLightMode() {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    themeIconMobile.classList.replace('fa-sun', 'fa-moon');
    themeIconDesktop.classList.replace('fa-sun', 'fa-moon');
    updateThemeElements(false);
  }

  // Detect stored or preferred theme
  const savedTheme = localStorage.getItem('theme');
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    enableDarkMode();
  } else {
    enableLightMode();
  }

  // Toggle event listener
  [themeToggleMobile, themeToggleDesktop].forEach((toggle) => {
    toggle.addEventListener('click', () => {
      if (html.classList.contains('dark')) {
        enableLightMode();
      } else {
        enableDarkMode();
      }
    });
  });

  // Auto change theme based on system settings
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (e.matches) {
        enableDarkMode();
      } else {
        enableLightMode();
      }
    });
}
