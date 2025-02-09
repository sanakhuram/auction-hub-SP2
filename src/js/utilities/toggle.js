export function setupDarkModeToggle() {
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeIconMobile = document.getElementById('theme-icon-mobile');

  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  const themeIconDesktop = document.getElementById('theme-icon-desktop');

  const html = document.documentElement;
  const logoLight = document.getElementById('logo-light');
  const logoDark = document.getElementById('logo-dark');

  if (
    !themeToggleMobile ||
    !themeToggleDesktop ||
    !themeIconMobile ||
    !themeIconDesktop
  )
    return;

  function updateLogo(isDarkMode) {
    if (isDarkMode) {
      logoLight.classList.add('hidden');
      logoDark.classList.remove('hidden');
    } else {
      logoLight.classList.remove('hidden');
      logoDark.classList.add('hidden');
    }
  }

  function enableDarkMode() {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    themeIconMobile.classList.replace('fa-moon', 'fa-sun');
    themeIconDesktop.classList.replace('fa-moon', 'fa-sun');
    updateLogo(true);
  }

  function enableLightMode() {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    themeIconMobile.classList.replace('fa-sun', 'fa-moon');
    themeIconDesktop.classList.replace('fa-sun', 'fa-moon');
    updateLogo(false);
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
    toggle.addEventListener('click', () => {
      if (html.classList.contains('dark')) {
        enableLightMode();
      } else {
        enableDarkMode();
      }
    });
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
