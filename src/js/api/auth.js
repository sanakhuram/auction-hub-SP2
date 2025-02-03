/**
 * Logs out the user by clearing stored session data and updating UI.
 */
export function logout() {
  console.log('Logging out...');

  // Remove user session data
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
  sessionStorage.clear();

  // Update UI before redirecting
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.getElementById('loginBtn'); // Ensure this exists in HTML

  if (logoutBtn) logoutBtn.style.display = 'none';
  if (loginBtn) loginBtn.style.display = 'block';

  alert('You have been logged out.');

  setTimeout(() => {
    window.location.href = '/auth/login/'; // Ensure this path exists
  }, 500);
}

/**
 * Retrieves the logged-in user's information from localStorage.
 * @returns {Object|null} An object containing username and token, or null if no user is logged in.
 */
export function getLoggedInUser() {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  if (username && token) {
    return { username, token };
  }
  return null;
}

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} True if the user is logged in, otherwise false.
 */
export function isUserLoggedIn() {
  return !!localStorage.getItem('token');
}

/**
 * Updates the user's information in localStorage.
 * @param {Object} updatedData - An object containing the updated user information.
 * @param {string} [updatedData.name] - The updated username.
 * @param {string} [updatedData.token] - The updated access token.
 */
export function updateUserInfo(updatedData) {
  if (updatedData.name) {
    localStorage.setItem('username', updatedData.name);
  }
  if (updatedData.token) {
    localStorage.setItem('token', updatedData.token);
  }
}
