"use client";

import { useState, useEffect } from "react";
import { Shortcut } from "@/types";
import { getInitials } from "@/lib/data";

interface StartMenuProps {
  open: boolean;
  shortcuts: Shortcut[];
  onOpenWindow: (s: Shortcut) => void;
  onAddShortcut: () => void;
  onAbout: () => void;
  onClose: () => void;
}

export function StartMenu({ open, shortcuts, onOpenWindow, onAddShortcut, onAbout, onClose }: StartMenuProps) {
  const [term, setTerm] = useState("");

  useEffect(() => {
    if (open) setTerm("");
  }, [open]);

  if (!open) return null;

  const items = shortcuts.filter(
    (s) => s.name.toLowerCase().includes(term.toLowerCase()) || s.category.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <div className="start-menu fixed bottom-[70px] left-1/2 z-[60] w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2 rounded-[14px] border border-white/10 bg-[rgba(24,26,32,0.72)] shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="flex items-center gap-3 border-b border-white/10 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00f2ff] font-mono font-bold text-[#0b0c10]">D</div>
        <div>
          <div className="text-sm font-semibold">Developer</div>
          <div className="text-xs text-[#8b919c]">workspace ready</div>
        </div>
      </div>

      <div className="mx-3.5 my-3.5 flex h-10 items-center gap-2.5 rounded-[10px] border border-white/10 bg-black/25 px-3 font-mono text-[#00f2ff]">
        <span>&gt;</span>
        <input
          type="text"
          className="flex-1 bg-transparent text-sm text-[#e6e6e6] outline-none placeholder:text-[#8b919c]"
          placeholder="Type to search..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          autoFocus
        />
      </div>

      <div className="grid max-h-[260px] grid-cols-4 gap-2.5 overflow-y-auto px-3.5 pb-3.5">
        {items.length ? (
          items.slice(0, 12).map((shortcut) => (
            <button
              key={shortcut.id}
              className="flex flex-col items-center gap-1.5 rounded-[10px] p-2 transition-colors hover:bg-white/10"
              onClick={() => { onOpenWindow(shortcut); onClose(); }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-lg font-bold text-white"
                style={{ background: shortcut.color }}
              >
                {getInitials(shortcut.name)}
              </div>
              <div className="max-w-[80px] truncate text-center text-[11px]">{shortcut.name}</div>
            </button>
          ))
        ) : (
          <div className="col-span-4 py-6 text-center text-sm text-[#8b919c]">No apps found</div>
        )}
      </div>

      <div className="flex justify-between border-t border-white/10 bg-black/15 px-3.5 py-3">
        <button className="bg-transparent font-mono text-xs text-[#8b919c] hover:text-[#00f2ff]" onClick={() => { onAddShortcut(); onClose(); }}>
          + New Shortcut
        </button>
        <button className="bg-transparent font-mono text-xs text-[#8b919c] hover:text-[#00f2ff]" onClick={() => { onAbout(); onClose(); }}>
          About DevOS
        </button>
      </div>
    </div>
  );
}
