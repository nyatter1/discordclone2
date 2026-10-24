# Classic Discord Auth Interface

A faithful recreation of the classic Discord login and registration experience built using React, TypeScript, and Vite. Designed strictly using the classic dark charcoal and pure black palette with neutral gray accents.

## Features

- **Classic Layout**: Authentic recreation of the early-era Discord login and signup cards.
- **Pure Black & Gray Theme**: Built with a pure black (`#000000`) background, subtle charcoal cards, and muted gray typography and borders—no blurple or colored accents.
- **Full TypeScript Support**: Written in React with TSX and strict TypeScript typing.
- **Clean Inputs**: Uncluttered input fields with no autofill/autocomplete attributes, no placeholders, and no prefilled/demo data.
- **Render Ready**: Pre-configured for deployment as a static site on Render (`render.yaml` included).
- **GitHub & Google AI Studio Ready**: Standard modular repository layout easily imported into GitHub or Google AI Studio.

---

## Getting Started

### Prerequisites

Ensure you have Node.js (version 18 or newer) installed.

### Installation

```bash
npm install
```

### Development Server

Run the development server locally:

```bash
npm run dev
```

### Production Build

Create an optimized static build in the `dist/` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment & Hosting

### Deploying to Render (Static Site)

1. Push this project to your GitHub account (see instructions below).
2. Go to your [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** and select **Static Site**.
4. Connect your GitHub repository.
5. Configure the following settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
6. Click **Create Static Site**.

*(Alternatively, Render will automatically detect the included `render.yaml` blueprint).*

---

## Importing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Classic Discord auth interface"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

## Importing to Google AI Studio

1. Open [Google AI Studio](https://aistudio.google.com/).
2. You can upload the workspace files or attach the `.zip` archive directly into the prompt workspace or context window for rapid prototyping and fine-tuning.
