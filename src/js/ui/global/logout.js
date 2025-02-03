//src/js/ui/global/logout.js

import { onLogout } from '../auth/logout.js';

export function setLogoutListener() {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', onLogout);
  }
}
