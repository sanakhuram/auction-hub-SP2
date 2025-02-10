export function setupDarkModeToggle() {
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeIconMobile = document.getElementById('theme-icon-mobile');

  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  const themeIconDesktop = document.getElementById('theme-icon-desktop');

  const html = document.documentElement;
  const logoLight = document.getElementById('logo-light');
  const logoDark = document.getElementById('logo-dark');
  const themeImage = document.getElementById('theme-image'); 

  function updateThemeElements(isDarkMode) {
    if (logoLight && logoDark) {
      logoLight.classList.toggle('hidden', isDarkMode);
      logoDark.classList.toggle('hidden', !isDarkMode);
    }

    if (themeImage) {
      themeImage.src = isDarkMode ? '/images/dark.jpg' : '/images/light.jpg';
    }
  }

  function enableDarkMode() {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    if (themeIconMobile) themeIconMobile.classList.replace('fa-moon', 'fa-sun');
    if (themeIconDesktop)
      themeIconDesktop.classList.replace('fa-moon', 'fa-sun');
    updateThemeElements(true);
  }

  function enableLightMode() {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    if (themeIconMobile) themeIconMobile.classList.replace('fa-sun', 'fa-moon');
    if (themeIconDesktop)
      themeIconDesktop.classList.replace('fa-sun', 'fa-moon');
    updateThemeElements(false);
  }

  const savedTheme = localStorage.getItem('theme');
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    enableDarkMode();
  } else {
    enableLightMode();
  }

  [themeToggleMobile, themeToggleDesktop].forEach((toggle) => {
    if (toggle) {
      toggle.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
          enableLightMode();
        } else {
          enableDarkMode();
        }
      });
    }
  });

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
