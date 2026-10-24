import React, { useState, useRef } from 'react';

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateServer: (name: string, iconUrl: string) => void;
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({
  isOpen,
  onClose,
  onCreateServer,
}) => {
  const [serverName, setServerName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [iconError, setIconError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setIconUrl(result);
        setIconError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iconUrl) {
      setIconError(true);
      return;
    }
    const finalName = serverName.trim() || 'New Server';
    onCreateServer(finalName, iconUrl);
    setServerName('');
    setIconUrl('');
    setIconError(false);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <header className="modal-header">
          <h2 className="modal-title">Customize your server</h2>
          <p className="modal-subtitle">
            Give your new server a personality with a name and an icon.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="server-icon-upload-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div
              className={`server-icon-preview-box ${iconError ? 'input-error' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {iconUrl ? (
                <img src={iconUrl} alt="Server icon" className="server-icon-img" />
              ) : (
                <div className="upload-icon-placeholder">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <span className="upload-label">UPLOAD ICON *</span>
                </div>
              )}
            </div>
            {iconError && (
              <span className="error-text">A server icon is required.</span>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">
              SERVER NAME
              <span className="required-star">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              required
            />
          </div>

          <footer className="modal-footer">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
            >
              Back
            </button>
            <button
              type="submit"
              className="modal-submit-btn"
              disabled={!iconUrl}
            >
              Create
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
