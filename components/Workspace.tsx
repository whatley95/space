"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Shortcut, WindowState } from "@/types";
import { DEFAULT_SHORTCUTS, isEmbeddable, normalizeUrl } from "@/lib/data";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BootScreen } from "./BootScreen";
import { Wallpaper } from "./Wallpaper";
import { DesktopView } from "./DesktopView";
import { MobileView } from "./MobileView";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { CommandPalette } from "./CommandPalette";
import { ShortcutModal } from "./ShortcutModal";
import { AboutModal } from "./AboutModal";
import { Toast } from "./Toast";

export function Workspace() {
  const [shortcuts, setShortcuts, hydrated] = useLocalStorage<Shortcut[]>("devos_shortcuts", DEFAULT_SHORTCUTS);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZ, setNextZ] = useState(100);

  const [startOpen, setStartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [modalShortcut, setModalShortcut] = useState<Shortcut | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [contextMenu, setContextMenu] = useState<{ shortcut: Shortcut; x: number; y: number } | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }, []);

  const openInTab = useCallback((shortcut: Shortcut) => {
    window.open(normalizeUrl(shortcut.url), "_blank");
  }, []);

  const openWindow = useCallback(
    (shortcut: Shortcut) => {
      if (shortcut.launchMode === "tab" || !isEmbeddable(shortcut.url)) {
        openInTab(shortcut);
        if (!isEmbeddable(shortcut.url)) {
          showToast(`${shortcut.name} opened in a new tab (blocks embedding)`);
        }
        return;
      }

      const existing = windows.find((w) => w.shortcutId === shortcut.id && !w.minimized);
      if (existing) {
        focusWindow(existing.id);
        return;
      }

      const id = `win-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const offset = (windows.length % 6) * 24;
      const width = Math.min(980, window.innerWidth - 60);
      const height = Math.min(720, window.innerHeight - 120);
      const x = Math.max(20, (window.innerWidth - width) / 2 + offset - 60);
      const y = Math.max(20, (window.innerHeight - height) / 2 + offset - 40);

      const newWindow: WindowState = {
        id,
        shortcutId: shortcut.id,
        minimized: false,
        maximized: false,
        x,
        y,
        width,
        height,
      };
      setWindows((prev) => [...prev, newWindow]);
      setActiveWindowId(id);
      setNextZ((z) => z + 1);
    },
    [windows, openInTab, showToast]
  );

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setNextZ((z) => z + 1);
  }, []);

  const minimizeWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
      );
      if (activeWindowId === id) {
        const others = windows.filter((w) => !w.minimized && w.id !== id);
        setActiveWindowId(others.length ? others[others.length - 1].id : null);
      }
    },
    [activeWindowId, windows]
  );

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: false } : w))
    );
    setActiveWindowId(id);
    setNextZ((z) => z + 1);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return { ...w, maximized: false, ...(w.prev ? { x: w.prev.x, y: w.prev.y, width: w.prev.width, height: w.prev.height } : {}) };
        }
        return {
          ...w,
          maximized: true,
          prev: { x: w.x, y: w.y, width: w.width, height: w.height },
        };
      })
    );
  }, []);

  const closeWindow = useCallback(
    (id: string) => {
      setWindows((prev) => prev.filter((w) => w.id !== id));
      if (activeWindowId === id) {
        const others = windows.filter((w) => !w.minimized && w.id !== id);
        setActiveWindowId(others.length ? others[others.length - 1].id : null);
      }
    },
    [activeWindowId, windows]
  );

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const handlePinClick = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id);
      if (!win) return;
      if (win.minimized || activeWindowId !== id) {
        restoreWindow(id);
      } else {
        minimizeWindow(id);
      }
    },
    [activeWindowId, windows, minimizeWindow, restoreWindow]
  );

  const handleSaveShortcut = useCallback(
    (data: Omit<Shortcut, "id"> & { id?: string }) => {
      if (data.id) {
        setShortcuts((prev) =>
          prev.map((s) =>
            s.id === data.id
              ? { ...s, name: data.name, url: data.url, category: data.category, color: data.color, launchMode: data.launchMode }
              : s
          )
        );
        showToast("Shortcut updated");
      } else {
        const newShortcut: Shortcut = {
          id: Date.now().toString(),
          name: data.name,
          url: data.url,
          category: data.category,
          color: data.color,
          launchMode: data.launchMode,
        };
        setShortcuts((prev) => [...prev, newShortcut]);
        showToast("Shortcut added");
      }
      setModalOpen(false);
    },
    [setShortcuts, showToast]
  );

  const handleDeleteShortcut = useCallback(
    (shortcut: Shortcut) => {
      if (!confirm(`Delete "${shortcut.name}"?`)) return;
      setShortcuts((prev) => prev.filter((s) => s.id !== shortcut.id));
      windows.filter((w) => w.shortcutId === shortcut.id).forEach((w) => closeWindow(w.id));
      showToast("Shortcut deleted");
    },
    [setShortcuts, windows, closeWindow, showToast]
  );

  const handleContextMenu = useCallback((shortcut: Shortcut, x: number, y: number) => {
    setContextMenu({ shortcut, x, y });
  }, []);

  const handleOpenUrl = useCallback((shortcut: Shortcut) => {
    window.open(normalizeUrl(shortcut.url), "_blank");
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setStartOpen(false);
        setContextMenu(null);
        if (activeWindowId) closeWindow(activeWindowId);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeWindowId, closeWindow]);

  useEffect(() => {
    const onClick = () => setContextMenu(null);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!hydrated) {
    return <div className="h-full w-full bg-[#0b0c10]" />;
  }

  return (
    <>
      <BootScreen />
      <Wallpaper />

      <DesktopView
        shortcuts={shortcuts}
        windows={windows}
        activeWindowId={activeWindowId}
        contextMenu={contextMenu}
        nextZ={nextZ}
        onOpenWindow={openWindow}
        onFocusWindow={focusWindow}
        onMinimizeWindow={minimizeWindow}
        onMaximizeWindow={maximizeWindow}
        onCloseWindow={closeWindow}
        onMoveWindow={moveWindow}
        onEditShortcut={(s) => { setModalShortcut(s); setModalOpen(true); }}
        onDeleteShortcut={handleDeleteShortcut}
        onContextMenu={handleContextMenu}
        onCloseContextMenu={() => setContextMenu(null)}
      />

      <MobileView
        shortcuts={shortcuts}
        onAddShortcut={() => { setModalShortcut(null); setModalOpen(true); }}
        onEditShortcut={(s) => { setModalShortcut(s); setModalOpen(true); }}
        onDeleteShortcut={handleDeleteShortcut}
        onOpenUrl={handleOpenUrl}
      />

      <Taskbar
        windows={windows}
        shortcuts={shortcuts}
        activeWindowId={activeWindowId}
        startOpen={startOpen}
        onToggleStart={() => setStartOpen((s) => !s)}
        onOpenPalette={() => setPaletteOpen(true)}
        onAddShortcut={() => { setModalShortcut(null); setModalOpen(true); }}
        onPinClick={handlePinClick}
      />

      <StartMenu
        open={startOpen}
        shortcuts={shortcuts}
        onOpenWindow={openWindow}
        onAddShortcut={() => { setModalShortcut(null); setModalOpen(true); setStartOpen(false); }}
        onAbout={() => { setAboutOpen(true); setStartOpen(false); }}
        onClose={() => setStartOpen(false)}
      />

      <CommandPalette
        open={paletteOpen}
        shortcuts={shortcuts}
        onOpenWindow={openWindow}
        onClose={() => setPaletteOpen(false)}
      />

      <ShortcutModal
        shortcut={modalShortcut}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveShortcut}
      />

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <Toast message={toast} />
    </>
  );
}
