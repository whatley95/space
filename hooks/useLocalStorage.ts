"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setValue(JSON.parse(saved));
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
