# Classic Discord Auth & Main Interface

A faithful recreation of the classic Discord login, signup, and post-signup main interface built using React, TypeScript, and Vite. Designed strictly according to the original layout in a pure black and dark charcoal palette with muted gray tones.

## Features

### 1. Classic Login & Signup
- **Pure Black & Gray Theme**: Pure black (`#000000`) background with dark charcoal card containers and neutral gray accents. No blue, blurple, or purple.
- **Strictly Unbranded & Minimal**: No Discord logos, no text used as a logo, and no QR code section.
- **Clean Inputs**: No autofill/autocomplete attributes, no placeholder text, and no pre-filled demo data.
- **Classic Toggle**: Seamlessly switch between Login ("Welcome back!") and Signup ("Create an account").

### 2. Main Screen (After Signup / Login)
- **Authentic Discord Layout**:
  - **Left Server Strip (72px)**: Features the **white infinity symbol (`∞`)** as the sole top-left identifier to access direct messages. The server list is completely empty (no fake/sample servers or icons).
  - **Channel / DM Sidebar (240px)**: Clean, empty channel and DM list, with a bottom user profile bar featuring your username, avatar placeholder, and functional mute, deafen, and settings controls (with Log Out option).
  - **Main Chat Area**: Classic top channel header, empty clean chat history area, and classic bottom chat input bar (without placeholders or autocomplete).
  - **Member Sidebar (240px)**: Clean, completely empty member list with no dummy users or sample conversations.

---

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
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
git commit -m "Initial commit: Classic Discord auth & main screen"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Import to Google AI Studio
- Upload `classic-discord-login.zip` directly into Google AI Studio prompt context or import the extracted files.
