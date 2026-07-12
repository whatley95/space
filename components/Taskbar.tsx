"use client";

import { WindowState, Shortcut } from "@/types";
import { ShortcutIcon } from "./ShortcutIcon";

interface TaskbarProps {
  windows: WindowState[];
  shortcuts: Shortcut[];
  activeWindowId: string | null;
  startOpen: boolean;
  onToggleStart: () => void;
  onOpenPalette: () => void;
  onAddShortcut: () => void;
  onPinClick: (id: string) => void;
}

export function Taskbar({
  windows,
  shortcuts,
  activeWindowId,
  startOpen,
  onToggleStart,
  onOpenPalette,
  onAddShortcut,
  onPinClick,
}: TaskbarProps) {
  const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="taskbar fixed bottom-2.5 left-1/2 z-50 flex h-[52px] w-[calc(100%-32px)] max-w-[1000px] -translate-x-1/2 items-center gap-2 rounded-[14px] border border-white/10 bg-[rgba(24,26,32,0.72)] px-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <button
        className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition-all ${
          startOpen ? "bg-[#00f2ff] text-[#0b0c10] shadow-[0_0_20px_rgba(0,242,255,0.25)]" : "bg-[rgba(0,242,255,0.12)] text-[#00f2ff] hover:bg-[#00f2ff] hover:text-[#0b0c10]"
        }`}
        onClick={onToggleStart}
        aria-label="Start"
      >
        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"/></svg>
      </button>

      <div className="flex items-center gap-1.5 px-1.5 [scrollbar-width:none]">
        {windows.map((win) => {
          const shortcut = shortcuts.find((s) => s.id === win.shortcutId);
          if (!shortcut) return null;
          return (
            <button
              key={win.id}
              className={`taskbar-pin relative flex h-[38px] w-[38px] items-center justify-center rounded-[10px] font-mono text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10 ${
                activeWindowId === win.id ? "border border-[#00f2ff] shadow-[0_0_12px_rgba(0,242,255,0.2)]" : "border-transparent bg-white/[0.04]"
              }`}
              title={shortcut.name}
              onClick={() => onPinClick(win.id)}
            >
              <ShortcutIcon name={shortcut.name} url={shortcut.url} color={shortcut.color} size={38} className="rounded-[10px]" />
              {activeWindowId === win.id && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.25)]" />}
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      <button
        className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border-none bg-white/[0.04] text-[#e6e6e6] transition-colors hover:bg-white/10"
        onClick={onOpenPalette}
        title="Command Palette (Ctrl+K / Cmd+K)"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      </button>

      <button
        className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border-none bg-white/[0.04] text-[#e6e6e6] transition-colors hover:bg-white/10"
        onClick={onAddShortcut}
        title="Add Shortcut"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      </button>

      <div className="whitespace-nowrap px-2 font-mono text-xs font-medium text-[#8b919c]">{time}</div>
    </div>
  );
}
