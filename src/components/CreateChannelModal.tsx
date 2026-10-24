import React, { useState } from 'react';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (name: string) => void;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onCreateChannel,
}) => {
  const [channelName, setChannelName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = channelName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!formatted) return;
    onCreateChannel(formatted);
    setChannelName('');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <header className="modal-header">
          <h2 className="modal-title">Create Channel</h2>
          <p className="modal-subtitle">in Text Channels</p>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">CHANNEL TYPE</label>
            <div className="channel-type-option selected">
              <span className="channel-type-hash">#</span>
              <div className="channel-type-info">
                <span className="channel-type-title">Text</span>
                <span className="channel-type-desc">Post messages and notes</span>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">
              CHANNEL NAME
              <span className="required-star">*</span>
            </label>
            <div className="channel-input-wrapper">
              <span className="channel-prefix">#</span>
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
