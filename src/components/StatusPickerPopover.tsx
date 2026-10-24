import React, { useState } from 'react';
import { UserStatus } from '../types';

interface StatusPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: UserStatus;
  currentCustomStatus?: string;
  onSelectStatus: (status: UserStatus) => void;
  onSaveCustomStatus: (text: string) => void;
}

const STATUS_OPTIONS: { id: UserStatus; label: string; dotClass: string; desc: string }[] = [
  { id: 'online', label: 'Online', dotClass: 'status-dot-online', desc: 'Available to chat' },
  { id: 'idle', label: 'Idle', dotClass: 'status-dot-idle', desc: 'Away from keyboard' },
  { id: 'dnd', label: 'Do Not Disturb', dotClass: 'status-dot-dnd', desc: 'Will not receive notifications' },
  { id: 'invisible', label: 'Invisible', dotClass: 'status-dot-invisible', desc: 'Appear offline to everyone' },
];

export const StatusPickerPopover: React.FC<StatusPickerPopoverProps> = ({
  isOpen,
  onClose,
  currentStatus,
  currentCustomStatus = '',
  onSelectStatus,
  onSaveCustomStatus,
}) => {
  const [customText, setCustomText] = useState(currentCustomStatus);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomStatus(customText.trim());
    onClose();
  };

  return (
    <div className="status-popover-backdrop" onClick={onClose}>
      <div className="status-popover-card" onClick={(e) => e.stopPropagation()}>
        {/* Custom Status Input Form */}
        <form onSubmit={handleCustomSubmit} className="status-custom-form">
          <label className="status-popover-label">SET CUSTOM STATUS</label>
          <div className="status-custom-input-row">
            <input
              type="text"
              className="status-custom-input"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              maxLength={60}
            />
            {customText && (
              <button
                type="button"
                className="status-clear-btn"
                onClick={() => setCustomText('')}
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="status-save-btn">
            Save Status
          </button>
        </form>

        <div className="status-popover-divider" />

        {/* Status Options */}
        <div className="status-options-list">
          {STATUS_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              className={`status-option-item ${currentStatus === opt.id ? 'active' : ''}`}
              onClick={() => {
                onSelectStatus(opt.id);
                onClose();
              }}
            >
              <div className={`status-colored-dot ${opt.dotClass}`} />
              <div className="status-option-info">
                <span className="status-option-title">{opt.label}</span>
                <span className="status-option-desc">{opt.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
