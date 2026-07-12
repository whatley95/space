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
  { id: "1", name: "GitHub", url: "https://github.com/whatley95", category: "Personal", color: "#24292f", launchMode: "tab" },
  { id: "11", name: "Portfolio", url: "https://portfolio.whatley.xyz/", category: "Personal", color: "#8b5cf6", launchMode: "tab" },
  { id: "12", name: "JSON Helper", url: "https://jsonhelper.pages.dev/", category: "Tools", color: "#ffd166", launchMode: "tab" },
  { id: "13", name: "Base64 Util", url: "https://base64util.pages.dev/", category: "Tools", color: "#3b82f6", launchMode: "tab" },
  { id: "14", name: "QR Code Util", url: "https://qrutil.pages.dev/", category: "Tools", color: "#22c55e", launchMode: "tab" },
  { id: "15", name: "LinkedIn", url: "https://linkedin.whatley.xyz/", category: "Personal", color: "#0a66c2", launchMode: "tab" },
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

export function getFaviconUrl(url: string): string {
  try {
    const host = new URL(normalizeUrl(url)).hostname.toLowerCase();
    if (!host) return "";
    const BRAND_FAVICONS: Record<string, string> = {
      linkedin: "https://www.linkedin.com/favicon.ico",
    };
    for (const [key, icon] of Object.entries(BRAND_FAVICONS)) {
      if (host.includes(key)) return icon;
    }
    return `https://icons.duckduckgo.com/ip3/${host}.ico`;
  } catch {
    return "";
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
