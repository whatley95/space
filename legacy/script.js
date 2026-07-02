const COLORS = [
  { name: 'cyan', value: '#00f2ff' },
  { name: 'green', value: '#00ff9d' },
  { name: 'purple', value: '#c084fc' },
  { name: 'blue', value: '#60a5fa' },
  { name: 'orange', value: '#fb923c' },
  { name: 'red', value: '#ff4d6d' },
  { name: 'yellow', value: '#ffd166' },
  { name: 'pink', value: '#f472b6' },
  { name: 'slate', value: '#64748b' },
  { name: 'white', value: '#e6e6e6' },
];

const DEFAULT_SHORTCUTS = [
  { id: '1', name: 'GitHub', url: 'https://github.com', category: 'Code', color: '#24292f' },
  { id: '2', name: 'VS Code Web', url: 'https://vscode.dev', category: 'Code', color: '#007acc' },
  { id: '3', name: 'Vercel', url: 'https://vercel.com', category: 'Cloud', color: '#000000' },
  { id: '4', name: 'Figma', url: 'https://www.figma.com', category: 'Design', color: '#f24e1e' },
  { id: '5', name: 'Notion', url: 'https://www.notion.so', category: 'Productivity', color: '#000000' },
  { id: '6', name: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'Code', color: '#f48024' },
  { id: '7', name: 'MDN', url: 'https://developer.mozilla.org', category: 'Code', color: '#000000' },
  { id: '8', name: 'Dribbble', url: 'https://dribbble.com', category: 'Design', color: '#ea4c89' },
  { id: '9', name: 'CodePen', url: 'https://codepen.io', category: 'Code', color: '#1e1f26' },
  { id: '10', name: 'Spotify', url: 'https://open.spotify.com', category: 'Media', color: '#1db954' },
];

const state = {
  shortcuts: [],
  windows: [],
  activeWindowId: null,
  filter: '',
  category: 'All',
  selectedShortcut: null,
  selectedColor: COLORS[0].value,
  nextZ: 100,
};

const $ = (id) => document.getElementById(id);

function loadShortcuts() {
  try {
    const saved = localStorage.getItem('devos_shortcuts');
    state.shortcuts = saved ? JSON.parse(saved) : [...DEFAULT_SHORTCUTS];
  } catch {
    state.shortcuts = [...DEFAULT_SHORTCUTS];
  }
}

