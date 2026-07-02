"use client";

import { Shortcut, WindowState } from "@/types";
import { getInitials } from "@/lib/data";
import { Window } from "./Window";
import { ContextMenu } from "./ContextMenu";

interface DesktopViewProps {
  shortcuts: Shortcut[];
  windows: WindowState[];
  activeWindowId: string | null;
  contextMenu: { shortcut: Shortcut; x: number; y: number } | null;
  nextZ: number;
  onOpenWindow: (s: Shortcut) => void;
  onFocusWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onMoveWindow: (id: string, x: number, y: number) => void;
  onEditShortcut: (s: Shortcut) => void;
  onDeleteShortcut: (s: Shortcut) => void;
  onContextMenu: (s: Shortcut, x: number, y: number) => void;
  onCloseContextMenu: () => void;
}

export function DesktopView({
  shortcuts,
  windows,
  activeWindowId,
  contextMenu,
  nextZ,
  onOpenWindow,
  onFocusWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onCloseWindow,
  onMoveWindow,
  onEditShortcut,
  onDeleteShortcut,
  onContextMenu,
  onCloseContextMenu,
}: DesktopViewProps) {
  return (
    <div className="view absolute inset-0 hidden md:flex flex-col p-4 pb-[76px] md:p-5 md:pb-[76px]">
      <div className="relative z-[1] grid flex-1 content-start gap-2.5 overflow-y-auto p-2 [grid-template-columns:repeat(auto-fill,92px)] [grid-auto-rows:104px]">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.id}
            className="group flex cursor-pointer flex-col items-center justify-start rounded-[10px] border border-transparent p-2 transition-all hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/5 active:scale-95"
            role="button"
            tabIndex={0}
            title={shortcut.name}
            onClick={() => onOpenWindow(shortcut)}
            onKeyDown={(e) => e.key === "Enter" && onOpenWindow(shortcut)}
            onContextMenu={(e) => onContextMenu(shortcut, e.clientX, e.clientY)}
          >
            <div
              className="mb-2 flex h-[54px] w-[54px] items-center justify-center rounded-[14px] font-mono text-[22px] font-bold text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
              style={{ background: shortcut.color }}
            >
              {getInitials(shortcut.name)}
            </div>
            <div className="line-clamp-2 max-w-[84px] text-center text-xs leading-tight text-[#e6e6e6] [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
              {shortcut.name}
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none fixed inset-0 z-20">
        {windows.map((win) => {
          const shortcut = shortcuts.find((s) => s.id === win.shortcutId);
          if (!shortcut) return null;
          return (
            <Window
              key={win.id}
              win={win}
              shortcut={shortcut}
              active={activeWindowId === win.id}
              zIndex={nextZ + windows.indexOf(win)}
              onFocus={() => onFocusWindow(win.id)}
              onMinimize={() => onMinimizeWindow(win.id)}
              onMaximize={() => onMaximizeWindow(win.id)}
              onClose={() => onCloseWindow(win.id)}
              onMove={(x, y) => onMoveWindow(win.id, x, y)}
            />
          );
        })}
      </div>

      <ContextMenu
        shortcut={contextMenu?.shortcut ?? null}
        x={contextMenu?.x ?? 0}
        y={contextMenu?.y ?? 0}
        onOpen={onOpenWindow}
        onEdit={onEditShortcut}
        onDelete={onDeleteShortcut}
        onClose={onCloseContextMenu}
      />
    </div>
  );
}
