import React, { useState } from 'react';
import { ChannelType } from '../types';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (name: string, type: ChannelType) => void;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onCreateChannel,
}) => {
  const [channelType, setChannelType] = useState<ChannelType>('text');
  const [channelName, setChannelName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = channelName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!formatted) return;
    onCreateChannel(formatted, channelType);
    setChannelName('');
    setChannelType('text');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <header className="modal-header">
          <h2 className="modal-title">Create Channel</h2>
          <p className="modal-subtitle">
            in {channelType === 'text' ? 'Text Channels' : 'Voice Channels'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">CHANNEL TYPE</label>
            <div className="channel-types-list">
              {/* Text Option */}
              <div
                className={`channel-type-option ${
                  channelType === 'text' ? 'selected' : ''
                }`}
                onClick={() => setChannelType('text')}
              >
                <span className="channel-type-hash">#</span>
                <div className="channel-type-info">
                  <span className="channel-type-title">Text</span>
                  <span className="channel-type-desc">
                    Post messages, notes, and links
                  </span>
                </div>
                <div className="channel-type-radio">
                  <div
                    className={`radio-inner ${
                      channelType === 'text' ? 'checked' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Voice Option */}
              <div
                className={`channel-type-option ${
                  channelType === 'voice' ? 'selected' : ''
                }`}
                onClick={() => setChannelType('voice')}
                style={{ marginTop: '8px' }}
              >
                <span className="channel-type-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                </span>
                <div className="channel-type-info">
                  <span className="channel-type-title">Voice</span>
                  <span className="channel-type-desc">
                    Talk and share screen up to 4K
                  </span>
                </div>
                <div className="channel-type-radio">
                  <div
                    className={`radio-inner ${
                      channelType === 'voice' ? 'checked' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '18px' }}>
            <label className="form-label">
              CHANNEL NAME
              <span className="required-star">*</span>
            </label>
            <div className="channel-input-wrapper">
              <span className="channel-prefix">
                {channelType === 'text' ? '#' : '🔊'}
              </span>
              <input
                type="text"
                className="channel-name-input"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                required
              />
            </div>
          </div>

          <footer className="modal-footer">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-submit-btn"
              disabled={!channelName.trim()}
            >
              Create Channel
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
