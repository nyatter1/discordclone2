import React, { useState } from 'react';
import { UserProfile, Server, ChatMessage, ChannelType, VoiceConnectionState } from '../types';
import { ProfileSettings } from './ProfileSettings';
import { CreateServerModal } from './CreateServerModal';
import { CreateChannelModal } from './CreateChannelModal';
import { UserProfileModal } from './UserProfileModal';
import { VoiceChannelView } from './VoiceChannelView';

interface MainScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onLogout,
}) => {
  // Navigation State
  const [activeView, setActiveView] = useState<'dm' | string>('dm');
  const [activeChannelId, setActiveChannelId] = useState<string>('');

  // Voice Connection State
  const [voiceConnection, setVoiceConnection] = useState<VoiceConnectionState | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<UserProfile | null>(null);

  // User Hardware Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Chat Input State
  const [chatInput, setChatInput] = useState('');

  // Self DM Messages
  const [selfDmMessages, setSelfDmMessages] = useState<ChatMessage[]>([]);

  // Self DM Note state
  const [selfDmNote, setSelfDmNote] = useState('');

  // Servers List (initially completely empty)
  const [servers, setServers] = useState<Server[]>([]);

  // Active Server & Channel Calculation
  const activeServer = servers.find((s) => s.id === activeView);
  const activeChannel = activeServer?.channels.find(
    (c) => c.id === activeChannelId
  );

  const handleCreateServer = (name: string, iconUrl: string) => {
    const defaultChannelId = 'general-' + Date.now();
    const newServer: Server = {
      id: 'server-' + Date.now(),
      name,
      iconUrl,
      channels: [
        {
          id: defaultChannelId,
          name: 'general',
          type: 'text',
          messages: [],
        },
      ],
    };
    setServers((prev) => [...prev, newServer]);
    setActiveView(newServer.id);
    setActiveChannelId(defaultChannelId);
  };

  const handleCreateChannel = (channelName: string, channelType: ChannelType) => {
    if (!activeServer) return;
    const newChannel = {
      id: 'channel-' + Date.now(),
      name: channelName,
      type: channelType,
      messages: [],
    };

    setServers((prev) =>
      prev.map((s) => {
        if (s.id === activeServer.id) {
          return {
            ...s,
            channels: [...s.channels, newChannel],
          };
        }
        return s;
      })
    );
    setActiveChannelId(newChannel.id);

    // If it's a voice channel, connect immediately
    if (channelType === 'voice') {
      setVoiceConnection({
        serverId: activeServer.id,
        serverName: activeServer.name,
        channelId: newChannel.id,
        channelName: newChannel.name,
      });
    }
  };

  const handleChannelClick = (channelId: string, type: ChannelType, name: string) => {
    setActiveChannelId(channelId);
    if (type === 'voice' && activeServer) {
      setVoiceConnection({
        serverId: activeServer.id,
        serverName: activeServer.name,
        channelId,
        channelName: name,
      });
    }
  };

  const handleDisconnectVoice = () => {
    setVoiceConnection(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const newMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: userProfile.displayName || userProfile.username || 'User',
      senderAvatar: userProfile.avatarUrl,
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    if (activeView === 'dm') {
      setSelfDmMessages((prev) => [...prev, newMessage]);
    } else if (activeServer && activeChannel && activeChannel.type === 'text') {
      setServers((prev) =>
        prev.map((s) => {
          if (s.id === activeServer.id) {
            return {
              ...s,
              channels: s.channels.map((c) => {
                if (c.id === activeChannel.id) {
                  return {
                    ...c,
                    messages: [...c.messages, newMessage],
                  };
                }
                return c;
              }),
            };
          }
          return s;
        })
      );
    }

    setChatInput('');
  };

  const currentMessages =
    activeView === 'dm'
      ? selfDmMessages
      : activeChannel && activeChannel.type === 'text'
      ? activeChannel.messages
      : [];

  const textChannels = activeServer?.channels.filter((c) => c.type === 'text') || [];
  const voiceChannels = activeServer?.channels.filter((c) => c.type === 'voice') || [];

  return (
    <div className="discord-app-layout">
      {/* 1. Far Left Server Sidebar (72px) */}
      <aside className="server-sidebar">
        {/* White Infinity Symbol Button at top for DMs */}
        <div className="infinity-btn-wrapper">
          <button
            type="button"
            className={`infinity-button ${activeView === 'dm' ? 'active' : ''}`}
            onClick={() => setActiveView('dm')}
            title="Direct Messages"
          >
            <span className="infinity-symbol">∞</span>
          </button>
        </div>

        <div className="server-separator" />

        {/* Server List */}
        <div className="server-list-container">
          {servers.map((server) => (
            <div key={server.id} className="server-icon-wrapper">
              <button
                type="button"
                className={`server-icon-button ${
                  activeView === server.id ? 'active' : ''
                }`}
                onClick={() => {
                  setActiveView(server.id);
                  if (server.channels.length > 0) {
                    setActiveChannelId(server.channels[0].id);
                  }
                }}
                title={server.name}
              >
                <img
                  src={server.iconUrl}
                  alt={server.name}
                  className="server-avatar-img"
                />
              </button>
            </div>
          ))}

          {/* Create Server (+) Button */}
          <div className="server-icon-wrapper">
            <button
              type="button"
              className="create-server-trigger-btn"
              onClick={() => setIsCreateServerOpen(true)}
              title="Add a Server"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Channel / DM List Sidebar (240px) */}
      <aside className="channels-sidebar">
        {activeView === 'dm' ? (
          <>
            <header className="channels-header">
              <span className="dm-header-title">Direct Messages</span>
            </header>

            {/* Self DM Item */}
            <div className="channels-content-container">
              <div className="channel-category-label">DIRECT MESSAGES</div>
              <div
                className="self-dm-item active"
                title="Your Personal Notes Space"
              >
                <div className="self-dm-avatar">
                  {userProfile.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt="Avatar"
                      className="self-dm-avatar-img"
                    />
                  ) : (
                    <div className="avatar-placeholder-circle-sm" />
                  )}
                </div>
                <div className="self-dm-info">
                  <span className="self-dm-name">
                    {userProfile.displayName || userProfile.username || 'User'}
                  </span>
                  <span className="self-dm-badge">(you)</span>
                </div>
              </div>
            </div>
          </>
        ) : activeServer ? (
          <>
            <header className="channels-header server-channels-header">
              <span className="server-title-text">{activeServer.name}</span>
            </header>

            <div className="channels-content-container">
              {/* Text Channels Category */}
              <div className="channel-category-row">
                <span className="channel-category-label">TEXT CHANNELS</span>
                <button
                  type="button"
                  className="add-channel-btn"
                  onClick={() => setIsCreateChannelOpen(true)}
                  title="Create Channel"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
              </div>

              {textChannels.map((ch) => (
                <div
                  key={ch.id}
                  className={`channel-item-row ${
                    activeChannelId === ch.id ? 'active' : ''
                  }`}
                  onClick={() => handleChannelClick(ch.id, 'text', ch.name)}
                >
                  <span className="channel-hash">#</span>
                  <span className="channel-name-label">{ch.name}</span>
                </div>
              ))}

              {/* Voice Channels Category */}
              <div className="channel-category-row" style={{ marginTop: '16px' }}>
                <span className="channel-category-label">VOICE CHANNELS</span>
                <button
                  type="button"
                  className="add-channel-btn"
                  onClick={() => setIsCreateChannelOpen(true)}
                  title="Create Channel"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
              </div>

              {voiceChannels.map((ch) => (
                <div
                  key={ch.id}
                  className={`channel-item-row voice ${
                    activeChannelId === ch.id ? 'active' : ''
                  }`}
                  onClick={() => handleChannelClick(ch.id, 'voice', ch.name)}
                >
                  <span className="channel-voice-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                  </span>
                  <span className="channel-name-label">{ch.name}</span>
                  {voiceConnection?.channelId === ch.id && (
                    <span className="voice-connected-dot" />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Voice Connected Status Bar (if connected to voice) */}
        {voiceConnection && (
          <div className="voice-connection-panel">
            <div className="voice-status-info">
              <div className="voice-connection-indicator">
                <span className="voice-status-dot" />
                <span className="voice-status-text">Voice Connected</span>
              </div>
              <div className="voice-connection-subtext">
                {voiceConnection.channelName} / {voiceConnection.serverName}
              </div>
            </div>
            <div className="voice-panel-controls">
              <button
                type="button"
                className="voice-disconnect-btn"
                onClick={handleDisconnectVoice}
                title="Disconnect"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.996.996 0 0 1 0-1.41C2.96 8.91 7.23 7 12 7c4.77 0 9.04 1.91 11.71 4.67.39.39.39 1.02 0 1.41l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* User Profile Footer */}
        <footer className="user-profile-bar">
          <div
            className="user-info clickable"
            onClick={() => setSelectedUserForProfile(userProfile)}
            title="View Profile Card"
          >
            <div className="user-avatar-placeholder">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt="Profile"
                  className="user-bar-avatar-img"
                />
              ) : null}
            </div>
            <div className="user-details">
              <span className="user-name">
                {userProfile.displayName || userProfile.username || 'User'}
              </span>
              <span className="user-tag">@{userProfile.username || 'user'}</span>
            </div>
          </div>

          <div className="user-controls">
            <button
              type="button"
              className={`control-icon-btn ${isMuted ? 'muted' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>

            <button
              type="button"
              className={`control-icon-btn ${isDeafened ? 'deafened' : ''}`}
              onClick={() => setIsDeafened(!isDeafened)}
              title={isDeafened ? 'Undeafen' : 'Deafen'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1a7 7 0 0 1 14 0v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z" />
              </svg>
            </button>

            <button
              type="button"
              className="control-icon-btn"
              onClick={() => setIsSettingsOpen(true)}
              title="User Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </button>
          </div>
        </footer>
      </aside>

      {/* 3. Main Center Stage Area */}
      <main className="main-chat-container">
        <header className="chat-header">
          <div className="chat-header-title">
            <span className="hash-symbol">
              {activeView === 'dm'
                ? '@'
                : activeChannel?.type === 'voice'
                ? '🔊'
                : '#'}
            </span>
            <span className="channel-title-text">
              {activeView === 'dm'
                ? userProfile.displayName || userProfile.username || 'User'
                : activeChannel?.name || 'select-channel'}
            </span>
          </div>

          <div className="chat-header-actions">
            <div className="header-action-icon" />
            <div className="header-action-icon" />
            <div className="header-action-icon" />
            <div className="header-search-bar" />
          </div>
        </header>

        {/* If Active Channel is Voice, Render the 4K Screen Share & Voice Stage */}
        {activeChannel && activeChannel.type === 'voice' && voiceConnection ? (
          <VoiceChannelView
            connection={voiceConnection}
            userProfile={userProfile}
            isMuted={isMuted}
            isDeafened={isDeafened}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleDeafen={() => setIsDeafened(!isDeafened)}
            onDisconnect={handleDisconnectVoice}
          />
        ) : (
          <>
            {/* Chat Messages Section */}
            <section className="chat-messages-container">
              {activeView === 'dm' && currentMessages.length === 0 ? (
                <div className="self-dm-intro-card">
                  <div className="self-dm-big-avatar">
                    {userProfile.avatarUrl ? (
                      <img
                        src={userProfile.avatarUrl}
                        alt="Self Avatar"
                        className="self-dm-big-img"
                      />
                    ) : (
                      <div className="avatar-placeholder-circle-lg" />
                    )}
                  </div>
                  <h2 className="self-dm-welcome-title">
                    {userProfile.displayName || userProfile.username || 'User'}
                  </h2>
                  <div className="self-dm-welcome-handle">
                    @{userProfile.username || 'user'}
                  </div>
                  <p className="self-dm-welcome-desc">
                    This is your personal space. You can write notes, save links, or
                    message yourself anytime.
                  </p>
                </div>
              ) : activeView !== 'dm' && currentMessages.length === 0 ? (
                <div className="channel-intro-card">
                  <div className="channel-intro-hash">#</div>
                  <h2 className="channel-welcome-title">
                    Welcome to #{activeChannel?.name || 'channel'}!
                  </h2>
                  <p className="channel-welcome-desc">
                    This is the start of the #{activeChannel?.name || 'channel'}{' '}
                    channel.
                  </p>
                </div>
              ) : (
                <div className="messages-list">
                  {currentMessages.map((msg) => (
                    <div key={msg.id} className="message-row">
                      <div
                        className="message-avatar clickable"
                        onClick={() => setSelectedUserForProfile(userProfile)}
                      >
                        {msg.senderAvatar ? (
                          <img
                            src={msg.senderAvatar}
                            alt={msg.sender}
                            className="message-avatar-img"
                          />
                        ) : (
                          <div className="avatar-placeholder-circle-sm" />
                        )}
                      </div>
                      <div className="message-body">
                        <div className="message-header-line">
                          <span
                            className="message-author clickable"
                            onClick={() => setSelectedUserForProfile(userProfile)}
                          >
                            {msg.sender}
                          </span>
                          <span className="message-timestamp">{msg.timestamp}</span>
                        </div>
                        <div className="message-content-text">{msg.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Bottom Chat Input Bar */}
            <form className="chat-input-bar-container" onSubmit={handleSendMessage}>
              <div className="chat-input-wrapper">
                <button type="button" className="chat-attach-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
                <input
                  type="text"
                  className="chat-text-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
              </div>
            </form>
          </>
        )}
      </main>

      {/* 4. Rightmost Sidebar: Full User Profile Panel in DMs, or Server Members */}
      <aside className="members-sidebar">
        {activeView === 'dm' ? (
          /* Classic Discord DM Profile Panel */
          <div className="dm-profile-side-panel">
            <div
              className="dm-side-banner"
              style={{
                backgroundImage: userProfile.bannerUrl
                  ? `url(${userProfile.bannerUrl})`
                  : 'none',
              }}
            />
            <div className="dm-side-avatar-box">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.displayName}
                  className="dm-side-avatar-img"
                />
              ) : (
                <div className="avatar-placeholder-circle-lg" />
              )}
              <div className="popover-status-indicator online" />
            </div>

            <div className="dm-side-content">
              <h3 className="dm-side-display-name">
                {userProfile.displayName || userProfile.username || 'User'}
              </h3>
              <div className="dm-side-handle">@{userProfile.username || 'user'}</div>
              {userProfile.pronouns && (
                <div className="dm-side-pronouns">{userProfile.pronouns}</div>
              )}

              <div className="popover-divider" />

              <div className="dm-side-section">
                <h4 className="popover-section-label">ABOUT ME</h4>
                <div className="dm-side-bio-text">
                  {userProfile.bio || 'No bio written yet.'}
                </div>
              </div>

              <div className="dm-side-section" style={{ marginTop: '14px' }}>
                <h4 className="popover-section-label">NOTE</h4>
                <textarea
                  className="popover-note-input"
                  rows={3}
                  value={selfDmNote}
                  onChange={(e) => setSelfDmNote(e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Server Members List */
          <>
            <header className="members-header">
              <span className="members-header-label">ONLINE — 1</span>
            </header>
            <div className="members-content-container">
              <div
                className="member-list-item clickable"
                onClick={() => setSelectedUserForProfile(userProfile)}
                title="View Profile Card"
              >
                <div className="member-avatar-box">
                  {userProfile.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt="Member"
                      className="member-avatar-img"
                    />
                  ) : (
                    <div className="avatar-placeholder-circle-sm" />
                  )}
                  <div className="member-status-dot online" />
                </div>
                <div className="member-name-box">
                  <span className="member-name">
                    {userProfile.displayName || userProfile.username || 'User'}
                  </span>
                  <span className="member-subtext">
                    @{userProfile.username || 'user'}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Profile Settings Full Modal */}
      <ProfileSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={userProfile}
        onSaveProfile={(updated) => {
          onUpdateProfile(updated);
        }}
        onLogout={onLogout}
      />

      {/* Create Server Modal */}
      <CreateServerModal
        isOpen={isCreateServerOpen}
        onClose={() => setIsCreateServerOpen(false)}
        onCreateServer={handleCreateServer}
      />

      {/* Create Channel Modal (Text or Voice) */}
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        onCreateChannel={handleCreateChannel}
      />

      {/* User Profile Card Popover */}
      <UserProfileModal
        isOpen={!!selectedUserForProfile}
        onClose={() => setSelectedUserForProfile(null)}
        profile={selectedUserForProfile || userProfile}
      />
    </div>
  );
};
