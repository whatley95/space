"use client";

import { useEffect, useState } from "react";
import { Shortcut, ColorOption } from "@/types";
import { COLORS } from "@/lib/data";

interface ShortcutModalProps {
  shortcut: Shortcut | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Shortcut, "id"> & { id?: string }) => void;
}

export function ShortcutModal({ shortcut, open, onClose, onSave }: ShortcutModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Code");
  const [color, setColor] = useState(COLORS[0].value);
  const [launchMode, setLaunchMode] = useState<"window" | "tab">("window");

  useEffect(() => {
    if (open) {
      setName(shortcut?.name ?? "");
      setUrl(shortcut?.url ?? "");
      setCategory(shortcut?.category ?? "Code");
      setColor(shortcut?.color ?? COLORS[0].value);
      setLaunchMode(shortcut?.launchMode ?? "window");
    }
  }, [open, shortcut]);

  if (!open) return null;

  const isEdit = !!shortcut;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onSave({ id: shortcut?.id, name: name.trim(), url: url.trim(), category, color, launchMode });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 px-5">
      <div className="w-full max-w-[420px] overflow-hidden rounded-[14px] border border-white/10 bg-[#111216] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <h2 className="font-mono text-base">{isEdit ? "Edit Shortcut" : "Add Shortcut"}</h2>
          <button className="text-2xl text-[#8b919c] hover:text-[#e6e6e6]" onClick={onClose}>&times;</button>
        </div>
        <form className="p-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1.5 block font-mono text-xs text-[#8b919c]">Name</label>
            <input
              type="text"
              className="w-full rounded-[10px] border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-[#e6e6e6] outline-none focus:border-[#00f2ff]"
              placeholder="e.g. GitHub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block font-mono text-xs text-[#8b919c]">Website URL</label>
            <input
              type="url"
              className="w-full rounded-[10px] border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-[#e6e6e6] outline-none focus:border-[#00f2ff]"
              placeholder="https://github.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block font-mono text-xs text-[#8b919c]">Category</label>
            <select
              className="w-full rounded-[10px] border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-[#e6e6e6] outline-none focus:border-[#00f2ff]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Code</option>
              <option>Design</option>
              <option>Productivity</option>
              <option>Cloud</option>
              <option>Media</option>
              <option>Social</option>
              <option>Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block font-mono text-xs text-[#8b919c]">Open In</label>
            <select
              className="w-full rounded-[10px] border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-[#e6e6e6] outline-none focus:border-[#00f2ff]"
              value={launchMode}
              onChange={(e) => setLaunchMode(e.target.value as "window" | "tab")}
            >
              <option value="window">Desktop window</option>
              <option value="tab">New browser tab</option>
            </select>
            <p className="mt-1.5 text-[11px] text-[#8b919c]">
              Some sites (GitHub, Spotify, etc.) block iframes and will always open in a tab.
            </p>
          </div>
          <div className="mb-6">
            <label className="mb-2 block font-mono text-xs text-[#8b919c]">Accent Color</label>
            <div className="flex flex-wrap gap-2.5">
              {COLORS.map((c: ColorOption) => (
                <button
                  key={c.value}
                  type="button"
                  className={`h-[30px] w-[30px] rounded-full transition-transform hover:scale-110 ${color === c.value ? "ring-2 ring-white" : ""}`}
                  style={{ background: c.value }}
                  title={c.name}
                  onClick={() => setColor(c.value)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              className="rounded-[10px] bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-[#e6e6e6]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[10px] bg-[#e6e6e6] px-4 py-2.5 text-sm font-semibold text-[#0b0c10]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
