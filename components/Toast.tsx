"use client";

interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      className={`fixed bottom-20 left-1/2 z-[200] -translate-x-1/2 rounded-full border border-white/10 bg-[#181a20] px-5 py-2.5 font-mono text-xs text-[#e6e6e6] transition-all duration-200 ${
        message ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}
