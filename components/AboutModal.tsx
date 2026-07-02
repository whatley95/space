"use client";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 px-5" onClick={onClose}>
      <div className="w-full max-w-[360px] overflow-hidden rounded-[14px] border border-white/10 bg-[#111216] text-center shadow-[0_30px_90px_rgba(0,0,0,0.55)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <h2 className="font-mono text-base">About DevOS</h2>
          <button className="text-2xl text-[#8b919c] hover:text-[#e6e6e6]" onClick={onClose}>&times;</button>
        </div>
        <div className="p-5 text-center">
          <div className="boot-logo mb-3 text-5xl text-[#00f2ff]">&lt;/&gt;</div>
          <p className="mb-5 text-sm text-[#8b919c]">A developer-focused workspace that behaves like a desktop OS.</p>
          <ul className="inline-block list-disc pl-5 text-left font-mono text-xs leading-7 text-[#8b919c]">
            <li>Ctrl/Cmd + K — Command Palette</li>
            <li>Right-click icon — Context menu</li>
            <li>Drag windows by titlebar</li>
            <li>Mobile — app drawer with category filters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
