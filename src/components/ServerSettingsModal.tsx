import React, { useState, useRef } from 'react';
import { Server, Role, ServerEmoji, ServerSticker } from '../types';

interface ServerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  server: Server;
  onUpdateServer: (updatedServer: Server) => void;
  onDeleteServer: (serverId: string) => void;
}

type TabType = 'overview' | 'roles' | 'emoji' | 'stickers' | 'invites';

const PRESET_ROLE_COLORS = [
  '#99aab5', '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e91e63',
  '#f1c40f', '#e67e22', '#e74c3c', '#72767d', '#34495e', '#607d8b'
];

export const ServerSettingsModal: React.FC<ServerSettingsModalProps> = ({
  isOpen,
  onClose,
  server,
  onUpdateServer,
  onDeleteServer,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Overview states
  const [name, setName] = useState(server.name);
  const [iconUrl, setIconUrl] = useState(server.iconUrl);
  const [bannerUrl, setBannerUrl] = useState(server.bannerUrl || '');

  // Roles states
  const [roles, setRoles] = useState<Role[]>(server.roles || []);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    server.roles?.[0]?.id || ''
  );

  // Emojis and Stickers states
  const [emojis, setEmojis] = useState<ServerEmoji[]>(server.emojis || []);
  const [stickers, setStickers] = useState<ServerSticker[]>(server.stickers || []);

  // Invites state
  const [invites, setInvites] = useState(server.invites || []);

  // Delete modal confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Refs for uploads
  const iconInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const emojiInputRef = useRef<HTMLInputElement>(null);
  const stickerInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIconUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBannerUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawName = file.name.split('.')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
        const newEmoji: ServerEmoji = {
          id: 'emoji-' + Date.now(),
          name: rawName || 'emoji',
          url: event.target?.result as string,
        };
        const updated = [...emojis, newEmoji];
        setEmojis(updated);
        onUpdateServer({ ...server, emojis: updated });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawName = file.name.split('.')[0];
        const newSticker: ServerSticker = {
          id: 'sticker-' + Date.now(),
          name: rawName || 'Sticker',
          url: event.target?.result as string,
        };
        const updated = [...stickers, newSticker];
        setStickers(updated);
        onUpdateServer({ ...server, stickers: updated });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateRole = () => {
    const newRole: Role = {
      id: 'role-' + Date.now(),
      name: 'new role',
      color: '#99aab5',
      position: roles.length + 1,
      permissions: {
        viewChannels: true,
        sendMessages: true,
        manageChannels: false,
        manageServer: false,
        mentionEveryone: false,
      },
    };
    const updated = [...roles, newRole];
    setRoles(updated);
    setSelectedRoleId(newRole.id);
    onUpdateServer({ ...server, roles: updated });
  };

  const handleUpdateRole = (updatedRole: Role) => {
    const updated = roles.map((r) => (r.id === updatedRole.id ? updatedRole : r));
    setRoles(updated);
    onUpdateServer({ ...server, roles: updated });
  };

  const handleDeleteRole = (roleId: string) => {
    const updated = roles.filter((r) => r.id !== roleId);
    setRoles(updated);
    if (selectedRoleId === roleId && updated.length > 0) {
      setSelectedRoleId(updated[0].id);
    }
    onUpdateServer({ ...server, roles: updated });
  };

  const handleRevokeInvite = (inviteId: string) => {
    const updated = invites.filter((inv) => inv.id !== inviteId);
    setInvites(updated);
    onUpdateServer({ ...server, invites: updated });
  };

  const handleSaveOverview = () => {
    onUpdateServer({
      ...server,
      name: name.trim() || server.name,
      iconUrl,
      bannerUrl,
    });
    onClose();
  };

  return (
    <div className="settings-page-backdrop">
      <div className="settings-page-container">
        {/* Left Settings Sidebar */}
        <aside className="settings-sidebar">
          <div className="settings-nav-section">
            <span className="settings-nav-header">{server.name.toUpperCase()}</span>
            <div
              className={`settings-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </div>
            <div
              className={`settings-nav-item ${activeTab === 'roles' ? 'active' : ''}`}
              onClick={() => setActiveTab('roles')}
            >
              Roles
            </div>
            <div
              className={`settings-nav-item ${activeTab === 'emoji' ? 'active' : ''}`}
              onClick={() => setActiveTab('emoji')}
            >
              Emoji
            </div>
            <div
              className={`settings-nav-item ${activeTab === 'stickers' ? 'active' : ''}`}
              onClick={() => setActiveTab('stickers')}
            >
              Stickers
            </div>
            <div
              className={`settings-nav-item ${activeTab === 'invites' ? 'active' : ''}`}
              onClick={() => setActiveTab('invites')}
            >
              Invites
            </div>
          </div>

          <div className="settings-nav-separator" />

          <button
            type="button"
            className="settings-logout-btn"
            style={{ color: '#b9bbbe' }}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Server
          </button>
        </aside>

        {/* Right Settings Content */}
        <main className="settings-main-content">
          <div className="settings-header-row">
            <h2 className="settings-view-title">
              {activeTab === 'overview' && 'Server Overview'}
              {activeTab === 'roles' && 'Roles'}
              {activeTab === 'emoji' && 'Server Emoji'}
              {activeTab === 'stickers' && 'Server Stickers'}
              {activeTab === 'invites' && 'Invites'}
            </h2>
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

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="server-overview-container">
              <input
                type="file"
                ref={iconInputRef}
                onChange={handleIconUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <div className="overview-row">
                {/* Icon upload */}
                <div className="overview-icon-col">
                  <label className="form-label">SERVER ICON</label>
                  <div
                    className="overview-icon-preview"
                    onClick={() => iconInputRef.current?.click()}
                    title="Change Server Icon"
                  >
                    <img src={iconUrl} alt="Server icon" className="overview-icon-img" />
                    <span className="avatar-edit-overlay">Change Icon</span>
                  </div>
                </div>

                {/* Name field */}
                <div className="overview-name-col">
                  <div className="form-group">
                    <label className="form-label">SERVER NAME</label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Free Server Banner Upload */}
              <div className="form-group" style={{ marginTop: '24px' }}>
                <label className="form-label">SERVER BANNER BACKGROUND</label>
                <p className="settings-subtext">
                  This banner will be displayed at the top of your channel list in the server.
                </p>
                <div
                  className="server-banner-upload-box"
                  style={{
                    backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none',
                  }}
                  onClick={() => bannerInputRef.current?.click()}
                >
                  <span className="change-banner-badge">
                    {bannerUrl ? 'Change Banner' : 'Upload Server Banner'}
                  </span>
                </div>
                {bannerUrl && (
                  <button
                    type="button"
                    className="remove-banner-btn"
                    onClick={() => setBannerUrl('')}
                  >
                    Remove Banner
                  </button>
                )}
              </div>

              <div style={{ marginTop: '28px' }}>
                <button
                  type="button"
                  className="modal-submit-btn"
                  onClick={handleSaveOverview}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ROLES */}
          {activeTab === 'roles' && (
            <div className="roles-management-layout">
              {/* Left Column: Roles list */}
              <div className="roles-list-column">
                <div className="roles-list-header">
                  <span className="form-label">ROLES</span>
                  <button
                    type="button"
                    className="create-role-btn"
                    onClick={handleCreateRole}
                  >
                    +
                  </button>
                </div>
                <div className="roles-scroll-list">
                  {roles.map((r) => (
                    <div
                      key={r.id}
                      className={`role-list-item ${selectedRole?.id === r.id ? 'active' : ''}`}
                      onClick={() => setSelectedRoleId(r.id)}
                    >
                      <span
                        className="role-color-dot"
                        style={{ backgroundColor: r.color }}
                      />
                      <span className="role-item-name">{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Role Editor */}
              {selectedRole ? (
                <div className="role-editor-column">
                  <div className="form-group">
                    <label className="form-label">ROLE NAME</label>
                    <input
                      type="text"
                      className="form-input"
                      value={selectedRole.name}
                      onChange={(e) =>
                        handleUpdateRole({ ...selectedRole, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ROLE COLOR</label>
                    <div className="role-color-presets">
                      {PRESET_ROLE_COLORS.map((col) => (
                        <div
                          key={col}
                          className={`color-preset-swatch ${
                            selectedRole.color === col ? 'selected' : ''
                          }`}
                          style={{ backgroundColor: col }}
                          onClick={() =>
                            handleUpdateRole({ ...selectedRole, color: col })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ROLE PERMISSIONS</label>
                    <div className="permissions-list">
                      <label className="perm-toggle-row">
                        <div className="perm-info">
                          <span className="perm-name">View Channels</span>
                          <span className="perm-desc">Allows members to view channels by default.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedRole.permissions.viewChannels}
                          onChange={(e) =>
                            handleUpdateRole({
                              ...selectedRole,
                              permissions: {
                                ...selectedRole.permissions,
                                viewChannels: e.target.checked,
                              },
                            })
                          }
                        />
                      </label>

                      <label className="perm-toggle-row">
                        <div className="perm-info">
                          <span className="perm-name">Send Messages</span>
                          <span className="perm-desc">Allows members to send messages in text channels.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedRole.permissions.sendMessages}
                          onChange={(e) =>
                            handleUpdateRole({
                              ...selectedRole,
                              permissions: {
                                ...selectedRole.permissions,
                                sendMessages: e.target.checked,
                              },
                            })
                          }
                        />
                      </label>

                      <label className="perm-toggle-row">
                        <div className="perm-info">
                          <span className="perm-name">Manage Channels</span>
                          <span className="perm-desc">Allows members to create and edit channels.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedRole.permissions.manageChannels}
                          onChange={(e) =>
                            handleUpdateRole({
                              ...selectedRole,
                              permissions: {
                                ...selectedRole.permissions,
                                manageChannels: e.target.checked,
                              },
                            })
                          }
                        />
                      </label>

                      <label className="perm-toggle-row">
                        <div className="perm-info">
                          <span className="perm-name">Manage Server</span>
                          <span className="perm-desc">Allows members to change server settings.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedRole.permissions.manageServer}
                          onChange={(e) =>
                            handleUpdateRole({
                              ...selectedRole,
                              permissions: {
                                ...selectedRole.permissions,
                                manageServer: e.target.checked,
                              },
                            })
                          }
                        />
                      </label>

                      <label className="perm-toggle-row">
                        <div className="perm-info">
                          <span className="perm-name">Mention @everyone & @here</span>
                          <span className="perm-desc">Allows members to notify everyone in the server.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedRole.permissions.mentionEveryone}
                          onChange={(e) =>
                            handleUpdateRole({
                              ...selectedRole,
                              permissions: {
                                ...selectedRole.permissions,
                                mentionEveryone: e.target.checked,
                              },
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <button
                      type="button"
                      className="delete-role-btn"
                      onClick={() => handleDeleteRole(selectedRole.id)}
                    >
                      Delete Role
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: EMOJIS */}
          {activeTab === 'emoji' && (
            <div className="emojis-management-view">
              <input
                type="file"
                ref={emojiInputRef}
                onChange={handleEmojiUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="emojis-header-row">
                <p className="settings-subtext">
                  Upload custom emojis that anyone in this server can use in messages and reactions.
                </p>
                <button
                  type="button"
                  className="modal-submit-btn"
                  onClick={() => emojiInputRef.current?.click()}
                >
                  Upload Emoji
                </button>
              </div>

              <div className="custom-emojis-table">
                {emojis.length === 0 ? (
                  <p className="settings-empty-notice">No custom emojis uploaded yet.</p>
                ) : (
                  emojis.map((em) => (
                    <div key={em.id} className="emoji-manage-row">
                      <img src={em.url} alt={em.name} className="manage-emoji-preview" />
                      <input
                        type="text"
                        className="emoji-rename-input"
                        value={em.name}
                        onChange={(e) => {
                          const updated = emojis.map((item) =>
                            item.id === em.id ? { ...item, name: e.target.value } : item
                          );
                          setEmojis(updated);
                          onUpdateServer({ ...server, emojis: updated });
                        }}
                      />
                      <button
                        type="button"
                        className="delete-item-btn"
                        onClick={() => {
                          const updated = emojis.filter((item) => item.id !== em.id);
                          setEmojis(updated);
                          onUpdateServer({ ...server, emojis: updated });
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: STICKERS */}
          {activeTab === 'stickers' && (
            <div className="stickers-management-view">
              <input
                type="file"
                ref={stickerInputRef}
                onChange={handleStickerUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="emojis-header-row">
                <p className="settings-subtext">
                  Upload custom stickers that can be sent in messages.
                </p>
                <button
                  type="button"
                  className="modal-submit-btn"
                  onClick={() => stickerInputRef.current?.click()}
                >
                  Upload Sticker
                </button>
              </div>

              <div className="custom-stickers-table">
                {stickers.length === 0 ? (
                  <p className="settings-empty-notice">No custom stickers uploaded yet.</p>
                ) : (
                  stickers.map((st) => (
                    <div key={st.id} className="sticker-manage-row">
                      <img src={st.url} alt={st.name} className="manage-sticker-preview" />
                      <input
                        type="text"
                        className="emoji-rename-input"
                        value={st.name}
                        onChange={(e) => {
                          const updated = stickers.map((item) =>
                            item.id === st.id ? { ...item, name: e.target.value } : item
                          );
                          setStickers(updated);
                          onUpdateServer({ ...server, stickers: updated });
                        }}
                      />
                      <button
                        type="button"
                        className="delete-item-btn"
                        onClick={() => {
                          const updated = stickers.filter((item) => item.id !== st.id);
                          setStickers(updated);
                          onUpdateServer({ ...server, stickers: updated });
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: INVITES */}
          {activeTab === 'invites' && (
            <div className="invites-management-view">
              <p className="settings-subtext">
                Here is a list of all active instant invite links created for this server. You can revoke any invite at any time.
              </p>

              <div className="invites-list-table">
                {invites.length === 0 ? (
                  <p className="settings-empty-notice">No invites created yet.</p>
                ) : (
                  invites.map((inv) => (
                    <div key={inv.id} className="invite-manage-row">
                      <div className="invite-manage-info">
                        <span className="invite-code-label">https://discord.gg/{inv.code}</span>
                        <span className="invite-meta-text">
                          Created by {inv.creator} • Expires: {inv.expiresAt} • Uses: {inv.uses}/{inv.maxUses === 0 ? '∞' : inv.maxUses}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="delete-item-btn"
                        onClick={() => handleRevokeInvite(inv.id)}
                      >
                        Revoke
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Server Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-backdrop" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2 className="modal-title">Delete '{server.name}'</h2>
              <p className="modal-subtitle">
                Are you sure you want to delete this server? This action cannot be undone.
              </p>
            </header>
            <footer className="modal-footer">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-role-btn"
                onClick={() => {
                  onDeleteServer(server.id);
                  setShowDeleteConfirm(false);
                  onClose();
                }}
              >
                Delete Server
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
