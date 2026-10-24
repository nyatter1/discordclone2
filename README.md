# Classic Discord Interface

A faithful recreation of the classic Discord login, signup, and complete post-signup main interface built using React, TypeScript, and Vite. Designed strictly according to the original layout in a pure black and dark charcoal palette with muted gray tones.

---

## Features

### 1. Classic Login & Signup
- **Pure Black & Gray Theme**: Pure black (`#000000`) background with dark charcoal card containers and neutral gray accents. Zero blue, blurple, or purple tones.
- **Strictly Unbranded & Minimal**: No Discord logos, no text used as a logo, and no QR code section.
- **Clean Inputs**: No autofill/autocomplete attributes, no placeholder text, and no pre-filled demo data.
- **Classic Toggle**: Seamlessly switch between Login ("Welcome back!") and Signup ("Create an account").

### 2. Main Interface & Navigation
- **Top-Left Infinity Identifier**: Features the white infinity symbol (`∞`) button at the very top of the 72px server strip to access Direct Messages.
- **Empty Server List by Default**: Clean, empty server strip initially with zero fake servers.
- **Self DM (Personal Space)**: Automatically includes a direct message with yourself `(you)`. Users can open it, view their own profile card/header, and send messages or write personal notes with full state persistence.
- **Right-Side DM Profile Panel**: In DMs, the right sidebar renders the classic full user profile panel showing the user's banner, avatar with status, display name, handle, pronouns, about me/bio, and an editable note section.

### 3. Voice & Media
- **Voice Channels**: Add voice channels (`🔊`) inside any server.
- **Talking & Voice Activity**: Real-time microphone audio capture with Web Audio API level analysis and animated pulsing speaking rings.
- **Voice Connection Panel**: Classic Discord status bar above the user bar with connection status, channel/server name, and disconnect controls.
- **4K Screen Sharing**: True 4K resolution screen sharing support (`3840x2160 @ 60fps`) via `navigator.mediaDevices.getDisplayMedia` rendered in a stage with "LIVE" and "4K 60FPS" badges.

### 4. Interactive Profile Cards
- Clicking any online user in a server (in the member list, user bar, or chat message authors) opens a classic Discord profile card popup featuring their banner, avatar with online status, display name, handle, pronouns, bio, and note editor.

### 5. Profile Settings (Full Functional Page)
- Accessible by clicking the **User Settings** gear icon in the bottom user profile bar.
- Full classic settings layout with:
  - **Upload Profile Picture (Avatar)** with preview
  - **Change Handle (Username)**
  - **Change Display Name**
  - **Upload / Change Profile Banner** with image preview
  - **Set Pronouns**
  - **Edit Bio (About Me)**
  - Live profile card preview reflecting banner, avatar, name, and bio.
  - Floating bottom **"Careful — you have unsaved changes!"** bar with **Reset** and **Save Changes** buttons.
  - Top-right **ESC / ✕** button to close settings.

### 6. Create Server Flow
- Triggered by clicking the **"+"** button on the server strip.
- **Mandatory Server Icon**: Uploading a server icon is strictly enforced (the "Create" button remains disabled until an image is uploaded).
- **Post-Creation Scoping**:
  - The server appears in the left strip with its uploaded icon.
  - Create Text Channels (`#`) or Voice Channels (`🔊`) via the **"+"** button.
  - Completely stripped of server settings, roles, permissions, invites, and moderation tools.

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
3. Select your repository. The included `render.yaml` will auto-configure:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Import to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Classic Discord auth, self DM, voice channels, 4K screen share & profile cards"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Import to Google AI Studio
- Upload `classic-discord-login.zip` directly into Google AI Studio prompt context or import the extracted workspace files.
