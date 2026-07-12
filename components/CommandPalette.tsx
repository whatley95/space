"use client";

import { useState } from "react";
import { Shortcut } from "@/types";
import { getDisplayUrl, normalizeUrl } from "@/lib/data";
import { ShortcutIcon } from "./ShortcutIcon";

interface CommandPaletteProps {
  open: boolean;
  shortcuts: Shortcut[];
  onOpenWindow: (s: Shortcut) => void;
  onClose: () => void;
}

export function CommandPalette({ open, shortcuts, onOpenWindow, onClose }: CommandPaletteProps) {
  const [term, setTerm] = useState("");
  const [selected, setSelected] = useState(0);


  const items = shortcuts.filter(
    (s) => s.name.toLowerCase().includes(term.toLowerCase()) || s.category.toLowerCase().includes(term.toLowerCase())
  );


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const active = items[selected];
      if (active) {
        onOpenWindow(active);
        onClose();
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center bg-black/50 pt-[120px]" onClick={onClose}>
      <div className="palette-box w-full max-w-[560px] overflow-hidden rounded-[14px] border border-white/10 bg-[#111216]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <span className="font-mono text-lg font-bold text-[#00f2ff]">&gt;</span>
          <input
            type="text"
            className="flex-1 bg-transparent text-base text-[#e6e6e6] outline-none placeholder:text-[#8b919c]"
            placeholder="Search apps, run command..."
            value={term}
            autoFocus
            onChange={(e) => { setTerm(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="rounded bg-white/[0.06] px-1.5 py-1 font-mono text-[11px] text-[#8b919c]">ESC</kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {items.length ? (
            items.map((shortcut, idx) => (
              <div
                key={shortcut.id}
                className={`flex cursor-pointer items-center gap-3.5 border-l-2 px-4 py-3 transition-colors ${
                  selected === idx ? "border-l-[#00f2ff] bg-white/5" : "border-l-transparent hover:bg-white/5"
                }`}
                onClick={() => { onOpenWindow(shortcut); onClose(); }}
                onMouseEnter={() => setSelected(idx)}
              >
                <ShortcutIcon name={shortcut.name} url={shortcut.url} color={shortcut.color} size={34} className="rounded-lg" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{shortcut.name}</div>
                  <div className="font-mono text-xs text-[#8b919c]">
                    {shortcut.category} · {getDisplayUrl(normalizeUrl(shortcut.url))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-[#8b919c]">No commands found</div>
          )}
        </div>
      </div>
    </div>
  );
}
