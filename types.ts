export type ChannelType = 'text' | 'voice';
export type UserStatus = 'online' | 'idle' | 'dnd' | 'invisible';
export type NotificationSetting = 'all' | 'mentions' | 'nothing';

export interface Role {
  id: string;
  name: string;
  color: string;
  position: number;
  permissions: {
    viewChannels: boolean;
    sendMessages: boolean;
    manageChannels: boolean;
    manageServer: boolean;
    mentionEveryone: boolean;
  };
}

export interface ServerEmoji {
  id: string;
  name: string;
  url: string;
}

export interface ServerSticker {
  id: string;
  name: string;
  url: string;
}

export interface ServerInvite {
  id: string;
  code: string;
  creator: string;
  createdAt: string;
  expiresAt: string;
  maxUses: number;
  uses: number;
}

export interface ChannelCategory {
  id: string;
  name: string;
  collapsed: boolean;
}

export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  pronouns: string;
  bio: string;
  customNote?: string;
  status: UserStatus;
  customStatusText?: string;
  roles?: string[]; // role IDs
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // usernames
}

export interface MessageReplyPreview {
  id: string;
  sender: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  replyTo?: MessageReplyPreview;
  isEdited?: boolean;
  isPinned?: boolean;
  reactions?: MessageReaction[];
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  categoryId?: string;
  messages: ChatMessage[];
  notificationSetting?: NotificationSetting;
  isMuted?: boolean;
}

export interface Server {
  id: string;
  name: string;
  iconUrl: string;
  bannerUrl?: string;
  channels: Channel[];
  categories: ChannelCategory[];
  roles: Role[];
  emojis: ServerEmoji[];
  stickers: ServerSticker[];
  invites: ServerInvite[];
}

export interface VoiceConnectionState {
  serverId: string;
  serverName: string;
  channelId: string;
  channelName: string;
}
