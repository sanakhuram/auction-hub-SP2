import { authGuard } from '../../utilities/authGuard';
import { fetchProfile } from '../../api/profile/read';
import { onUpdateProfile } from '../../ui/profile/update.js';

// ✅ Protect Route
authGuard();

// ✅ Ensure the DOM is ready before running
document.addEventListener('DOMContentLoaded', async () => {
  const username = localStorage.getItem('username');
  if (!username) {
    alert('No username found. Redirecting to login...');
    window.location.href = '/auth/login.html';
    return;
  }

  try {
    // ✅ Fetch user profile
    const profileData = await fetchProfile(username);
    if (!profileData) throw new Error('Profile data is empty!');

    // ✅ Select elements (check if they exist before modifying)
    const nameEl = document.getElementById('profileName');
    const emailEl = document.getElementById('profileEmail');
    const bioEl = document.getElementById('profileBio');
    const avatarEl = document.getElementById('profileAvatar');
    const bannerEl = document.getElementById('profileBanner');
    const creditsEl = document.getElementById('profileCredits');
    const listingsEl = document.getElementById('profileListings');
    const winsEl = document.getElementById('profileWins');

    // ✅ Update Profile UI
    if (nameEl) nameEl.textContent = profileData.name || 'No Name';
    if (emailEl) emailEl.textContent = profileData.email || 'No Email Provided';
    if (bioEl) bioEl.textContent = profileData.bio || 'No Bio Available';
    if (avatarEl)
      avatarEl.src = profileData.avatar?.url || '/images/default-avatar.png';
    if (bannerEl)
      bannerEl.src = profileData.banner?.url || '/images/default-banner.jpg';
    if (creditsEl)
      creditsEl.textContent = `Credits: ${profileData.credits || 0}`;
    if (listingsEl)
      listingsEl.textContent = `Listings: ${profileData._count?.listings || 0}`;
    if (winsEl) winsEl.textContent = `Wins: ${profileData._count?.wins || 0}`;

    // ✅ Pre-fill Update Form
    document.getElementById('bioInput').value = profileData.bio || '';
    document.getElementById('avatarInput').value =
      profileData.avatar?.url || '';
    document.getElementById('bannerInput').value =
      profileData.banner?.url || '';

    console.log('✅ Profile Data Loaded Successfully:', profileData);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    alert('Failed to load profile. Please try again.');
  }
});

// ✅ Attach Update Profile Form Handler
document
  .getElementById('updateProfileForm')
  ?.addEventListener('submit', onUpdateProfile);
