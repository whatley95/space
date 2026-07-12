"use client";

import { Shortcut } from "@/types";
import { getDisplayUrl, normalizeUrl } from "@/lib/data";
import { ShortcutIcon } from "./ShortcutIcon";

interface AppSheetProps {
  shortcut: Shortcut | null;
  onClose: () => void;
  onOpen: (s: Shortcut) => void;
  onEdit: (s: Shortcut) => void;
  onDelete: (s: Shortcut) => void;
}

export function AppSheet({ shortcut, onClose, onOpen, onEdit, onDelete }: AppSheetProps) {
  if (!shortcut) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[105] bg-black/60 transition-opacity ${shortcut ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-[110] rounded-t-[24px] border-t border-white/10 bg-[#111216] px-5 pb-7 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-transform duration-300 ${
          shortcut ? "translate-y-0" : "translate-y-[110%]"
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-white/15" />
        <div className="mb-6 flex items-center gap-4">
          <ShortcutIcon name={shortcut.name} url={shortcut.url} color={shortcut.color} size={70} className="rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.3)]" />
          <div>
            <h2 className="text-[22px] font-semibold">{shortcut.name}</h2>
            <p className="font-mono text-[13px] text-[#8b919c]">{getDisplayUrl(normalizeUrl(shortcut.url))}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <button
            className="w-full rounded-[10px] bg-[#00f2ff] py-3.5 text-[15px] font-semibold text-[#0b0c10] transition-opacity active:opacity-80"
            onClick={() => { onOpen(shortcut); onClose(); }}
          >
            Open Website
          </button>
          <button
            className="w-full rounded-[10px] bg-white/[0.06] py-3.5 text-[15px] font-semibold text-[#e6e6e6] transition-opacity active:opacity-80"
            onClick={() => { onEdit(shortcut); onClose(); }}
          >
            Edit
          </button>
          <button
            className="w-full rounded-[10px] bg-[rgba(255,77,109,0.12)] py-3.5 text-[15px] font-semibold text-[#ff4d6d] transition-opacity active:opacity-80"
            onClick={() => { onDelete(shortcut); onClose(); }}
          >
            Delete
          </button>
        </div>
        <button
          className="mt-3 w-full rounded-[10px] bg-white/5 py-3.5 text-[15px] font-semibold text-[#e6e6e6]"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
