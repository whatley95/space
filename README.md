# DevOS Workspace

A personal, desktop-inspired workspace dashboard for organizing web apps and shortcuts. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Features

- **Desktop view** — draggable, resizable windows for embeddable sites.
- **Mobile view** — touch-friendly launcher with search, categories, and a bottom action sheet.
- **Shortcuts** — add, edit, and delete apps/websites; data is stored in `localStorage`.
- **Command palette & start menu** — quick navigation with keyboard or mouse.
- **Smart launching** — sites that block embedding (e.g., GitHub, Spotify) open in a new tab.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Script              | Description                              |
|---------------------|------------------------------------------|
| `npm run dev`       | Start the development server             |
| `npm run build`     | Create an optimized production build     |
| `npm run start`     | Start the production server              |
| `npm run build:cf`  | Static export for Cloudflare (`out/`)    |
| `npm run lint`      | Run ESLint                               |

## Deployment (Cloudflare Pages)

The app is client-only (no server features), so it deploys as a **static site**.

1. Build the static export:

   ```bash
   npm run build:cf
   ```

   This runs `next build` with `output: 'export'` enabled (via `scripts/build-cf.mjs` + `next.config.ts`) and produces an `out/` folder of static assets.

2. Upload to Cloudflare manually:
   - Cloudflare Dashboard → **Workers & Pages → Create → Pages → Upload assets**.
   - Select the **`out`** folder from the project root.
   - No build command, framework preset, or `_routes.json` is required — it is already built and fully static.

3. (Optional) Add a custom domain in the Cloudflare dashboard.

> Shortcut favicons load from remote services (DuckDuckGo / LinkedIn) at runtime, and the shortcut list is stored in `localStorage` — both work fine over HTTPS on Cloudflare Pages.

## Project Structure

- `app/` — Next.js app router entry points and global styles.
- `components/` — React components for the desktop, mobile, taskbar, windows, and modals.
- `hooks/` — Custom React hooks (e.g., `useLocalStorage`).
- `lib/` — Utilities, default shortcuts, and helper functions.
- `types/` — Shared TypeScript types.
- `legacy/` — Earlier static HTML/CSS prototype.
- `scripts/build-cf.mjs` — Cross-platform wrapper that enables the Cloudflare static export.

## License

Private
