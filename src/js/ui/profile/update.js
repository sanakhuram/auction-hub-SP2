//src/js/ui/profile/update.js
import { updateProfile } from '../../api/profile/update.js';

/**
 * Handles updating the profile UI when the user submits the form.
 * @param {Event} event - The form submission event.
 */
export async function onUpdateProfile(event) {
  if (event) event.preventDefault();

  const username = localStorage.getItem('username');
  if (!username) {
    alert('No username found. Redirecting to login...');
    window.location.href = '/auth/login/';
    return;
  }

  const bio = document.getElementById('bioInput')?.value.trim();
  const avatarUrl = document.getElementById('avatarInput')?.value.trim();
  const bannerUrl = document.getElementById('bannerInput')?.value.trim();

  const updateData = {};
  if (bio) updateData.bio = bio;
  if (avatarUrl) updateData.avatar = { url: avatarUrl, alt: 'User Avatar' };
  if (bannerUrl) updateData.banner = { url: bannerUrl, alt: 'User Banner' };

  if (Object.keys(updateData).length === 0) {
    alert('Please update at least one field.');
    return;
  }

  try {
    const updatedProfile = await updateProfile(username, updateData);

    // ✅ Update all UI elements
    if (updatedProfile.bio)
      document.getElementById('profileBio').textContent = updatedProfile.bio;
    if (updatedProfile.avatar?.url)
      document.getElementById('profileAvatar').src = updatedProfile.avatar.url;
    if (updatedProfile.banner?.url)
      document.getElementById('profileBanner').src = updatedProfile.banner.url;

    // ✅ Add missing profile fields
    if (updatedProfile.credits !== undefined)
      document.getElementById(
        'profileCredits'
      ).textContent = `Credits: ${updatedProfile.credits}`;
    if (updatedProfile.bids !== undefined)
      document.getElementById(
        'profileBids'
      ).textContent = `Bids: ${updatedProfile.bids.length}`;
    if (updatedProfile.wins !== undefined)
      document.getElementById(
        'profileWins'
      ).textContent = `Wins: ${updatedProfile.wins.length}`;

    console.log('✅ Profile Updated Successfully:', updatedProfile);
    document.getElementById('updateMessage').textContent =
      '✅ Profile updated successfully!';
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    alert('Failed to update profile. Please check your input values.');
  }
}
