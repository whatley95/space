export type LaunchMode = "window" | "tab";

export interface Shortcut {
  id: string;
  name: string;
  url: string;
  category: string;
  color: string;
  launchMode?: LaunchMode;
}

export interface WindowState {
  id: string;
  shortcutId: string;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  prev?: { x: number; y: number; width: number; height: number };
}

export interface ColorOption {
  name: string;
  value: string;
}
