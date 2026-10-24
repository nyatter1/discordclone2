export type ChannelType = 'text' | 'voice';

export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  pronouns: string;
  bio: string;
  customNote?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  messages: ChatMessage[];
}

export interface Server {
  id: string;
  name: string;
  iconUrl: string;
  channels: Channel[];
}

export interface VoiceConnectionState {
  serverId: string;
  serverName: string;
  channelId: string;
  channelName: string;
}