function saveShortcuts() {
  localStorage.setItem('devos_shortcuts', JSON.stringify(state.shortcuts));
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function normalizeUrl(url) {
  let u = url.trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u;
}

function getDisplayUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function createIconEl(shortcut, cls = 'desktop-icon') {
  const div = document.createElement('div');
  div.className = cls;
  div.style.background = shortcut.color;
  div.textContent = getInitials(shortcut.name);
  return div;
}

// ============= WALLPAPER =============
function initWallpaper() {
  const canvas = $('wallpaper');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    const count = Math.floor((width * height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0b0c10');
    gradient.addColorStop(0.5, '#0d1117');
    gradient.addColorStop(1, '#111216');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(0, 242, 255, 0.18)';
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(0, 242, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < particles.length && connections < 3; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          connections++;
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

// ============= RENDERERS =============
function filteredShortcuts() {
  const term = state.filter.toLowerCase();
  return state.shortcuts.filter((s) => {
    const matchesTerm = s.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term);
    const matchesCategory = state.category === 'All' || s.category === state.category;
    return matchesTerm && matchesCategory;
  });
}

function renderDesktopIcons() {
  const grid = $('desktopIcons');
  grid.innerHTML = '';
  filteredShortcuts().forEach((shortcut) => {
    const item = document.createElement('div');
    item.className = 'desktop-item';
    item.dataset.id = shortcut.id;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.title = shortcut.name;
    item.appendChild(createIconEl(shortcut, 'desktop-icon'));
    const label = document.createElement('div');
    label.className = 'desktop-label';
    label.textContent = shortcut.name;
    item.appendChild(label);

    item.addEventListener('click', () => {
      document.querySelectorAll('.desktop-item').forEach((el) => el.classList.remove('focused'));
      item.classList.add('focused');
      openWindow(shortcut);
    });
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter') openWindow(shortcut); });
    item.addEventListener('contextmenu', (e) => showContextMenu(e, shortcut));
    grid.appendChild(item);
  });
}

function renderMobile() {
  const grid = $('mobileGrid');
  grid.innerHTML = '';
  filteredShortcuts().forEach((shortcut) => {
    const item = document.createElement('div');
    item.className = 'mobile-item';
    item.appendChild(createIconEl(shortcut, 'mobile-icon'));
    const label = document.createElement('div');
    label.className = 'mobile-label';
    label.textContent = shortcut.name;
    item.appendChild(label);
    item.addEventListener('click', () => openAppSheet(shortcut));
    grid.appendChild(item);
  });
}

function renderCategories() {
  const container = $('mobileCategories');
  container.innerHTML = '';
  const categories = ['All', ...new Set(state.shortcuts.map((s) => s.category).sort())];
  categories.forEach((cat) => {
    const chip = document.createElement('button');
    chip.className = 'category-chip' + (state.category === cat ? ' active' : '');
    chip.textContent = cat;
    chip.addEventListener('click', () => {
      state.category = cat;
      renderCategories();
      renderMobile();
    });
    container.appendChild(chip);
  });
}

function renderColorPicker() {
  const picker = $('colorPicker');
  picker.innerHTML = '';
  COLORS.forEach((c) => {
    const opt = document.createElement('div');
    opt.className = 'color-option' + (state.selectedColor === c.value ? ' selected' : '');
    opt.style.background = c.value;
    opt.title = c.name;
    opt.addEventListener('click', () => {
      state.selectedColor = c.value;
      renderColorPicker();
    });
    picker.appendChild(opt);
  });
}

function renderStartMenu() {
  const container = $('startApps');
  container.innerHTML = '';
  const term = ($('startSearch')?.value || '').toLowerCase();
  const items = state.shortcuts
    .filter((s) => s.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term))
    .slice(0, 12);
  items.forEach((shortcut) => {
    const app = document.createElement('div');
    app.className = 'start-app';
    const icon = createIconEl(shortcut, 'start-app-icon');
    app.appendChild(icon);
    const label = document.createElement('div');
    label.className = 'start-app-label';
    label.textContent = shortcut.name;
    app.appendChild(label);
    app.addEventListener('click', () => {
      openWindow(shortcut);
      toggleStartMenu(false);
    });
    container.appendChild(app);
  });
  if (!items.length) {
    container.innerHTML = '<div class="palette-empty">No apps found</div>';
  }
}

function renderTaskbar() {
  const pins = $('taskbarPins');
  pins.innerHTML = '';
  state.windows.forEach((win) => {
    const shortcut = state.shortcuts.find((s) => s.id === win.shortcutId);
    if (!shortcut) return;
    const pin = document.createElement('button');
    pin.className = 'taskbar-pin' + (state.activeWindowId === win.id ? ' active' : '');
    pin.title = shortcut.name;
    pin.style.background = shortcut.color;
    pin.textContent = getInitials(shortcut.name);
    pin.addEventListener('click', () => {
      if (win.minimized || state.activeWindowId !== win.id) {
        focusWindow(win.id);
        restoreWindow(win.id);
      } else {
        minimizeWindow(win.id);
      }
    });
    pins.appendChild(pin);
  });
}

function renderAll() {
  renderDesktopIcons();
  renderMobile();
  renderCategories();
  renderStartMenu();
  renderTaskbar();
}

// ============= WINDOWS =============
function openWindow(shortcut) {
  const existing = state.windows.find((w) => w.shortcutId === shortcut.id && !w.minimized);
  if (existing) {
    focusWindow(existing.id);
    return;
  }

  const id = 'win-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  const offset = (state.windows.length % 6) * 24;
  const width = Math.min(980, window.innerWidth - 60);
  const height = Math.min(720, window.innerHeight - 120);
  const x = Math.max(20, (window.innerWidth - width) / 2 + offset - 60);
  const y = Math.max(20, (window.innerHeight - height) / 2 + offset - 40);

  const win = {
    id,
    shortcutId: shortcut.id,
    minimized: false,
    x,
    y,
    width,
    height,
  };
  state.windows.push(win);
  createWindowEl(win, shortcut);
  focusWindow(id);
  renderTaskbar();
}

function createWindowEl(win, shortcut) {
  const url = normalizeUrl(shortcut.url);
  const el = document.createElement('div');
  el.className = 'window';
  el.id = win.id;
  el.style.left = win.x + 'px';
  el.style.top = win.y + 'px';
  el.style.width = win.width + 'px';
  el.style.height = win.height + 'px';
  el.style.zIndex = ++state.nextZ;
  el.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title">
        <span class="window-favicon" style="background:${shortcut.color}"></span>
        <span>${escapeHtml(shortcut.name)}</span>
      </div>
      <div class="window-controls">
        <button class="win-minimize" title="Minimize">—</button>
        <button class="win-maximize" title="Maximize">□</button>
        <button class="win-close" title="Close">×</button>
      </div>
    </div>
    <div class="window-addressbar">
      <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      <span class="window-url">${escapeHtml(url)}</span>
    </div>
    <div class="window-frame">
      <iframe sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation" src="${url}"></iframe>
    </div>
  `;

  el.querySelector('.win-minimize').addEventListener('click', () => minimizeWindow(win.id));
  el.querySelector('.win-maximize').addEventListener('click', () => maximizeWindow(win.id));
  el.querySelector('.win-close').addEventListener('click', () => closeWindow(win.id));

  el.querySelector('.window-titlebar').addEventListener('mousedown', (e) => startDrag(e, win.id));
  el.addEventListener('mousedown', () => focusWindow(win.id));

  $('windowsContainer').appendChild(el);
}

function getWindowEl(id) { return document.getElementById(id); }

function focusWindow(id) {
  const el = getWindowEl(id);
  if (!el) return;
  document.querySelectorAll('.window').forEach((w) => w.classList.remove('active'));
  el.classList.add('active');
  el.style.zIndex = ++state.nextZ;
  state.activeWindowId = id;
  renderTaskbar();
}

function minimizeWindow(id) {
  const win = state.windows.find((w) => w.id === id);
  if (!win) return;
  win.minimized = true;
  getWindowEl(id).classList.add('minimized');
  if (state.activeWindowId === id) {
    const others = state.windows.filter((w) => !w.minimized);
    state.activeWindowId = others.length ? others[others.length - 1].id : null;
  }
  renderTaskbar();
}

function restoreWindow(id) {
  const win = state.windows.find((w) => w.id === id);
  if (!win) return;
  win.minimized = false;
  getWindowEl(id).classList.remove('minimized');
  focusWindow(id);
}

function maximizeWindow(id) {
  const el = getWindowEl(id);
  const win = state.windows.find((w) => w.id === id);
  if (!el || !win) return;
  if (win.maximized) {
    el.style.left = win.prev.x + 'px';
    el.style.top = win.prev.y + 'px';
    el.style.width = win.prev.width + 'px';
    el.style.height = win.prev.height + 'px';
    win.maximized = false;
  } else {
    win.prev = { x: win.x, y: win.y, width: win.width, height: win.height };
    el.style.left = '8px';
    el.style.top = '8px';
    el.style.width = 'calc(100vw - 16px)';
    el.style.height = 'calc(100vh - 76px)';
    win.maximized = true;
  }
}

function closeWindow(id) {
  const el = getWindowEl(id);
  if (el) el.remove();
  state.windows = state.windows.filter((w) => w.id !== id);
  if (state.activeWindowId === id) {
    const others = state.windows.filter((w) => !w.minimized);
    state.activeWindowId = others.length ? others[others.length - 1].id : null;
  }
  renderTaskbar();
}

let drag = null;
function startDrag(e, id) {
  if (e.button !== 0) return;
  const win = state.windows.find((w) => w.id === id);
  if (!win || win.maximized) return;
  focusWindow(id);
  drag = {
    id,
    offsetX: e.clientX - win.x,
    offsetY: e.clientY - win.y,
  };
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(e) {
  if (!drag) return;
  const win = state.windows.find((w) => w.id === drag.id);
  if (!win) return;
  win.x = e.clientX - drag.offsetX;
  win.y = e.clientY - drag.offsetY;
  const el = getWindowEl(drag.id);
  el.style.left = win.x + 'px';
  el.style.top = win.y + 'px';
}

function stopDrag() {
  drag = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

// ============= CONTEXT MENU =============
function showContextMenu(e, shortcut) {
  e.preventDefault();
  e.stopPropagation();
  const menu = $('contextMenu');
  menu.classList.add('open');
  menu.style.left = Math.min(e.clientX, window.innerWidth - 150) + 'px';
  menu.style.top = Math.min(e.clientY, window.innerHeight - 120) + 'px';

  $('ctxOpen').onclick = () => {
    openWindow(shortcut);
    hideContextMenu();
  };
  $('ctxEdit').onclick = () => {
    openShortcutModal(shortcut);
    hideContextMenu();
  };
  $('ctxDelete').onclick = () => {
    deleteShortcutById(shortcut.id);
    hideContextMenu();
  };
}

function hideContextMenu() {
  $('contextMenu').classList.remove('open');
}

// ============= COMMAND PALETTE =============
function togglePalette(show) {
  const palette = $('commandPalette');
  if (show) {
    palette.classList.add('open');
    $('paletteInput').value = '';
    renderPaletteResults('');
    setTimeout(() => $('paletteInput').focus(), 50);
  } else {
    palette.classList.remove('open');
  }
}

function renderPaletteResults(term) {
  const container = $('paletteResults');
  container.innerHTML = '';
  const lower = term.toLowerCase();
  const items = state.shortcuts.filter((s) =>
    s.name.toLowerCase().includes(lower) || s.category.toLowerCase().includes(lower)
  );

  if (!items.length) {
    container.innerHTML = '<div class="palette-empty">No commands found</div>';
    return;
  }

  items.forEach((shortcut, idx) => {
    const row = document.createElement('div');
    row.className = 'palette-item' + (idx === 0 ? ' selected' : '');
    row.innerHTML = `
      <div class="palette-item-icon" style="background:${shortcut.color}">${getInitials(shortcut.name)}</div>
      <div class="palette-item-info">
        <div class="palette-item-name">${escapeHtml(shortcut.name)}</div>
        <div class="palette-item-meta">${escapeHtml(shortcut.category)} · ${escapeHtml(getDisplayUrl(normalizeUrl(shortcut.url)))}</div>
      </div>
    `;
    row.addEventListener('click', () => {
      openWindow(shortcut);
      togglePalette(false);
    });
    row.addEventListener('mouseenter', () => {
      container.querySelectorAll('.palette-item').forEach((r) => r.classList.remove('selected'));
      row.classList.add('selected');
    });
    container.appendChild(row);
  });
}

// ============= START MENU =============
function toggleStartMenu(show) {
  const menu = $('startMenu');
  const btn = $('startBtn');
  if (show) {
    menu.classList.add('open');
    btn.classList.add('active');
    $('startSearch').value = '';
    renderStartMenu();
  } else {
    menu.classList.remove('open');
    btn.classList.remove('active');
  }
}

// ============= MOBILE SHEET =============
function openAppSheet(shortcut) {
  state.selectedShortcut = shortcut;
  $('sheetTitle').textContent = shortcut.name;
  $('sheetUrl').textContent = getDisplayUrl(normalizeUrl(shortcut.url));
  const icon = createIconEl(shortcut, 'sheet-icon');
  const old = $('sheetIcon');
  old.parentNode.replaceChild(icon, old);
  icon.id = 'sheetIcon';
  $('appSheet').classList.add('open');
  $('sheetOverlay').classList.add('open');
}

function closeAppSheet() {
  $('appSheet').classList.remove('open');
  $('sheetOverlay').classList.remove('open');
  state.selectedShortcut = null;
}

// ============= MODALS =============
function openShortcutModal(shortcut = null) {
  const isEdit = !!shortcut;
  $('modalTitle').textContent = isEdit ? 'Edit Shortcut' : 'Add Shortcut';
  $('shortcutId').value = shortcut?.id || '';
  $('shortcutName').value = shortcut?.name || '';
  $('shortcutUrl').value = shortcut?.url || '';
  $('shortcutCategory').value = shortcut?.category || 'Code';
  state.selectedColor = shortcut?.color || COLORS[0].value;
  renderColorPicker();
  $('shortcutModal').classList.add('open');
  setTimeout(() => $('shortcutName').focus(), 50);
}

function closeShortcutModal() {
  $('shortcutModal').classList.remove('open');
  $('shortcutForm').reset();
}

function handleSaveShortcut(e) {
  e.preventDefault();
  const id = $('shortcutId').value;
  const name = $('shortcutName').value.trim();
  const url = $('shortcutUrl').value.trim();
  const category = $('shortcutCategory').value;
  if (!name || !url) return;

  const data = {
    id: id || Date.now().toString(),
    name,
    url,
    category,
    color: state.selectedColor,
  };

  if (id) {
    const idx = state.shortcuts.findIndex((s) => s.id === id);
    if (idx !== -1) state.shortcuts[idx] = data;
  } else {
    state.shortcuts.push(data);
  }

  saveShortcuts();
  renderAll();
  closeShortcutModal();
  closeAppSheet();
  showToast(id ? 'Shortcut updated' : 'Shortcut added');
}

function deleteShortcut() {
  if (!state.selectedShortcut) return;
  deleteShortcutById(state.selectedShortcut.id);
  closeAppSheet();
}

function deleteShortcutById(id) {
  const shortcut = state.shortcuts.find((s) => s.id === id);
  if (!shortcut) return;
  if (!confirm(`Delete "${shortcut.name}"?`)) return;
  state.shortcuts = state.shortcuts.filter((s) => s.id !== id);
  state.windows.filter((w) => w.shortcutId === id).forEach((w) => closeWindow(w.id));
  saveShortcuts();
  renderAll();
  showToast('Shortcut deleted');
}

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function escapeHtml(str) {
  return str.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// ============= CLOCK =============
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  $('desktopClock').textContent = time;
  $('mobileClock').textContent = time;
}

// ============= BOOT =============
function finishBoot() {
  setTimeout(() => {
    $('bootScreen').classList.add('hidden');
  }, 1600);
}

// ============= INIT =============
function init() {
  loadShortcuts();
  initWallpaper();
  renderAll();
  updateClock();
  setInterval(updateClock, 1000);
  renderColorPicker();
  finishBoot();
  $('mobileGreeting').textContent = getGreeting();

  // Desktop search
  $('desktopSearch');
  // (no dedicated desktop search input in this design; command palette covers it)

  // Start menu
  $('startBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const open = $('startMenu').classList.contains('open');
    toggleStartMenu(!open);
  });
  $('startSearch').addEventListener('input', renderStartMenu);
  $('startAdd').addEventListener('click', () => {
    toggleStartMenu(false);
    openShortcutModal();
  });
  $('startAbout').addEventListener('click', () => {
    toggleStartMenu(false);
    $('aboutModal').classList.add('open');
  });

  // Command palette
  $('paletteBtn').addEventListener('click', () => togglePalette(true));
  $('paletteInput').addEventListener('input', (e) => renderPaletteResults(e.target.value));
  $('paletteInput').addEventListener('keydown', (e) => {
    const items = [...$('paletteResults').querySelectorAll('.palette-item')];
    const selected = items.findIndex((r) => r.classList.contains('selected'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items.forEach((r) => r.classList.remove('selected'));
      const next = items[(selected + 1) % items.length];
      if (next) next.classList.add('selected');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items.forEach((r) => r.classList.remove('selected'));
      const prev = items[(selected - 1 + items.length) % items.length];
      if (prev) prev.classList.add('selected');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const active = items.find((r) => r.classList.contains('selected'));
      if (active) active.click();
    }
  });

  // Add shortcut
  $('addShortcutDesktop').addEventListener('click', () => openShortcutModal());
  $('addShortcutMobile').addEventListener('click', () => openShortcutModal());

  // Forms / modals
  $('shortcutForm').addEventListener('submit', handleSaveShortcut);
  $('modalClose').addEventListener('click', closeShortcutModal);
  $('modalCancel').addEventListener('click', closeShortcutModal);
  $('aboutClose').addEventListener('click', () => $('aboutModal').classList.remove('open'));

  // Mobile sheet
  $('sheetOpen').addEventListener('click', () => {
    if (state.selectedShortcut) {
      window.open(normalizeUrl(state.selectedShortcut.url), '_blank');
      closeAppSheet();
    }
  });
  $('sheetEdit').addEventListener('click', () => {
    if (state.selectedShortcut) openShortcutModal(state.selectedShortcut);
  });
  $('sheetDelete').addEventListener('click', deleteShortcut);
  $('sheetCancel').addEventListener('click', closeAppSheet);
  $('sheetOverlay').addEventListener('click', closeAppSheet);

  // Mobile search
  $('mobileSearch').addEventListener('input', (e) => {
    state.filter = e.target.value;
    renderMobile();
  });

  // Global events
  document.addEventListener('click', (e) => {
    hideContextMenu();
    if (!e.target.closest('.start-menu') && !e.target.closest('.start-btn')) {
      toggleStartMenu(false);
    }
    if (!e.target.closest('.command-palette') && !e.target.closest('#paletteBtn')) {
      togglePalette(false);
    }
    if (!e.target.closest('.modal-dialog') && !e.target.closest('.modal-close')) {
      document.querySelectorAll('.modal.open').forEach((m) => {
        if (m.id === 'shortcutModal') closeShortcutModal();
        else if (m.id === 'aboutModal') m.classList.remove('open');
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      togglePalette(true);
    }
    if (e.key === 'Escape') {
      if ($('shortcutModal').classList.contains('open')) closeShortcutModal();
      else if ($('aboutModal').classList.contains('open')) $('aboutModal').classList.remove('open');
      else if ($('commandPalette').classList.contains('open')) togglePalette(false);
      else if ($('startMenu').classList.contains('open')) toggleStartMenu(false);
      else if ($('appSheet').classList.contains('open')) closeAppSheet();
      else if (state.activeWindowId) closeWindow(state.activeWindowId);
    }
  });

  // Touch drag for windows
  document.querySelectorAll('.window-titlebar').forEach((bar) => {
    bar.addEventListener('touchstart', (e) => {
      const id = bar.closest('.window').id;
      startDrag(e.touches[0], id);
    }, { passive: false });
  });
}

init();
