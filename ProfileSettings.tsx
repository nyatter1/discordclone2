import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onLogout,
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [pronouns, setPronouns] = useState(profile.pronouns);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [bannerUrl, setBannerUrl] = useState(profile.bannerUrl);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayName(profile.displayName);
    setUsername(profile.username);
    setPronouns(profile.pronouns);
    setBio(profile.bio);
    setAvatarUrl(profile.avatarUrl);
    setBannerUrl(profile.bannerUrl);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const hasChanges =
    displayName !== profile.displayName ||
    username !== profile.username ||
    pronouns !== profile.pronouns ||
    bio !== profile.bio ||
    avatarUrl !== profile.avatarUrl ||
    bannerUrl !== profile.bannerUrl;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBannerUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSaveProfile({
      ...profile,
      displayName: displayName.trim() || 'User',
      username: username.trim() || 'user',
      pronouns,
      bio,
      avatarUrl,
      bannerUrl,
    });
  };

  const handleReset = () => {
    setDisplayName(profile.displayName);
    setUsername(profile.username);
    setPronouns(profile.pronouns);
    setBio(profile.bio);
    setAvatarUrl(profile.avatarUrl);
    setBannerUrl(profile.bannerUrl);
  };

  return (
    <div className="settings-page-backdrop">
      <div className="settings-page-container">
        {/* Left Settings Sidebar */}
        <aside className="settings-sidebar">
          <div className="settings-nav-section">
            <span className="settings-nav-header">USER SETTINGS</span>
            <div className="settings-nav-item active">User Profile</div>
          </div>
          <div className="settings-nav-separator" />
          <button
            type="button"
            className="settings-logout-btn"
            onClick={onLogout}
          >
            Log Out
          </button>
        </aside>

        {/* Right Settings Content */}
        <main className="settings-main-content">
          <div className="settings-header-row">
            <h2 className="settings-view-title">User Profile</h2>
            <button
              type="button"
              className="settings-close-btn"
              onClick={onClose}
              title="Close Settings (ESC)"
            >
              <span className="close-btn-circle">✕</span>
              <span className="close-esc-label">ESC</span>
            </button>
          </div>

          <div className="profile-settings-body">
            {/* Left Column: Form Fields */}
            <div className="profile-form-column">
              <div className="form-group">
                <label className="form-label">DISPLAY NAME</label>
                <input
                  type="text"
                  className="form-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">USERNAME (HANDLE)</label>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">PRONOUNS</label>
                <input
                  type="text"
                  className="form-input"
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ABOUT ME (BIO)</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column: Profile Banner & Avatar Preview / Upload */}
            <div className="profile-preview-column">
              <label className="form-label">PREVIEW & ASSETS</label>

              {/* Hidden file inputs */}
              <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <div className="profile-card-preview">
                {/* Banner */}
                <div
                  className="profile-banner-preview"
                  style={{
                    backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none',
                  }}
                  onClick={() => bannerInputRef.current?.click()}
                  title="Click to change profile banner"
                >
                  <span className="change-banner-badge">Change Banner</span>
                </div>

                {/* Avatar */}
                <div className="profile-avatar-row">
                  <div
                    className="profile-avatar-preview"
                    onClick={() => avatarInputRef.current?.click()}
                    title="Click to change profile picture"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile avatar"
                        className="avatar-img"
                      />
                    ) : (
                      <div className="avatar-placeholder-circle" />
                    )}
                    <span className="avatar-edit-overlay">Change</span>
                  </div>
                </div>

                {/* Card Info Details */}
                <div className="profile-card-body">
                  <div className="card-display-name">{displayName || 'User'}</div>
                  <div className="card-handle">@{username || 'user'}</div>
                  {pronouns && <div className="card-pronouns">{pronouns}</div>}
                  <div className="card-divider" />
                  <div className="card-bio-label">ABOUT ME</div>
                  <div className="card-bio-text">
                    {bio || 'No bio written yet.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Unsaved Changes Floating Bar */}
          {hasChanges && (
            <div className="unsaved-changes-bar">
              <span className="unsaved-text">
                Careful — you have unsaved changes!
              </span>
              <div className="unsaved-actions">
                <button
                  type="button"
                  className="unsaved-reset-btn"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="unsaved-save-btn"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
