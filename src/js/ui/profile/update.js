//src/js/ui/profile/update.js
import { updateProfile } from '../../api/profile/update.js';

/**
 * Handles updating the profile UI when the user submits the form.
 * @param {Event} event - The form submission event.
 */
export async function onUpdateProfile(event) {
  // ✅ Ensure event is passed
  if (event) {
    event.preventDefault();
  } else {
    console.error('❌ No event object received in onUpdateProfile.');
    return;
  }

  const username = localStorage.getItem('username');
  if (!username) {
    alert('No username found. Redirecting to login...');
    window.location.href = '/auth/login.html';
    return;
  }

  // ✅ Fetch input values
  const bio = document.getElementById('bioInput')?.value.trim();
  const avatarUrl = document.getElementById('avatarInput')?.value.trim();
  const bannerUrl = document.getElementById('bannerInput')?.value.trim();

  // ✅ Construct update data (Only include provided fields)
  const updateData = {};
  if (bio) updateData.bio = bio;
  if (avatarUrl) updateData.avatar = { url: avatarUrl, alt: 'User Avatar' };
  if (bannerUrl) updateData.banner = { url: bannerUrl, alt: 'User Banner' };

  if (Object.keys(updateData).length === 0) {
    alert(
      'You must provide at least one field (bio, avatar, or banner) to update.'
    );
    return;
  }

  try {
    // ✅ Send update request
    const updatedProfile = await updateProfile(username, updateData);

    // ✅ Update UI Immediately
    if (updatedProfile.bio)
      document.getElementById('profileBio').textContent = updatedProfile.bio;
    if (updatedProfile.avatar?.url)
      document.getElementById('profileAvatar').src = updatedProfile.avatar.url;
    if (updatedProfile.banner?.url)
      document.getElementById('profileBanner').src = updatedProfile.banner.url;

    // ✅ Show success message
    document.getElementById('updateMessage').textContent =
      '✅ Profile updated successfully!';
    console.log('✅ Profile Updated Successfully:', updatedProfile);
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    alert('Failed to update profile. Please check input values.');
  }
}

// ✅ Attach event listener to the update form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('updateProfileForm');
  if (form) {
    form.addEventListener('submit', onUpdateProfile);
  } else {
    console.error('❌ Could not find updateProfileForm in the DOM.');
  }
});
