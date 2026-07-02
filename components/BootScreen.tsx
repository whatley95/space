"use client";

import { useEffect, useState } from "react";

export function BootScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#0b0c10] transition-opacity duration-500 ${
        hidden ? "pointer-events-none opacity-0" : ""
      }`}
    >
      <div className="boot-logo mb-4 text-6xl text-[#00f2ff]">&lt;/&gt;</div>
      <div className="mb-8 text-sm font-semibold uppercase tracking-[3px] text-[#8b919c]">
        DevOS Workspace
      </div>
      <div className="h-[3px] w-[220px] overflow-hidden rounded-sm bg-white/10">
        <div className="boot-progress h-full bg-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.25)]" />
      </div>
    </div>
  );
}
