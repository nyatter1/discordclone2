export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  pronouns: string;
  bio: string;
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
  messages: ChatMessage[];
}

export interface Server {
  id: string;
  name: string;
  iconUrl: string;
  channels: Channel[];
}
