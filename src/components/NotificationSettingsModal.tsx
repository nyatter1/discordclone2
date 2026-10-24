import React from 'react';
import { NotificationSetting } from '../types';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  currentSetting: NotificationSetting;
  isMuted: boolean;
  onUpdateSetting: (setting: NotificationSetting, isMuted: boolean) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  channelName,
  currentSetting,
  isMuted,
  onUpdateSetting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container notif-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2 className="modal-title">Notification Settings</h2>
          <p className="modal-subtitle">for #{channelName}</p>
        </header>

        <div className="notif-options-group">
          <label className="form-label">CHANNEL NOTIFICATION SETTINGS</label>
          <div
            className={`notif-choice-item ${currentSetting === 'all' ? 'active' : ''}`}
            onClick={() => onUpdateSetting('all', isMuted)}
          >
            <div className="notif-choice-info">
              <span className="notif-choice-title">All Messages</span>
              <span className="notif-choice-desc">Get notifications for every message in this channel</span>
            </div>
            <div className={`radio-inner ${currentSetting === 'all' ? 'checked' : ''}`} />
          </div>

          <div
            className={`notif-choice-item ${currentSetting === 'mentions' ? 'active' : ''}`}
            onClick={() => onUpdateSetting('mentions', isMuted)}
          >
            <div className="notif-choice-info">
              <span className="notif-choice-title">Only @mentions</span>
              <span className="notif-choice-desc">Only get notified when someone mentions you, @everyone, or @here</span>
            </div>
            <div className={`radio-inner ${currentSetting === 'mentions' ? 'checked' : ''}`} />
          </div>

          <div
            className={`notif-choice-item ${currentSetting === 'nothing' ? 'active' : ''}`}
            onClick={() => onUpdateSetting('nothing', isMuted)}
          >
            <div className="notif-choice-info">
              <span className="notif-choice-title">Nothing</span>
              <span className="notif-choice-desc">Receive no notifications from this channel</span>
            </div>
            <div className={`radio-inner ${currentSetting === 'nothing' ? 'checked' : ''}`} />
          </div>
        </div>

        <div className="notif-mute-row">
          <div className="notif-mute-info">
            <span className="notif-choice-title">Mute #{channelName}</span>
            <span className="notif-choice-desc">Prevents unread indicators and notifications</span>
          </div>
          <button
            type="button"
            className={`toggle-switch ${isMuted ? 'active' : ''}`}
            onClick={() => onUpdateSetting(currentSetting, !isMuted)}
          >
            <div className="toggle-switch-handle" />
          </button>
        </div>

        <footer className="modal-footer" style={{ marginTop: '20px' }}>
          <button type="button" className="modal-submit-btn" onClick={onClose} style={{ marginLeft: 'auto' }}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};
