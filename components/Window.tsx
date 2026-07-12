"use client";

import { useRef, useCallback } from "react";
import { Shortcut, WindowState } from "@/types";
import { escapeHtml, normalizeUrl } from "@/lib/data";


interface WindowProps {
  win: WindowState;
  shortcut: Shortcut;
  active: boolean;
  zIndex: number;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onMove: (x: number, y: number) => void;
}

export function Window({
  win,
  shortcut,
  active,
  zIndex,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
  onMove,
}: WindowProps) {
  const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const url = normalizeUrl(shortcut.url);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || win.maximized) return;
      onFocus();
      dragRef.current = { offsetX: e.clientX - win.x, offsetY: e.clientY - win.y };

      const handleMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        onMove(ev.clientX - dragRef.current.offsetX, ev.clientY - dragRef.current.offsetY);
      };
      const handleUp = () => {
        dragRef.current = null;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [win.maximized, win.x, win.y, onFocus, onMove]
  );

  return (
    <div
      className={`window absolute flex flex-col overflow-hidden rounded-[14px] border bg-[#111216] shadow-[0_24px_80px_rgba(0,0,0,0.55)] ${
        active ? "border-[rgba(0,242,255,0.35)] shadow-[0_28px_90px_rgba(0,0,0,0.6),0_0_20px_rgba(0,242,255,0.25)]" : "border-white/10"
      } ${win.minimized ? "minimized" : ""}`}
      style={{
        left: win.maximized ? 8 : win.x,
        top: win.maximized ? 8 : win.y,
        width: win.maximized ? "calc(100vw - 16px)" : win.width,
        height: win.maximized ? "calc(100vh - 76px)" : win.height,
        zIndex,
      }}
      onMouseDown={onFocus}
    >
      <div
        className="flex cursor-grab items-center justify-between border-b border-white/10 bg-[#181a20] px-3.5 py-2.5 active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2.5 font-mono text-[13px] font-semibold">
          <span className="h-3.5 w-3.5 rounded-[3px]" style={{ background: shortcut.color }} />
          <span>{shortcut.name}</span>
        </div>
        <div className="flex gap-2">
          <button
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06] text-[#8b919c] transition-colors hover:bg-white/10 hover:text-[#e6e6e6]"
            onClick={onMinimize}
            title="Minimize"
          >
            —
          </button>
          <button
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06] text-[#8b919c] transition-colors hover:bg-white/10 hover:text-[#e6e6e6]"
            onClick={onMaximize}
            title="Maximize"
          >
            □
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06] text-[#8b919c] transition-colors hover:bg-white/10 hover:text-[#e6e6e6]"
            title="Open in new tab"
            onClick={(e) => e.stopPropagation()}
          >
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
          </a>
          <button
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06] text-[#8b919c] transition-colors hover:bg-[#ff4d6d] hover:text-white"
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/20 px-3.5 py-2 font-mono text-xs text-[#8b919c]">
        <svg viewBox="0 0 24 24" width="12" height="12" className="flex-shrink-0"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        <span className="flex-1 truncate">{escapeHtml(url)}</span>
      </div>
      <div className="relative flex-1 bg-white">
        <iframe className="h-full w-full border-none" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation" src={url} />
      </div>
    </div>
  );
}
