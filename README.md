# Classic Discord Full-Featured Interface

A faithful, fully local recreation of the classic Discord client built using React, TypeScript, and Vite. Designed strictly according to the original layout in a pure black and dark charcoal palette with muted gray tones and classic status indicators.

---

## Features Overview

### 1. Classic Login & Signup
- **Pure Black & Gray Theme**: Pure black (`#000000`) background, dark charcoal containers, and muted gray accents.
- **Unbranded & Clean**: No logos, no text logos, no QR code, no autofill/autocomplete, no placeholders, and no fake demo data.
- **Classic Toggle**: Seamlessly switch between Login ("Welcome back!") and Signup ("Create an account").

### 2. Main Interface & Navigation
- **Top-Left Infinity Symbol (`∞`)**: Access direct messages with yourself (`(you)`).
- **Empty Server List by Default**: Clean, empty server strip initially.
- **Self-DM for Notes**: Open your personal space, view your profile summary, and write notes/messages to yourself.
- **Right-Side DM Profile Panel**: Displays full user profile (banner, avatar with status, handle, display name, pronouns, about me/bio, and editable personal note).

### 3. Server Management & Settings
- **Full Server Settings Page**:
  - **Overview**: Rename server, upload/change server icon, and upload a **Free Server Banner** displayed at the top of the channel list.
  - **Delete Server Option**: Delete server with confirmation dialog.
- **Server Context Dropdown**: Click the server header to open Server Settings, Invite People, Create Channel, Create Category, or Notification Settings.
- **Invite Links**:
  - Generate instant invite links (`https://discord.gg/...`).
  - Copy invite link with feedback.
  - Configure expiry (30m, 1h, 1d, 7d, Never) and max uses (No limit, 1, 5, 25, 100).
  - Revoke active invites inside Server Settings > Invites.

### 4. Roles & Permissions
- **Roles Management**: Create, edit, and delete roles inside Server Settings.
- **Role Colors & Presets**: Assign role colors and view hierarchy.
- **Permissions Toggles**: Configure View Channels, Send Messages, Manage Channels, Manage Server, and Mention Everyone.
- **Member Assignment**: Assign and remove roles from any user via their profile card popover.

### 5. Custom Emojis & Stickers
- **Upload & Manage**: Upload custom emojis and stickers inside Server Settings.
- **Emoji Picker Popover**: Select standard emojis, server custom emojis, or stickers.
- **In Messages & Reactions**: Send custom emojis (`:name:`) and stickers directly into chat, or add them as message reactions.

### 6. Replies, Mentions & Chat Interactions
- **Full Reply System**: Hover message -> Reply button -> displays reply preview banner above input -> sends message with classic curved reply line and clickable jump to the original message.
- **@mentions**: `@everyone`, `@here`, and `@username` highlight as interactive mention badges.
- **Message Editing & Deletion**: Hover message -> inline edit with `(edited)` indicator, or delete.
- **Message Reactions**: Add reaction pills below messages with live counter toggles.
- **Typing Indicator**: Displays live `... is typing` animation when composing messages.
- **Pinning & Pinned Messages Panel**: Pin messages and open the top header Pinned Messages panel to jump to or unpin messages.

### 7. Channel Organization & Categories
- **Categories**: Create categories, collapse/expand channel groups, and reorder channels via drag-and-drop.
- **Notification Settings**: Per-channel notification settings (All Messages, Only @mentions, Nothing, Mute Channel).

### 8. Voice Channels & 4K Screen Sharing
- **Voice Channels (`🔊`)**: Join and disconnect with the voice connection panel above the user bar.
- **Microphone Activity**: Web Audio API voice detection with animated pulsing speaking rings.
- **4K Screen Sharing**: True 4K resolution screen sharing (`3840x2160 @ 60fps`) with "LIVE" and "4K 60FPS" badges.

### 9. Status System & Profile Settings
- **Colored Status System**: Online (`#43b581`), Idle (`#faa61a`), Do Not Disturb (`#f04747`), and Invisible (`#747f8d`).
- **Custom Status Text**: Set and display custom status messages (e.g. `💬 Working on cool stuff`).
- **Profile Settings (Full Page)**: Upload profile pictures, banners, change handle, display name, pronouns, and bio.

---

## Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

## Deployment & Hosting

### Deploy to Render (Static Site)
1. Push this repository to GitHub.
2. In Render, select **New +** > **Static Site**.
3. Point to your repository. The included `render.yaml` will auto-configure:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Import to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Classic Discord auth, server settings, roles, emojis, voice & replies"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Import to Google AI Studio
- Upload `classic-discord-login.zip` directly into Google AI Studio prompt context or import the extracted workspace files.
