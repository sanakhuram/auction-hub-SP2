import { fetchProfile } from "./profile/read";


/**
 * Logs out the user by clearing stored session data and updating UI.
 */
export function logout() {
  console.log('🔴 Logging out...');

  // Remove user session data
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
  sessionStorage.clear();

  // Update UI before redirecting
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.getElementById('loginBtn');
  const profileSectionDesktop = document.getElementById('user-profile-desktop');
  const profileSectionMobile = document.getElementById('user-profile-mobile');
  const avatarDesktop = document.getElementById('user-avatar-desktop');
  const avatarMobile = document.getElementById('user-avatar-mobile');
  const mobileLogin = document.getElementById('mobile-login');
  const mobileLogout = document.getElementById('mobile-logout');

  if (logoutBtn) logoutBtn.style.display = 'none';
  if (loginBtn) loginBtn.style.display = 'block';
  if (profileSectionDesktop) profileSectionDesktop.classList.add('hidden');
  if (profileSectionMobile) profileSectionMobile.classList.add('hidden');
  if (avatarDesktop) avatarDesktop.src = '/images/default-avatar.png';
  if (avatarMobile) avatarMobile.src = '/images/default-avatar.png';
  if (mobileLogout) mobileLogout.classList.add('hidden');
  if (mobileLogin) mobileLogin.classList.remove('hidden');

  alert('You have been logged out.');

  setTimeout(() => {
    window.location.href = '/auth/login/';
  }, 500);
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

/**
 * Loads user profile information and updates UI elements accordingly.
 */
export async function loadUserProfile() {
  const username = localStorage.getItem('username');
  const authToken = localStorage.getItem('token');

  console.log('🔍 Checking localStorage:', { username, authToken });

  // Get UI elements
  const loginLink = document.getElementById('loginLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const profileSectionDesktop = document.getElementById('user-profile-desktop');
  const profileSectionMobile = document.getElementById('user-profile-mobile');
  const avatarDesktop = document.getElementById('user-avatar-desktop');
  const avatarMobile = document.getElementById('user-avatar-mobile');
  const mobileLogin = document.getElementById('mobile-login');
  const mobileLogout = document.getElementById('mobile-logout');

  if (!username || !authToken) {
    console.warn('⚠️ User not logged in.');
    loginLink?.classList.remove('hidden');
    logoutBtn?.classList.add('hidden');
    profileSectionDesktop?.classList.add('hidden');
    profileSectionMobile?.classList.add('hidden');
    mobileLogout?.classList.add('hidden');
    mobileLogin?.classList.remove('hidden');
    return;
  }

  try {
    console.log(`🔍 Fetching profile for: ${username}`);
    const profileData = await fetchProfile(username);

    if (!profileData) throw new Error('❌ No profile data received.');

    console.log('✅ Profile Loaded:', profileData);

    // Show profile and logout button, hide login
    profileSectionDesktop?.classList.remove('hidden');
    profileSectionMobile?.classList.remove('hidden');
    logoutBtn?.classList.remove('hidden');
    mobileLogout?.classList.remove('hidden');
    mobileLogin?.classList.add('hidden');
    loginLink?.classList.add('hidden');

    // Update avatar images
    if (avatarDesktop)
      avatarDesktop.src =
        profileData.avatar?.url || '/images/default-avatar.png';
    if (avatarMobile)
      avatarMobile.src =
        profileData.avatar?.url || '/images/default-avatar.png';

    // Make avatars clickable to profile
    avatarDesktop?.parentElement?.setAttribute('href', '/profile/');
    avatarMobile?.parentElement?.setAttribute('href', '/profile/');
  } catch (error) {
    console.error('❌ Error loading user profile:', error);
  }
}
