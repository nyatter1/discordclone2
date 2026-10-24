import React, { useState } from 'react';

interface MainScreenProps {
  username?: string;
  onLogout: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ username = '', onLogout }) => {
  const [chatInput, setChatInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const displayName = username.trim() || 'User';

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChatInput('');
  };

  return (
    <div className="discord-app-layout">
      {/* 1. Leftmost Server Sidebar */}
      <aside className="server-sidebar">
        <div className="server-item infinity-btn-wrapper">
          <button
            type="button"
            className="infinity-button active"
            title="Direct Messages"
          >
            <span className="infinity-symbol">∞</span>
          </button>
        </div>
        <div className="server-separator" />
        {/* Server list is completely empty as requested */}
        <div className="server-list-empty" />
      </aside>

      {/* 2. Channel / DM List Sidebar */}
      <aside className="channels-sidebar">
        <header className="channels-header">
          <div className="channels-search-bar" />
        </header>

        {/* Empty channels / DM list */}
        <div className="channels-content-empty" />

        {/* User Profile Bar */}
        <footer className="user-profile-bar">
          <div className="user-info">
            <div className="user-avatar-placeholder" />
            <div className="user-details">
              <span className="user-name">{displayName}</span>
              <span className="user-tag">#0001</span>
            </div>
          </div>

          <div className="user-controls">
            <button
              type="button"
              className={`control-icon-btn ${isMuted ? 'muted' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
              title="Mute"
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
              title="Deafen"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1a7 7 0 0 1 14 0v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z" />
              </svg>
            </button>

            <div className="settings-wrapper">
              <button
                type="button"
                className="control-icon-btn"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                title="Settings"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </button>

              {showSettingsMenu && (
                <div className="settings-popout">
                  <button
                    type="button"
                    className="popout-action-button"
                    onClick={onLogout}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </footer>
      </aside>

      {/* 3. Main Chat Center Area */}
      <main className="main-chat-container">
        <header className="chat-header">
          <div className="chat-header-title">
            <span className="hash-symbol">#</span>
          </div>

          <div className="chat-header-actions">
            <div className="header-action-icon" />
            <div className="header-action-icon" />
            <div className="header-action-icon" />
            <div className="header-search-bar" />
          </div>
        </header>

        {/* Empty Chat Content */}
        <section className="chat-messages-empty" />

        {/* Bottom Chat Input Form */}
        <form className="chat-input-bar-container" onSubmit={handleChatSubmit}>
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
      </main>

      {/* 4. Rightmost Member List Sidebar */}
      <aside className="members-sidebar">
        <header className="members-header" />
        {/* Completely empty member list */}
        <div className="members-content-empty" />
      </aside>
    </div>
  );
};
