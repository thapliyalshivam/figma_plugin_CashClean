## React Rectangles – Figma Plugin

A minimal, well-structured Figma plugin using **React** that inserts **two rectangles** into the current Figma page.

### Folder structure

- **`manifest.json`** – Figma plugin manifest.
- **`webpack.config.cjs`** – Bundles the plugin code and React UI into `dist/`.
- **`tsconfig.json`** – TypeScript configuration.
- **`src/code.ts`** – Figma plugin main (runs in the Figma sandbox).
- **`src/ui/`**
  - **`index.tsx`** – React entry for the UI.
  - **`App.tsx`** – High-level layout shell.
  - **`components/RectangleControls.tsx`** – UI that triggers rectangle insertion.
  - **`template.html`** – HTML shell for the UI.
- **`src/styles/main.css`** – Central “master” stylesheet for all UI styling.

### Install dependencies

```bash
cd /Users/shivam.thapliyal/Documents/pgn
npm install
```

### Build the plugin

```bash
npm run build
```

This produces `dist/code.js` and `dist/ui.html`.

### Load into Figma

1. Open Figma desktop.
2. Go to **Plugins → Development → Import plugin from manifest…**
3. Select `manifest.json` in this folder.
4. Run the plugin from **Plugins → Development → React Rectangles**.

Click **“Insert 2 rectangles”** in the plugin UI to insert two styled rectangles side by side in the current page.











