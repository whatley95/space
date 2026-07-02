"use client";

import { useEffect, useRef } from "react";
import { Shortcut } from "@/types";

interface ContextMenuProps {
  shortcut: Shortcut | null;
  x: number;
  y: number;
  onOpen: (s: Shortcut) => void;
  onEdit: (s: Shortcut) => void;
  onDelete: (s: Shortcut) => void;
  onClose: () => void;
}

export function ContextMenu({ shortcut, x, y, onOpen, onEdit, onDelete, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onClose]);

  if (!shortcut) return null;

  const left = Math.min(x, typeof window !== "undefined" ? window.innerWidth - 150 : x);
  const top = Math.min(y, typeof window !== "undefined" ? window.innerHeight - 120 : y);

  return (
    <div
      ref={ref}
      className="context-menu fixed z-[300] min-w-[140px] scale-100 rounded-[10px] border border-white/10 bg-[#181a20] p-1.5 opacity-100 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-full rounded-md px-3 py-2 text-left text-[13px] text-[#e6e6e6] hover:bg-white/10"
        onClick={() => { onOpen(shortcut); onClose(); }}
      >
        Open
      </button>
      <button
        className="w-full rounded-md px-3 py-2 text-left text-[13px] text-[#e6e6e6] hover:bg-white/10"
        onClick={() => { onEdit(shortcut); onClose(); }}
      >
        Edit
      </button>
      <div className="my-1.5 h-px bg-white/10" />
      <button
        className="w-full rounded-md px-3 py-2 text-left text-[13px] text-[#ff4d6d] hover:bg-[rgba(255,77,109,0.12)]"
        onClick={() => { onDelete(shortcut); onClose(); }}
      >
        Delete
      </button>
    </div>
  );
}
