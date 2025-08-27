(function () {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('q');
  const clearBtn = document.getElementById('clearBtn');
  const suggestEl = document.getElementById('suggestList');
  const themeToggle = document.getElementById('themeToggle');
  const luckyBtn = document.getElementById('luckyBtn');

  // Persisted theme
  const THEME_KEY = 'pref-theme';
  function applyTheme(mode) {
    document.documentElement.dataset.theme = mode;
    themeToggle.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
  }
  function resolveInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  applyTheme(resolveInitialTheme());
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // Clear button
  input.addEventListener('input', () => {
    clearBtn.style.display = input.value ? 'inline-block' : 'none';
    updateSuggestions(input.value);
  });
  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    hideSuggestions();
    input.focus();
  });

  // Suggestion model (local stub with simple fuzzy match)
  const corpus = [
    'news', 'weather', 'maps', 'music', 'sports', 'finance', 'translate',
    'movies', 'restaurants', 'near me', 'javascript', 'css grid', 'perfume store',
    'sys perfume', 'ecommerce templates', 'html forms accessibility'
  ];
  function debounce(fn, ms) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }
  const updateSuggestions = debounce((text) => {
    const q = text.trim().toLowerCase();
    if (!q) return hideSuggestions();
    const results = corpus
      .map(s => ({ s, score: similarity(q, s.toLowerCase()) }))
      .filter(r => r.score > 0.2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(r => r.s);
    renderSuggestions(results, q);
  }, 120);

  function similarity(a, b) {
    // Jaccard on character shingles
    const sh = (str, n = 2) => new Set(Array.from({ length: Math.max(0, str.length - n + 1) }, (_, i) => str.slice(i, i + n)));
    const A = sh(a), B = sh(b);
    const inter = new Set([...A].filter(x => B.has(x))).size;
    const uni = new Set([...A, ...B]).size || 1;
    return inter / uni;
  }

  function renderSuggestions(items, q) {
    suggestEl.innerHTML = '';
    if (!items.length) return hideSuggestions();
    items.forEach((text, i) => {
      const li = document.createElement('li');
      li.role = 'option';
      li.id = `sug-${i}`;
      li.tabIndex = -1;
      li.textContent = text;
      li.addEventListener('mousedown', (e) => { e.preventDefault(); commit(text); });
      suggestEl.appendChild(li);
    });
    suggestEl.style.display = 'block';
    input.setAttribute('aria-expanded', 'true');
  }
  function hideSuggestions() {
    suggestEl.style.display = 'none';
    input.setAttribute('aria-expanded', 'false');
  }
  function commit(value) {
    input.value = value;
    hideSuggestions();
    form.requestSubmit();
  }

  // Keyboard navigation for listbox
  let activeIndex = -1;
  input.addEventListener('keydown', (e) => {
    const items = [...suggestEl.querySelectorAll('li')];
    if (!items.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (e.key === 'ArrowDown')
        ? Math.min(items.length - 1, activeIndex + 1)
        : Math.max(0, activeIndex - 1);
      items.forEach((li, i) => li.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false'));
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      commit(items[activeIndex].textContent || '');
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  });

  // Submit behavior: redirect based on selected engine
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) {
      input.focus();
      return;
    }
    const engine = new FormData(form).get('engine');
    const url = buildUrl(engine, q);
    window.location.assign(url);
  });

  // Lucky: open first result via query operator if supported (fallback to normal search)
  luckyBtn.addEventListener('click', () => {
    const q = input.value.trim();
    if (!q) { input.focus(); return; }
    const engine = new FormData(form).get('engine');
    const url = buildUrl(engine, q, true);
    window.location.assign(url);
  });

  function buildUrl(engine, q, lucky = false) {
    if (engine === 'google') {
      // Redirect-only usage of public querystring; no branding or API use.
      // Lucky uses btnI param traditionally handled by Google.
      const base = 'https://www.google.com/search';
      const params = new URLSearchParams({ q });
      if (lucky) params.set('btnI', '1');
      return `${base}?${params.toString()}`;
    }
    if (engine === 'bing') {
      if (lucky) return `https://www.bing.com/search?q=${encodeURIComponent(q)}&first=1`;
      return `https://www.bing.com/search?q=${encodeURIComponent(q)}`;
    }
    // DuckDuckGo
    if (lucky) return `https://duckduckgo.com/?q=!ducky+${encodeURIComponent(q)}`;
    return `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
  }
})();
// ---- Simple Coins System (1 coin per 10 minutes of active search) ----
(function () {
  const MS_PER_COIN = 600000; // 10 minutes
  const STORAGE_KEY = 'sp-wallet';
  const input = document.getElementById('q');
  const balanceEl = document.getElementById('coinBalance');
  const progressEl = document.getElementById('coinProgress');
  const progressTimeEl = document.getElementById('progressTime');
  const claimBtn = document.getElementById('claimBtn');
  const historyList = document.getElementById('historyList');

  let state = loadWallet();
  let active = false;
  let lastTick = 0;
  let rafId = 0;
  let idleTimer = null;
  const IDLE_MS = 30_000; // pause accrual after 30s of no input changes

  function loadWallet() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { balance: 0, msAccrued: 0, history: [] };
  }
  function saveWallet() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function formatTime(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2,'0')}`;
  }

  function render() {
    balanceEl.textContent = String(state.balance);
    const value = state.msAccrued % MS_PER_COIN;
    progressEl.value = value;
    progressTimeEl.textContent = `${formatTime(value)} / ${formatTime(MS_PER_COIN)}`;
    claimBtn.setAttribute('aria-disabled', coinsPending() ? 'false' : 'true');
    claimBtn.classList.toggle('btn', coinsPending());
  }

  function coinsPending() {
    return Math.floor(state.msAccrued / MS_PER_COIN) > 0;
  }

  function addHistory(event) {
    state.history.unshift({ t: Date.now(), event });
    state.history = state.history.slice(0, 50);
    renderHistory();
  }

  function renderHistory() {
    historyList.innerHTML = '';
    state.history.forEach(h => {
      const li = document.createElement('li');
      const date = new Date(h.t).toLocaleString();
      li.textContent = `${h.event} — ${date}`;
      historyList.appendChild(li);
    });
  }

  function start() {
    if (active) return;
    active = true;
    lastTick = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    active = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function tick(now) {
    if (!active || document.hidden) { lastTick = now; rafId = requestAnimationFrame(tick); return; }
    const delta = Math.min(1000, now - lastTick); // clamp to handle slow frames
    lastTick = now;
    state.msAccrued += delta;
    if (coinsPending()) {
      claimBtn.removeAttribute('disabled');
      claimBtn.setAttribute('aria-disabled', 'false');
    }
    render();
    saveWallet();
    rafId = requestAnimationFrame(tick);
  }

  // Idle detection: pause if user stops typing for IDLE_MS
  function resetIdle() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => stop(), IDLE_MS);
  }

  // Consider "active search" when input focused or user typing
  input.addEventListener('focus', () => { start(); resetIdle(); });
  input.addEventListener('blur', () => { stop(); });
  input.addEventListener('input', () => { start(); resetIdle(); });

  // Pause when tab hidden, resume on visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else if (document.activeElement === input) start();
  });

  // Claim converts only full coin intervals into balance
  claimBtn.addEventListener('click', () => {
    const coins = Math.floor(state.msAccrued / MS_PER_COIN);
    if (coins <= 0) return;
    state.balance += coins;
    state.msAccrued = state.msAccrued % MS_PER_COIN;
    addHistory(`Claimed ${coins} coin${coins > 1 ? 's' : ''}`);
    render();
    saveWallet();
  });

  // Initialize UI
  render();
  renderHistory();
})();
