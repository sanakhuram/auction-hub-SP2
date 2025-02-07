import { fetchProfile } from './profile/read';

/**
 * Logs out the user by clearing session data and updating UI.
 */
export function logout() {
  // Remove user session data
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
  sessionStorage.clear();

  // Update UI elements
  document.getElementById('logoutBtn')?.classList.add('hidden');
  document.getElementById('loginBtn')?.classList.remove('hidden');
  document.getElementById('user-profile-desktop')?.classList.add('hidden');
  document.getElementById('user-profile-mobile')?.classList.add('hidden');
  document
    .getElementById('user-avatar-desktop')
    ?.setAttribute('src', '/images/default-avatar.png');
  document
    .getElementById('user-avatar-mobile')
    ?.setAttribute('src', '/images/default-avatar.png');
  document.getElementById('mobile-logout')?.classList.add('hidden');
  document.getElementById('mobile-login')?.classList.remove('hidden');

  alert('You have been logged out.');
  setTimeout(() => (window.location.href = '/auth/login/'), 500);
}

/**
 * Retrieves the logged-in user's information from localStorage.
 * @returns {Object|null} An object containing username and token, or null if no user is logged in.
 */
export function getLoggedInUser() {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  return username && token ? { username, token } : null;
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
 */
export function updateUserInfo(updatedData) {
  if (updatedData.name) localStorage.setItem('username', updatedData.name);
  if (updatedData.token) localStorage.setItem('token', updatedData.token);
}

/**
 * Loads user profile information and updates UI elements accordingly.
 */
export async function loadUserProfile() {
  const username = localStorage.getItem('username');
  const authToken = localStorage.getItem('token');

  if (!username || !authToken) {
    document.getElementById('loginLink')?.classList.remove('hidden');
    document.getElementById('logoutBtn')?.classList.add('hidden');
    document.getElementById('user-profile-desktop')?.classList.add('hidden');
    document.getElementById('user-profile-mobile')?.classList.add('hidden');
    document.getElementById('mobile-logout')?.classList.add('hidden');
    document.getElementById('mobile-login')?.classList.remove('hidden');
    return;
  }

  try {
    const profileData = await fetchProfile(username);
    if (!profileData) throw new Error('No profile data received.');

    // Show profile and logout button, hide login
    document.getElementById('user-profile-desktop')?.classList.remove('hidden');
    document.getElementById('user-profile-mobile')?.classList.remove('hidden');
    document.getElementById('logoutBtn')?.classList.remove('hidden');
    document.getElementById('mobile-logout')?.classList.remove('hidden');
    document.getElementById('mobile-login')?.classList.add('hidden');
    document.getElementById('loginLink')?.classList.add('hidden');

    // Update avatar images
    const avatarUrl = profileData.avatar?.url || '/images/default-avatar.png';
    document
      .getElementById('user-avatar-desktop')
      ?.setAttribute('src', avatarUrl);
    document
      .getElementById('user-avatar-mobile')
      ?.setAttribute('src', avatarUrl);

    // Make avatars clickable to profile
    document
      .getElementById('user-avatar-desktop')
      ?.parentElement?.setAttribute('href', '/profile/');
    document
      .getElementById('user-avatar-mobile')
      ?.parentElement?.setAttribute('href', '/profile/');
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}
