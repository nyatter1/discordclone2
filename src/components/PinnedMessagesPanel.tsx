import React from 'react';
import { ChatMessage } from '../types';

interface PinnedMessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedMessages: ChatMessage[];
  onUnpinMessage: (msgId: string) => void;
  onJumpToMessage: (msgId: string) => void;
}

export const PinnedMessagesPanel: React.FC<PinnedMessagesPanelProps> = ({
  isOpen,
  onClose,
  pinnedMessages,
  onUnpinMessage,
  onJumpToMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="pinned-panel-dropdown">
      <header className="pinned-panel-header">
        <div className="pinned-header-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
          <span>Pinned Messages</span>
        </div>
        <button type="button" className="pinned-close-btn" onClick={onClose} title="Close">
          ✕
        </button>
      </header>

      <div className="pinned-messages-list">
        {pinnedMessages.length === 0 ? (
          <div className="pinned-empty-state">
            <p className="pinned-empty-text">No pinned messages in this channel yet.</p>
          </div>
        ) : (
          pinnedMessages.map((msg) => (
            <div key={msg.id} className="pinned-message-card">
              <div className="pinned-card-header">
                <div className="pinned-author-row">
                  <span className="pinned-author-name">{msg.sender}</span>
                  <span className="pinned-timestamp">{msg.timestamp}</span>
                </div>
                <div className="pinned-actions">
                  <button
                    type="button"
                    className="pinned-jump-btn"
                    onClick={() => {
                      onJumpToMessage(msg.id);
                      onClose();
                    }}
                  >
                    Jump
                  </button>
                  <button
                    type="button"
                    className="pinned-unpin-btn"
                    onClick={() => onUnpinMessage(msg.id)}
                    title="Unpin"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="pinned-message-body">{msg.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
