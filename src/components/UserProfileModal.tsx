import React, { useState } from 'react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveNote?: (note: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveNote,
}) => {
  const [note, setNote] = useState(profile.customNote || '');

  if (!isOpen) return null;

  const handleNoteBlur = () => {
    if (onSaveNote) {
      onSaveNote(note);
    }
  };

  return (
    <div className="profile-popover-backdrop" onClick={onClose}>
      <div
        className="profile-popover-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div
          className="popover-banner"
          style={{
            backgroundImage: profile.bannerUrl
              ? `url(${profile.bannerUrl})`
              : 'none',
          }}
        />

        {/* Avatar overlapping banner */}
        <div className="popover-avatar-wrapper">
          <div className="popover-avatar">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="popover-avatar-img"
              />
            ) : (
              <div className="avatar-placeholder-circle-lg" />
            )}
            <div className="popover-status-indicator online" />
          </div>
        </div>

        {/* Profile Card Content */}
        <div className="popover-content">
          <div className="popover-names-row">
            <h3 className="popover-display-name">
              {profile.displayName || profile.username || 'User'}
            </h3>
            <span className="popover-username">
              @{profile.username || 'user'}
            </span>
            {profile.pronouns && (
              <span className="popover-pronouns">{profile.pronouns}</span>
            )}
          </div>

          <div className="popover-divider" />

          {/* About Me */}
          <div className="popover-section">
            <h4 className="popover-section-label">ABOUT ME</h4>
            <div className="popover-bio-text">
              {profile.bio || 'No bio provided.'}
            </div>
          </div>

          {/* Note section */}
          <div className="popover-section" style={{ marginTop: '12px' }}>
            <h4 className="popover-section-label">NOTE</h4>
            <textarea
              className="popover-note-input"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={handleNoteBlur}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
