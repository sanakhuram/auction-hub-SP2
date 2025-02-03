//src/js/ui/auth/logout.js

export function onLogout() {
  console.log('Logging out...');

  localStorage.removeItem('accessToken');

  window.location.href = '/auth/login/';
}


