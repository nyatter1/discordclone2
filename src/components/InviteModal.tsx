import React, { useState } from 'react';
import { ServerInvite } from '../types';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  onAddInvite: (invite: ServerInvite) => void;
  creator: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  serverName,
  onAddInvite,
  creator,
}) => {
  const [expiry, setExpiry] = useState('7 days');
  const [maxUses, setMaxUses] = useState(0); // 0 = unlimited
  const [copied, setCopied] = useState(false);
  const [inviteCode] = useState(() => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 7; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  });

  if (!isOpen) return null;

  // Exact required format: https://discordclone2.onrender.com/invite/[invite-code]
  const fullUrl = `https://discordclone2.onrender.com/invite/${inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    const newInvite: ServerInvite = {
      id: 'invite-' + Date.now(),
      code: inviteCode,
      creator,
      createdAt: new Date().toLocaleDateString(),
      expiresAt: expiry,
      maxUses,
      uses: 0,
    };
    onAddInvite(newInvite);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container invite-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2 className="modal-title">Invite friends to {serverName}</h2>
          <p className="modal-subtitle">Share this link with others to grant them access to this server.</p>
        </header>

        <div className="invite-link-box">
          <input
            type="text"
            className="invite-url-input"
            value={fullUrl}
            readOnly
          />
          <button
            type="button"
            className={`invite-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="invite-settings-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">EXPIRE AFTER</label>
            <select
              className="dob-select"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            >
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="6 hours">6 hours</option>
              <option value="12 hours">12 hours</option>
              <option value="1 day">1 day</option>
              <option value="7 days">7 days</option>
              <option value="Never">Never</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, marginLeft: '12px' }}>
            <label className="form-label">MAX NUMBER OF USES</label>
            <select
              className="dob-select"
              value={maxUses}
              onChange={(e) => setMaxUses(Number(e.target.value))}
            >
              <option value={0}>No limit</option>
              <option value={1}>1 use</option>
              <option value={5}>5 uses</option>
              <option value={10}>10 uses</option>
              <option value={25}>25 uses</option>
              <option value={50}>50 uses</option>
              <option value={100}>100 uses</option>
            </select>
          </div>
        </div>

        <footer className="modal-footer" style={{ marginTop: '16px' }}>
          <button type="button" className="modal-cancel-btn" onClick={onClose}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};
