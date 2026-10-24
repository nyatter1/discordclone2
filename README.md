# Classic Discord Interface

A faithful recreation of the classic Discord login, signup, and post-signup main interface built using React, TypeScript, and Vite. Designed strictly according to the original layout in a pure black and dark charcoal palette with muted gray tones.

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

### 3. Profile Settings (Full Functional Page)
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

### 4. Create Server Flow
- Triggered by clicking the **"+"** button on the server strip.
- **Required Server Icon**: The user **must** upload a server icon to create a server (creation is blocked until an icon is provided).
- **Server Name**: Custom name input.
- **Post-Creation Scoping**:
  - The server appears in the left strip with its uploaded icon.
  - Channels can be added via the **"+"** button next to **TEXT CHANNELS**.
  - No server settings, no roles, no permissions, no invites, and no moderation tools.

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
git commit -m "Initial commit: Classic Discord auth, self DM, profile settings & server creation"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Import to Google AI Studio
- Upload `classic-discord-login.zip` directly into Google AI Studio prompt context or import the extracted workspace files.
