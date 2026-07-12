"use client";

import { useState } from "react";
import { getFaviconUrl, getInitials } from "@/lib/data";

interface ShortcutIconProps {
  name: string;
  url: string;
  color: string;
  size?: number;
  className?: string;
}

export function ShortcutIcon({ name, url, color, size = 54, className = "" }: ShortcutIconProps) {
  const [errored, setErrored] = useState(false);
  const favicon = getFaviconUrl(url);
  const showFavicon = Boolean(favicon) && !errored;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size, background: color }}
    >
      {showFavicon ? (
        <div className="flex h-[78%] w-[78%] items-center justify-center rounded-[22%] bg-white/95 p-[14%] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={favicon}
            alt={name}
            className="h-full w-full object-contain"
            loading="lazy"
            onError={() => setErrored(true)}
          />
        </div>
      ) : (
        <span
          className="font-mono font-bold leading-none text-white"
          style={{ fontSize: Math.round(size * 0.38) }}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
