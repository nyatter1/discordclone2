import React, { useState } from 'react';
import { UserProfile, Role } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  availableRoles?: Role[];
  onToggleRole?: (roleId: string) => void;
  onSaveNote?: (note: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  availableRoles = [],
  onToggleRole,
  onSaveNote,
}) => {
  const [note, setNote] = useState(profile.customNote || '');

  if (!isOpen) return null;

  const handleNoteBlur = () => {
    if (onSaveNote) {
      onSaveNote(note);
    }
  };

  const assignedRoleIds = profile.roles || [];
  const assignedRoles = availableRoles.filter((r) => assignedRoleIds.includes(r.id));
  const unassignedRoles = availableRoles.filter((r) => !assignedRoleIds.includes(r.id));

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
            <div className={`popover-status-indicator status-dot-${profile.status || 'online'}`} />
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
            {profile.customStatusText && (
              <div className="popover-custom-status">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                {profile.customStatusText}
              </div>
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

          {/* Roles Section */}
          {availableRoles.length > 0 && (
            <div className="popover-section" style={{ marginTop: '12px' }}>
              <h4 className="popover-section-label">ROLES</h4>
              <div className="popover-roles-list">
                {assignedRoles.map((r) => (
                  <span
                    key={r.id}
                    className="popover-role-badge"
                    style={{ borderColor: r.color }}
                  >
                    <span className="role-color-dot" style={{ backgroundColor: r.color }} />
                    <span className="role-badge-name">{r.name}</span>
                    {onToggleRole && (
                      <button
                        type="button"
                        className="role-remove-btn"
                        onClick={() => onToggleRole(r.id)}
                      >
                        ✕
                      </button>
                    )}
                  </span>
                ))}

                {/* Add role button / dropdown */}
                {onToggleRole && unassignedRoles.length > 0 && (
                  <div className="add-role-selector">
                    <select
                      className="add-role-select"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          onToggleRole(e.target.value);
                        }
                      }}
                    >
                      <option value="" disabled>+ Add Role</option>
                      {unassignedRoles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

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
