"use client";

import { useState, useMemo } from "react";
import { Shortcut } from "@/types";
import { getGreeting, getInitials } from "@/lib/data";
import { AppSheet } from "./AppSheet";

interface MobileViewProps {
  shortcuts: Shortcut[];
  onAddShortcut: () => void;
  onEditShortcut: (s: Shortcut) => void;
  onDeleteShortcut: (s: Shortcut) => void;
  onOpenUrl: (s: Shortcut) => void;
}

export function MobileView({ shortcuts, onAddShortcut, onEditShortcut, onDeleteShortcut, onOpenUrl }: MobileViewProps) {
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Shortcut | null>(null);

  const categories = useMemo(() => ["All", ...Array.from(new Set(shortcuts.map((s) => s.category).sort()))], [shortcuts]);

  const items = shortcuts.filter((s) => {
    const term = filter.toLowerCase();
    const matchesTerm = s.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term);
    const matchesCategory = category === "All" || s.category === category;
    return matchesTerm && matchesCategory;
  });

  const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="view absolute inset-0 flex flex-col overflow-y-auto px-4 pb-6 pt-3 md:hidden">
      <div className="flex items-center justify-between pb-2 pt-1 font-mono text-xs font-semibold text-[#8b919c]">
        <span>{time}</span>
        <div className="flex gap-1.5">
          <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
        </div>
      </div>

      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 font-mono text-xs text-[#00f2ff]">{getGreeting()}</div>
          <h1 className="text-3xl font-bold tracking-tight">DevOS</h1>
        </div>
        <button
          className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] text-[#e6e6e6] transition-colors hover:bg-white/10"
          onClick={onAddShortcut}
          aria-label="Add shortcut"
        >
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
      </div>

      <div className="mb-4 flex h-[46px] items-center gap-2.5 rounded-[14px] border border-white/10 bg-black/25 px-3.5 text-[#8b919c]">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input
          type="text"
          className="flex-1 bg-transparent text-[15px] text-[#e6e6e6] outline-none placeholder:text-[#8b919c]"
          placeholder="Search apps & websites..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none]">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all ${
              category === cat
                ? "border border-[#00f2ff] bg-[#00f2ff] text-[#0b0c10] shadow-[0_0_20px_rgba(0,242,255,0.25)]"
                : "border border-white/10 bg-white/[0.04] text-[#e6e6e6]"
            }`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-x-3 gap-y-4 pb-6 [grid-template-columns:repeat(4,1fr)]">
        {items.map((shortcut) => (
          <button
            key={shortcut.id}
            className="flex flex-col items-center gap-2 active:scale-95"
            onClick={() => setSelected(shortcut)}
          >
            <div
              className="flex h-[62px] w-[62px] items-center justify-center rounded-[18px] font-mono text-[26px] font-bold text-white shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
              style={{ background: shortcut.color }}
            >
              {getInitials(shortcut.name)}
            </div>
            <div className="line-clamp-2 max-w-[76px] text-center text-xs leading-tight">{shortcut.name}</div>
          </button>
        ))}
      </div>

      <AppSheet
        shortcut={selected}
        onClose={() => setSelected(null)}
        onOpen={onOpenUrl}
        onEdit={onEditShortcut}
        onDelete={onDeleteShortcut}
      />
    </div>
  );
}
