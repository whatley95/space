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

| Script            | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start the development server             |
| `npm run build`   | Create an optimized production build     |
| `npm run start`   | Start the production server              |
| `npm run lint`    | Run ESLint                               |

## Project Structure

- `app/` — Next.js app router entry points and global styles.
- `components/` — React components for the desktop, mobile, taskbar, windows, and modals.
- `hooks/` — Custom React hooks (e.g., `useLocalStorage`).
- `lib/` — Utilities, default shortcuts, and helper functions.
- `types/` — Shared TypeScript types.
- `legacy/` — Earlier static HTML/CSS prototype.

## License

Private
