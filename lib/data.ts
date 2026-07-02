import { ColorOption, Shortcut } from "@/types";

export const COLORS: ColorOption[] = [
  { name: "cyan", value: "#00f2ff" },
  { name: "green", value: "#00ff9d" },
  { name: "purple", value: "#c084fc" },
  { name: "blue", value: "#60a5fa" },
  { name: "orange", value: "#fb923c" },
  { name: "red", value: "#ff4d6d" },
  { name: "yellow", value: "#ffd166" },
  { name: "pink", value: "#f472b6" },
  { name: "slate", value: "#64748b" },
  { name: "white", value: "#e6e6e6" },
];

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: "1", name: "GitHub", url: "https://github.com/whatley95", category: "Code", color: "#24292f", launchMode: "tab" },
  { id: "2", name: "VS Code Web", url: "https://vscode.dev", category: "Code", color: "#007acc" },
  { id: "3", name: "Vercel", url: "https://vercel.com", category: "Cloud", color: "#000000" },
  { id: "4", name: "Figma", url: "https://www.figma.com", category: "Design", color: "#f24e1e" },
  { id: "5", name: "Notion", url: "https://www.notion.so", category: "Productivity", color: "#000000" },
  { id: "6", name: "Stack Overflow", url: "https://stackoverflow.com", category: "Code", color: "#f48024" },
  { id: "7", name: "MDN", url: "https://developer.mozilla.org", category: "Code", color: "#000000" },
  { id: "8", name: "Dribbble", url: "https://dribbble.com", category: "Design", color: "#ea4c89" },
  { id: "9", name: "CodePen", url: "https://codepen.io", category: "Code", color: "#1e1f26" },
  { id: "10", name: "Spotify", url: "https://open.spotify.com", category: "Media", color: "#1db954" },
];

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function normalizeUrl(url: string): string {
  let u = url.trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  return u;
}

export function getDisplayUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const NON_EMBEDDABLE_DOMAINS = new Set([
  "github.com",
  "www.github.com",
  "stackoverflow.com",
  "www.stackoverflow.com",
  "open.spotify.com",
  "spotify.com",
  "www.notion.so",
  "notion.so",
  "vercel.com",
  "www.vercel.com",
  "google.com",
  "www.google.com",
  "youtube.com",
  "www.youtube.com",
  "reddit.com",
  "www.reddit.com",
  "twitter.com",
  "x.com",
  "www.twitter.com",
  "www.x.com",
  "facebook.com",
  "www.facebook.com",
  "instagram.com",
  "www.instagram.com",
  "linkedin.com",
  "www.linkedin.com",
  "tiktok.com",
  "www.tiktok.com",
]);

export function isEmbeddable(url: string): boolean {
  try {
    const host = new URL(normalizeUrl(url)).hostname.toLowerCase();
    return !NON_EMBEDDABLE_DOMAINS.has(host);
  } catch {
    return false;
  }
}

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] ?? c));
}
