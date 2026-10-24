import React, { useState, useRef, useEffect } from 'react';
import {
  UserProfile,
  Server,
  ChatMessage,
  ChannelType,
  VoiceConnectionState,
  ServerSticker,
} from '../types';
import { ProfileSettings } from './ProfileSettings';
import { CreateServerModal } from './CreateServerModal';
import { CreateChannelModal } from './CreateChannelModal';
import { UserProfileModal } from './UserProfileModal';
import { VoiceChannelView } from './VoiceChannelView';
import { ServerSettingsModal } from './ServerSettingsModal';
import { InviteModal } from './InviteModal';
import { CreateCategoryModal } from './CreateCategoryModal';
import { NotificationSettingsModal } from './NotificationSettingsModal';
import { PinnedMessagesPanel } from './PinnedMessagesPanel';
import { EmojiPickerPopover } from './EmojiPickerPopover';
import { StatusPickerPopover } from './StatusPickerPopover';

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

  // Modals & Panels State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isPinnedPanelOpen, setIsPinnedPanelOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isStatusPickerOpen, setIsStatusPickerOpen] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<UserProfile | null>(null);

  // Reaction target message
  const [reactingToMessageId, setReactingToMessageId] = useState<string | null>(null);

  // Server Header Dropdown
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);

  // User Hardware Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Chat Input State
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);

  // Reply State
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  // Inline Message Editing State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Highlighted Message for Jump
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  // Self DM Messages & Notes
  const [selfDmMessages, setSelfDmMessages] = useState<ChatMessage[]>([]);
  const [selfDmNote, setSelfDmNote] = useState('');

  // Servers List
  const [servers, setServers] = useState<Server[]>([]);

  // Dragging channel state
  const [draggedChannelId, setDraggedChannelId] = useState<string | null>(null);

  // Active Server & Channel Calculation
  const activeServer = servers.find((s) => s.id === activeView);
  const activeChannel = activeServer?.channels.find((c) => c.id === activeChannelId);

  // Auto-scroll on new message
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selfDmMessages, activeChannel?.messages]);

  // Jump to specific message
  const handleJumpToMessage = (msgId: string) => {
    setHighlightedMessageId(msgId);
    const elem = document.getElementById(`msg-${msgId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedMessageId(null);
    }, 2500);
  };

  const handleCreateServer = (name: string, iconUrl: string) => {
    const defaultChannelId = 'general-' + Date.now();
    const newServer: Server = {
      id: 'server-' + Date.now(),
      name,
      iconUrl,
      bannerUrl: '',
      channels: [
        {
          id: defaultChannelId,
          name: 'general',
          type: 'text',
          messages: [],
        },
      ],
      categories: [
        { id: 'cat-text', name: 'TEXT CHANNELS', collapsed: false },
        { id: 'cat-voice', name: 'VOICE CHANNELS', collapsed: false },
      ],
      roles: [
        {
          id: 'role-admin',
          name: 'Admin',
          color: '#e74c3c',
          position: 1,
          permissions: {
            viewChannels: true,
            sendMessages: true,
            manageChannels: true,
            manageServer: true,
            mentionEveryone: true,
          },
        },
        {
          id: 'role-member',
          name: 'Member',
          color: '#3498db',
          position: 2,
          permissions: {
            viewChannels: true,
            sendMessages: true,
            manageChannels: false,
            manageServer: false,
            mentionEveryone: false,
          },
        },
      ],
      emojis: [],
      stickers: [],
      invites: [],
    };
    setServers((prev) => [...prev, newServer]);
    setActiveView(newServer.id);
    setActiveChannelId(defaultChannelId);
  };

  const handleUpdateServer = (updatedServer: Server) => {
    setServers((prev) => prev.map((s) => (s.id === updatedServer.id ? updatedServer : s)));
  };

  const handleDeleteServer = (serverId: string) => {
    setServers((prev) => prev.filter((s) => s.id !== serverId));
    setActiveView('dm');
    setActiveChannelId('');
    if (voiceConnection?.serverId === serverId) {
      setVoiceConnection(null);
    }
  };

  const handleCreateChannel = (channelName: string, channelType: ChannelType) => {
    if (!activeServer) return;
    const targetCategory = channelType === 'text' ? 'cat-text' : 'cat-voice';
    const newChannel = {
      id: 'channel-' + Date.now(),
      name: channelName,
      type: channelType,
      categoryId: targetCategory,
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

    if (channelType === 'voice') {
      setVoiceConnection({
        serverId: activeServer.id,
        serverName: activeServer.name,
        channelId: newChannel.id,
        channelName: newChannel.name,
      });
    }
  };

  const handleCreateCategory = (catName: string) => {
    if (!activeServer) return;
    const newCategory = {
      id: 'cat-' + Date.now(),
      name: catName,
      collapsed: false,
    };
    handleUpdateServer({
      ...activeServer,
      categories: [...activeServer.categories, newCategory],
    });
  };

  const handleToggleCategoryCollapse = (catId: string) => {
    if (!activeServer) return;
    handleUpdateServer({
      ...activeServer,
      categories: activeServer.categories.map((c) =>
        c.id === catId ? { ...c, collapsed: !c.collapsed } : c
      ),
    });
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

  // Typing simulator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
    }, 1500);
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
      replyTo: replyingTo
        ? { id: replyingTo.id, sender: replyingTo.sender, text: replyingTo.text }
        : undefined,
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
    setReplyingTo(null);
    setIsTyping(false);
  };

  // Message Editing & Deletion
  const handleSaveEdit = (msgId: string) => {
    if (!editingText.trim()) return;

    if (activeView === 'dm') {
      setSelfDmMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, text: editingText.trim(), isEdited: true } : m
        )
      );
    } else if (activeServer && activeChannel) {
      setServers((prev) =>
        prev.map((s) => {
          if (s.id === activeServer.id) {
            return {
              ...s,
              channels: s.channels.map((c) => {
                if (c.id === activeChannel.id) {
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === msgId ? { ...m, text: editingText.trim(), isEdited: true } : m
                    ),
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

    setEditingMessageId(null);
    setEditingText('');
  };

  const handleDeleteMessage = (msgId: string) => {
    if (activeView === 'dm') {
      setSelfDmMessages((prev) => prev.filter((m) => m.id !== msgId));
    } else if (activeServer && activeChannel) {
      setServers((prev) =>
        prev.map((s) => {
          if (s.id === activeServer.id) {
            return {
              ...s,
              channels: s.channels.map((c) => {
                if (c.id === activeChannel.id) {
                  return {
                    ...c,
                    messages: c.messages.filter((m) => m.id !== msgId),
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
  };

  // Pinning
  const handleTogglePin = (msgId: string) => {
    const updatePin = (m: ChatMessage) =>
      m.id === msgId ? { ...m, isPinned: !m.isPinned } : m;

    if (activeView === 'dm') {
      setSelfDmMessages((prev) => prev.map(updatePin));
    } else if (activeServer && activeChannel) {
      setServers((prev) =>
        prev.map((s) => {
          if (s.id === activeServer.id) {
            return {
              ...s,
              channels: s.channels.map((c) => {
                if (c.id === activeChannel.id) {
                  return {
                    ...c,
                    messages: c.messages.map(updatePin),
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
  };

  // Reactions
  const handleAddReaction = (msgId: string, emoji: string) => {
    const username = userProfile.username || 'User';

    const updateMsgReactions = (m: ChatMessage): ChatMessage => {
      if (m.id !== msgId) return m;
      const current = m.reactions || [];
      const existing = current.find((r) => r.emoji === emoji);

      let updatedReactions;
      if (existing) {
        if (existing.users.includes(username)) {
          // Remove reaction
          const remainingUsers = existing.users.filter((u) => u !== username);
          if (remainingUsers.length === 0) {
            updatedReactions = current.filter((r) => r.emoji !== emoji);
          } else {
            updatedReactions = current.map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.count - 1, users: remainingUsers }
                : r
            );
          }
        } else {
          // Add to existing
          updatedReactions = current.map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.count + 1, users: [...r.users, username] }
              : r
          );
        }
      } else {
        // New reaction
        updatedReactions = [...current, { emoji, count: 1, users: [username] }];
      }

      return { ...m, reactions: updatedReactions };
    };

    if (activeView === 'dm') {
      setSelfDmMessages((prev) => prev.map(updateMsgReactions));
    } else if (activeServer && activeChannel) {
      setServers((prev) =>
        prev.map((s) => {
          if (s.id === activeServer.id) {
            return {
              ...s,
              channels: s.channels.map((c) => {
                if (c.id === activeChannel.id) {
                  return {
                    ...c,
                    messages: c.messages.map(updateMsgReactions),
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
  };

  // Send Sticker directly as message
  const handleSendSticker = (sticker: ServerSticker) => {
    const newMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: userProfile.displayName || userProfile.username || 'User',
      senderAvatar: userProfile.avatarUrl,
      text: `[Sticker: ${sticker.name}]`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    if (activeView === 'dm') {
      setSelfDmMessages((prev) => [...prev, newMessage]);
    } else if (activeServer && activeChannel) {
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
  };

  // Mention parsing helper
  const renderMessageText = (text: string) => {
    const parts = text.split(/(@\w+|@everyone|@here)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="mention-tag">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const currentMessages =
    activeView === 'dm'
      ? selfDmMessages
      : activeChannel && activeChannel.type === 'text'
      ? activeChannel.messages
      : [];

  const pinnedMessages = currentMessages.filter((m) => m.isPinned);

  // Group channels by category
  const categories = activeServer?.categories || [];
  const uncategorizedChannels =
    activeServer?.channels.filter(
      (ch) => !ch.categoryId || !categories.some((c) => c.id === ch.categoryId)
    ) || [];

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
                  <div
                    className={`status-mini-dot status-dot-${userProfile.status || 'online'}`}
                  />
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
            {/* Server Banner at top of channel list (Classic Discord style) */}
            {activeServer.bannerUrl && (
              <div
                className="server-channel-banner"
                style={{ backgroundImage: `url(${activeServer.bannerUrl})` }}
              />
            )}

            {/* Server Header with Dropdown */}
            <header
              className={`channels-header server-channels-header clickable ${
                activeServer.bannerUrl ? 'has-banner' : ''
              }`}
              onClick={() => setIsServerDropdownOpen(!isServerDropdownOpen)}
            >
              <span className="server-title-text">{activeServer.name}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`dropdown-chevron ${isServerDropdownOpen ? 'open' : ''}`}
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
              </svg>

              {/* Server Context Dropdown Menu */}
              {isServerDropdownOpen && (
                <div
                  className="server-dropdown-menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsServerDropdownOpen(false);
                      setIsServerSettingsOpen(true);
                    }}
                  >
                    <span>Server Settings</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsServerDropdownOpen(false);
                      setIsInviteModalOpen(true);
                    }}
                  >
                    <span>Invite People</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsServerDropdownOpen(false);
                      setIsCreateChannelOpen(true);
                    }}
                  >
                    <span>Create Channel</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsServerDropdownOpen(false);
                      setIsCreateCategoryOpen(true);
                    }}
                  >
                    <span>Create Category</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsServerDropdownOpen(false);
                      setIsNotifModalOpen(true);
                    }}
                  >
                    <span>Notification Settings</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                  </button>
                </div>
              )}
            </header>

            {/* Channels & Categories List */}
            <div className="channels-content-container">
              {/* Uncategorized channels */}
              {uncategorizedChannels.map((ch) => (
                <div
                  key={ch.id}
                  className={`channel-item-row ${
                    activeChannelId === ch.id ? 'active' : ''
                  }`}
                  onClick={() => handleChannelClick(ch.id, ch.type, ch.name)}
                >
                  <span className="channel-hash">
                    {ch.type === 'voice' ? '🔊' : '#'}
                  </span>
                  <span className="channel-name-label">{ch.name}</span>
                </div>
              ))}

              {/* Categorized channels */}
              {categories.map((cat) => {
                const categoryChannels = activeServer.channels.filter(
                  (ch) => ch.categoryId === cat.id
                );
                return (
                  <div key={cat.id} className="category-group">
                    <div
                      className="channel-category-row clickable"
                      onClick={() => handleToggleCategoryCollapse(cat.id)}
                    >
                      <div className="category-title-wrap">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={`category-chevron ${cat.collapsed ? 'collapsed' : ''}`}
                        >
                          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                        </svg>
                        <span className="channel-category-label">{cat.name}</span>
                      </div>
                      <button
                        type="button"
                        className="add-channel-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCreateChannelOpen(true);
                        }}
                        title="Create Channel"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                      </button>
                    </div>

                    {!cat.collapsed && (
                      <div className="category-channels-list">
                        {categoryChannels.map((ch) => (
                          <div
                            key={ch.id}
                            className={`channel-item-row ${ch.type === 'voice' ? 'voice' : ''} ${
                              activeChannelId === ch.id ? 'active' : ''
                            }`}
                            draggable
                            onDragStart={() => setDraggedChannelId(ch.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (!draggedChannelId || draggedChannelId === ch.id) return;
                              const sourceIdx = activeServer.channels.findIndex(
                                (c) => c.id === draggedChannelId
                              );
                              const targetIdx = activeServer.channels.findIndex(
                                (c) => c.id === ch.id
                              );
                              if (sourceIdx !== -1 && targetIdx !== -1) {
                                const updatedChannels = [...activeServer.channels];
                                const [removed] = updatedChannels.splice(sourceIdx, 1);
                                updatedChannels.splice(targetIdx, 0, removed);
                                handleUpdateServer({
                                  ...activeServer,
                                  channels: updatedChannels,
                                });
                              }
                              setDraggedChannelId(null);
                            }}
                            onClick={() => handleChannelClick(ch.id, ch.type, ch.name)}
                          >
                            <span className="channel-hash">
                              {ch.type === 'voice' ? '🔊' : '#'}
                            </span>
                            <span className="channel-name-label">{ch.name}</span>
                            {ch.isMuted && (
                              <span className="channel-muted-indicator" title="Muted">
                                🔇
                              </span>
                            )}
                            {voiceConnection?.channelId === ch.id && (
                              <span className="voice-connected-dot" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        {/* Voice Connected Status Bar (if connected to voice) */}
        {voiceConnection && (
          <div className="voice-connection-panel">
            <div className="voice-status-info">
              <div className="voice-connection-indicator">
                <span className="voice-status-dot status-dot-online" />
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
            onClick={() => setIsStatusPickerOpen(true)}
            title="Change Online Status & Custom Status"
          >
            <div className="user-avatar-placeholder">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt="Profile"
                  className="user-bar-avatar-img"
                />
              ) : null}
              <div
                className={`status-mini-dot status-dot-${userProfile.status || 'online'}`}
              />
            </div>
            <div className="user-details">
              <span className="user-name">
                {userProfile.displayName || userProfile.username || 'User'}
              </span>
              <span className="user-tag">
                {userProfile.customStatusText || `@${userProfile.username || 'user'}`}
              </span>
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
            {/* Pinned Messages Button */}
            <button
              type="button"
              className={`header-icon-action-btn ${isPinnedPanelOpen ? 'active' : ''}`}
              onClick={() => setIsPinnedPanelOpen(!isPinnedPanelOpen)}
              title="Pinned Messages"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
            </button>

            {/* Notification Settings Toggle */}
            {activeServer && (
              <button
                type="button"
                className="header-icon-action-btn"
                onClick={() => setIsNotifModalOpen(true)}
                title="Notification Settings"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              </button>
            )}

            <div className="header-search-bar" />
          </div>

          {/* Pinned Messages Panel Dropdown */}
          <PinnedMessagesPanel
            isOpen={isPinnedPanelOpen}
            onClose={() => setIsPinnedPanelOpen(false)}
            pinnedMessages={pinnedMessages}
            onUnpinMessage={handleTogglePin}
            onJumpToMessage={handleJumpToMessage}
          />
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
                    This is the start of the #{activeChannel?.name || 'channel'} channel.
                  </p>
                </div>
              ) : (
                <div className="messages-list">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      id={`msg-${msg.id}`}
                      className={`message-row ${
                        highlightedMessageId === msg.id ? 'highlighted' : ''
                      }`}
                    >
                      {/* Reply Line Header if Replying */}
                      {msg.replyTo && (
                        <div
                          className="reply-indicator-bar"
                          onClick={() => handleJumpToMessage(msg.replyTo!.id)}
                        >
                          <div className="reply-spine" />
                          <span className="reply-author">@{msg.replyTo.sender}</span>
                          <span className="reply-snippet">{msg.replyTo.text}</span>
                        </div>
                      )}

                      <div className="message-content-wrapper">
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
                            <span className="message-timestamp">
                              {msg.timestamp}
                              {msg.isEdited && (
                                <span className="edited-badge"> (edited)</span>
                              )}
                              {msg.isPinned && (
                                <span className="pinned-badge" title="Pinned">
                                  📌
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Message Content or Inline Edit Input */}
                          {editingMessageId === msg.id ? (
                            <div className="inline-edit-box">
                              <input
                                type="text"
                                className="inline-edit-input"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit(msg.id);
                                  if (e.key === 'Escape') setEditingMessageId(null);
                                }}
                              />
                              <div className="inline-edit-help">
                                escape to{' '}
                                <button
                                  type="button"
                                  className="link-btn"
                                  onClick={() => setEditingMessageId(null)}
                                >
                                  cancel
                                </button>{' '}
                                • enter to{' '}
                                <button
                                  type="button"
                                  className="link-btn"
                                  onClick={() => handleSaveEdit(msg.id)}
                                >
                                  save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="message-content-text">
                              {renderMessageText(msg.text)}
                            </div>
                          )}

                          {/* Reactions Display */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="message-reactions-row">
                              {msg.reactions.map((r) => {
                                const userReacted = r.users.includes(
                                  userProfile.username || 'User'
                                );
                                return (
                                  <button
                                    key={r.emoji}
                                    type="button"
                                    className={`reaction-pill ${
                                      userReacted ? 'active' : ''
                                    }`}
                                    onClick={() => handleAddReaction(msg.id, r.emoji)}
                                  >
                                    <span className="reaction-emoji">{r.emoji}</span>
                                    <span className="reaction-count">{r.count}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Hover Quick Action Buttons */}
                        <div className="message-hover-actions">
                          {/* React */}
                          <button
                            type="button"
                            className="hover-action-btn"
                            onClick={() => {
                              setReactingToMessageId(msg.id);
                              setIsEmojiPickerOpen(true);
                            }}
                            title="Add Reaction"
                          >
                            😀
                          </button>

                          {/* Reply */}
                          <button
                            type="button"
                            className="hover-action-btn"
                            onClick={() => setReplyingTo(msg)}
                            title="Reply"
                          >
                            ↩
                          </button>

                          {/* Pin */}
                          <button
                            type="button"
                            className="hover-action-btn"
                            onClick={() => handleTogglePin(msg.id)}
                            title={msg.isPinned ? 'Unpin Message' : 'Pin Message'}
                          >
                            📌
                          </button>

                          {/* Edit (if sender) */}
                          <button
                            type="button"
                            className="hover-action-btn"
                            onClick={() => {
                              setEditingMessageId(msg.id);
                              setEditingText(msg.text);
                            }}
                            title="Edit Message"
                          >
                            ✏️
                          </button>

                          {/* Delete (if sender) */}
                          <button
                            type="button"
                            className="hover-action-btn"
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Delete Message"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatMessagesEndRef} />
                </div>
              )}
            </section>

            {/* Bottom Chat Input Form */}
            <form className="chat-input-bar-container" onSubmit={handleSendMessage}>
              {/* Active Reply Header Banner */}
              {replyingTo && (
                <div className="active-reply-banner">
                  <div className="active-reply-text">
                    <span>Replying to </span>
                    <strong>@{replyingTo.sender}</strong>
                    <span className="active-reply-preview">: {replyingTo.text}</span>
                  </div>
                  <button
                    type="button"
                    className="cancel-reply-btn"
                    onClick={() => setReplyingTo(null)}
                    title="Cancel Reply"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="chat-input-wrapper">
                <button
                  type="button"
                  className="chat-attach-btn"
                  onClick={() => setIsEmojiPickerOpen(true)}
                  title="Emoji & Stickers"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>

                <input
                  type="text"
                  className="chat-text-input"
                  value={chatInput}
                  onChange={handleInputChange}
                />

                {/* Emoji / Sticker button */}
                <button
                  type="button"
                  className="chat-emoji-trigger-btn"
                  onClick={() => {
                    setReactingToMessageId(null);
                    setIsEmojiPickerOpen(true);
                  }}
                  title="Insert Emoji"
                >
                  😀
                </button>
              </div>

              {/* Typing indicator */}
              <div className="typing-indicator-bar">
                {isTyping && (
                  <span className="typing-indicator-text">
                    {userProfile.displayName || userProfile.username} is typing...
                  </span>
                )}
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
              <div
                className={`popover-status-indicator status-dot-${userProfile.status || 'online'}`}
              />
            </div>

            <div className="dm-side-content">
              <h3 className="dm-side-display-name">
                {userProfile.displayName || userProfile.username || 'User'}
              </h3>
              <div className="dm-side-handle">@{userProfile.username || 'user'}</div>
              {userProfile.pronouns && (
                <div className="dm-side-pronouns">{userProfile.pronouns}</div>
              )}
              {userProfile.customStatusText && (
                <div className="popover-custom-status">
                  💬 {userProfile.customStatusText}
                </div>
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
                  <div
                    className={`member-status-dot status-dot-${userProfile.status || 'online'}`}
                  />
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

      {/* User Profile Settings Full Modal */}
      <ProfileSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={userProfile}
        onSaveProfile={onUpdateProfile}
        onLogout={onLogout}
      />

      {/* Server Settings Full Modal */}
      {activeServer && (
        <ServerSettingsModal
          isOpen={isServerSettingsOpen}
          onClose={() => setIsServerSettingsOpen(false)}
          server={activeServer}
          onUpdateServer={handleUpdateServer}
          onDeleteServer={handleDeleteServer}
        />
      )}

      {/* Create Server Modal */}
      <CreateServerModal
        isOpen={isCreateServerOpen}
        onClose={() => setIsCreateServerOpen(false)}
        onCreateServer={handleCreateServer}
      />

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        onCreateChannel={handleCreateChannel}
      />

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={isCreateCategoryOpen}
        onClose={() => setIsCreateCategoryOpen(false)}
        onCreateCategory={handleCreateCategory}
      />

      {/* Invite Modal */}
      {activeServer && (
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          serverName={activeServer.name}
          creator={userProfile.displayName || userProfile.username}
          onAddInvite={(inv) => {
            handleUpdateServer({
              ...activeServer,
              invites: [...activeServer.invites, inv],
            });
          }}
        />
      )}

      {/* Notification Settings Modal */}
      {activeChannel && (
        <NotificationSettingsModal
          isOpen={isNotifModalOpen}
          onClose={() => setIsNotifModalOpen(false)}
          channelName={activeChannel.name}
          currentSetting={activeChannel.notificationSetting || 'all'}
          isMuted={!!activeChannel.isMuted}
          onUpdateSetting={(setting, isMutedVal) => {
            if (activeServer) {
              setServers((prev) =>
                prev.map((s) => {
                  if (s.id === activeServer.id) {
                    return {
                      ...s,
                      channels: s.channels.map((c) =>
                        c.id === activeChannel.id
                          ? { ...c, notificationSetting: setting, isMuted: isMutedVal }
                          : c
                      ),
                    };
                  }
                  return s;
                })
              );
            }
          }}
        />
      )}

      {/* Emoji & Sticker Picker Popover */}
      <EmojiPickerPopover
        isOpen={isEmojiPickerOpen}
        onClose={() => {
          setIsEmojiPickerOpen(false);
          setReactingToMessageId(null);
        }}
        serverEmojis={activeServer?.emojis || []}
        serverStickers={activeServer?.stickers || []}
        isReactionMode={!!reactingToMessageId}
        onSelectEmoji={(emoji) => {
          if (reactingToMessageId) {
            handleAddReaction(reactingToMessageId, emoji);
          } else {
            setChatInput((prev) => prev + emoji);
          }
        }}
        onSelectSticker={handleSendSticker}
      />

      {/* Online Status Picker Popover */}
      <StatusPickerPopover
        isOpen={isStatusPickerOpen}
        onClose={() => setIsStatusPickerOpen(false)}
        currentStatus={userProfile.status || 'online'}
        currentCustomStatus={userProfile.customStatusText}
        onSelectStatus={(status) => {
          onUpdateProfile({ ...userProfile, status });
        }}
        onSaveCustomStatus={(text) => {
          onUpdateProfile({ ...userProfile, customStatusText: text });
        }}
      />

      {/* User Profile Card Popover */}
      <UserProfileModal
        isOpen={!!selectedUserForProfile}
        onClose={() => setSelectedUserForProfile(null)}
        profile={selectedUserForProfile || userProfile}
        availableRoles={activeServer?.roles || []}
        onToggleRole={(roleId) => {
          const currentRoles = userProfile.roles || [];
          const updatedRoles = currentRoles.includes(roleId)
            ? currentRoles.filter((id) => id !== roleId)
            : [...currentRoles, roleId];
          onUpdateProfile({ ...userProfile, roles: updatedRoles });
        }}
      />
    </div>
  );
};
