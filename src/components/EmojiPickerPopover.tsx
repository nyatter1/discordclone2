import React, { useState } from 'react';
import { ServerEmoji, ServerSticker } from '../types';

interface EmojiPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  serverEmojis?: ServerEmoji[];
  serverStickers?: ServerSticker[];
  onSelectEmoji: (emoji: string) => void;
  onSelectSticker?: (sticker: ServerSticker) => void;
  isReactionMode?: boolean;
}

const DEFAULT_EMOJIS = [
  '😀', '😂', '🔥', '👍', '❤️', '🎉', '🚀', '✨',
  '😎', '🤔', '👀', '💯', '🙏', '🙌', '💀', '🤖',
  '👏', '🥳', '⭐', '💡', '💬', '⚡', '🖤', '✅',
];

export const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({
  isOpen,
  onClose,
  serverEmojis = [],
  serverStickers = [],
  onSelectEmoji,
  onSelectSticker,
  isReactionMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'stickers'>('emoji');

  if (!isOpen) return null;

  return (
    <div className="emoji-popover-backdrop" onClick={onClose}>
      <div className="emoji-popover-card" onClick={(e) => e.stopPropagation()}>
        {!isReactionMode && (
          <div className="emoji-popover-tabs">
            <button
              type="button"
              className={`emoji-tab-btn ${activeTab === 'emoji' ? 'active' : ''}`}
              onClick={() => setActiveTab('emoji')}
            >
              Emoji
            </button>
            <button
              type="button"
              className={`emoji-tab-btn ${activeTab === 'stickers' ? 'active' : ''}`}
              onClick={() => setActiveTab('stickers')}
            >
              Stickers
            </button>
          </div>
        )}

        {activeTab === 'emoji' ? (
          <div className="emoji-popover-content">
            {/* Server Custom Emojis */}
            {serverEmojis.length > 0 && (
              <div className="emoji-section">
                <span className="emoji-section-title">SERVER EMOJIS</span>
                <div className="emoji-grid">
                  {serverEmojis.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      className="custom-emoji-btn"
                      onClick={() => {
                        onSelectEmoji(`:${e.name}:`);
                        onClose();
                      }}
                      title={`:${e.name}:`}
                    >
                      <img src={e.url} alt={e.name} className="custom-emoji-img" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Emojis */}
            <div className="emoji-section">
              <span className="emoji-section-title">STANDARD EMOJIS</span>
              <div className="emoji-grid">
                {DEFAULT_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="standard-emoji-btn"
                    onClick={() => {
                      onSelectEmoji(emoji);
                      onClose();
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="stickers-popover-content">
            {serverStickers.length === 0 ? (
              <div className="stickers-empty">
                <p>No custom stickers uploaded yet in Server Settings.</p>
              </div>
            ) : (
              <div className="stickers-grid">
                {serverStickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="sticker-item"
                    onClick={() => {
                      if (onSelectSticker) {
                        onSelectSticker(sticker);
                      }
                      onClose();
                    }}
                    title={sticker.name}
                  >
                    <img src={sticker.url} alt={sticker.name} className="sticker-img" />
                    <span className="sticker-name">{sticker.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
