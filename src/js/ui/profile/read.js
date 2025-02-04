//src/js/ui/profile/read.js
import { authGuard } from '../../utilities/authGuard.js';
import { fetchProfile } from '../../api/profile/read.js';
import { onUpdateProfile } from '../../api/profile/update.js';

// ✅ Protect Route
authGuard();

// ✅ Ensure the DOM is ready before running
document.addEventListener('DOMContentLoaded', async () => {
  const username = localStorage.getItem('username'); // Ensure username is stored
  if (!username) {
    alert('No username found. Redirecting to login...');
    window.location.href = '/auth/login.html';
    return;
  }

  try {
    // ✅ Fetch user profile
    const profile = await fetchProfile(username);
    if (!profile) throw new Error('Profile data is empty!');

    // ✅ Update UI with Profile Data
    document.getElementById('profileAvatar').src =
      profile.avatar?.url || 'https://via.placeholder.com/150';
    document.getElementById('profileBanner').src =
      profile.banner?.url || 'https://via.placeholder.com/800x200';
    document.getElementById('profileName').textContent =
      profile.name || 'No name';
    document.getElementById('profileEmail').textContent =
      profile.email || 'No email';
    document.getElementById('profileBio').textContent =
      profile.bio || 'No bio available';
    document.getElementById('profileCredits').textContent = `Credits: ${
      profile.credits || 0
    }`;
    document.getElementById('profileListings').textContent = `Listings: ${
      profile._count?.listings || 0
    }`;
    document.getElementById('profileWins').textContent = `Wins: ${
      profile._count?.wins || 0
    }`;

    // ✅ Pre-fill Update Form
    document.getElementById('bioInput').value = profile.bio || '';
    document.getElementById('avatarInput').value = profile.avatar?.url || '';
    document.getElementById('bannerInput').value = profile.banner?.url || '';
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    alert('Failed to load profile. Please try again.');
  }
});

// ✅ Attach Update Profile Form Handler
document
  .getElementById('updateProfileForm')
  ?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await onUpdateProfile();
  });

