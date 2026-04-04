// ui.js — DOM rendering, theme, icons, toasts, forms
import {
  getCategories, addCategory, deleteCategory, isDefaultCategory,
  getBudgetConfig, filterByTimeframe, aggregateByCategory, getTotalSpent
} from './storage.js';

// ── Lucide icon strings (inline SVG, no emoji) ────
export const ICONS = {
  wallet:   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>`,
  trending: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  coins:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>`,
  hash:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,
  receipt:  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/></svg>`,
  tag:      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  trash:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  plus:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  x:        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  alert:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  moon:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  sun:      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  inbox:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  pieChart: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
  flag:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  ugFlag:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none"><rect width="18" height="18" rx="4" fill="#3B0764"/><rect y="0" width="18" height="6" rx="0" fill="#1A1A1A"/><rect y="6" width="18" height="6" fill="#FBBF24"/><rect y="12" width="18" height="6" rx="0" fill="#EF4444"/><circle cx="9" cy="9" r="2.5" fill="white" stroke="#D1D5DB" stroke-width="0.5"/></svg>`,
};

// ── Category icon map (Lucide icons, no emoji) ────
const CAT_ICON_MAP = {
  'Boda/Transport':    'trending',
  'Rolex & Food':      'receipt',
  'Airtime & Data':    'hash',
  'Hostel/Rent':       'flag',
  'Yaka/Utilities':    'coins',
  'Stationery':        'calendar',
  'Plot/Entertainment':'tag',
};

export function getCatIcon(category) {
  const key = CAT_ICON_MAP[category];
  return ICONS[key] || ICONS.tag;
}

// Color palette for categories
const COLOR_STOPS = [
  { color: 'var(--chart-1)', bg: 'var(--clr-primary-light)' },
  { color: 'var(--chart-2)', bg: 'var(--clr-accent-light)' },
  { color: 'var(--chart-3)', bg: 'var(--clr-coral-light)' },
  { color: 'var(--chart-4)', bg: 'var(--clr-success-light)' },
  { color: 'var(--chart-5)', bg: 'var(--clr-warning-light)' },
  { color: 'var(--chart-6)', bg: 'var(--clr-danger-light)' },
  { color: 'var(--chart-7)', bg: 'var(--clr-primary-light)' },
  { color: 'var(--chart-8)', bg: 'var(--clr-accent-light)' },
];

export function getCatColor(category, categories) {
  const idx = Math.max(0, categories.indexOf(category)) % COLOR_STOPS.length;
  return COLOR_STOPS[idx];
}

// ── Format UGX ────────────────────────────────────
export function formatUGX(amount) {
  return Number(amount).toLocaleString('en-UG') + ' UGX';
}

// ── Theme ─────────────────────────────────────────
export function initTheme() {
  const saved = localStorage.getItem('ugt_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  return saved;
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ugt_theme', next);
  return next;
}

// ── Populate category <select> ────────────────────
export function populateCategoryDropdown(selectEl) {
  const categories = getCategories();
  const current = selectEl.value;
  selectEl.innerHTML = '<option value="">Select category…</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    selectEl.appendChild(opt);
  });
  if (current && categories.includes(current)) selectEl.value = current;
}

// ── Render Stats ──────────────────────────────────
export function renderStats(transactions, timeframe) {
  const filtered = filterByTimeframe(transactions, timeframe);
  const total = getTotalSpent(filtered);
  const { pocketMoney } = getBudgetConfig();
  const balance = Math.max(0, pocketMoney - total);
  const pct = pocketMoney > 0 ? Math.min((total / pocketMoney) * 100, 100) : 0;

  setInnerText('stat-balance', formatUGX(balance));
  setInnerText('stat-spent',   formatUGX(total));
  setInnerText('stat-pocket',  formatUGX(pocketMoney));
  setInnerText('stat-count',   String(filtered.length));

  // Period labels
  document.querySelectorAll('.js-period').forEach(el => {
    el.textContent = timeframe === 'week' ? 'This Week' : 'This Month';
  });

  renderProgressBar(pct, pocketMoney);
  return { filtered, total, pocketMoney, pct };
}

function renderProgressBar(pct, pocketMoney) {
  const fill   = document.getElementById('progress-fill');
  const pctEl  = document.getElementById('progress-pct');
  const stEl   = document.getElementById('progress-status');
  if (!fill) return;

  fill.style.width = pct.toFixed(1) + '%';
  if (pctEl) pctEl.textContent = pct.toFixed(0) + '%';

  fill.classList.remove('state-safe', 'state-warning', 'state-danger');

  let statusHtml;
  if (pocketMoney === 0) {
    fill.classList.add('state-safe');
    statusHtml = `${ICONS.alert} Set pocket money`;
  } else if (pct < 70) {
    fill.classList.add('state-safe');
    statusHtml = `${ICONS.check} On Track`;
  } else if (pct < 90) {
    fill.classList.add('state-warning');
    statusHtml = `${ICONS.alert} Watch Spending`;
  } else {
    fill.classList.add('state-danger');
    statusHtml = `${ICONS.alert} Nearly Depleted`;
  }

  if (stEl) stEl.innerHTML = statusHtml;
}

// ── Render Transaction List ───────────────────────
export function renderTransactionList(transactions, timeframe, onDelete) {
  const listEl = document.getElementById('tx-list');
  if (!listEl) return;

  const filtered = filterByTimeframe(transactions, timeframe)
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const categories = getCategories();
  listEl.innerHTML = '';

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="tx-empty">
        ${ICONS.inbox}
        <div class="tx-empty-title">No expenses yet</div>
        <div class="tx-empty-sub">Add your first expense to get started</div>
      </div>`;
    return;
  }

  filtered.forEach(tx => {
    const catColor = getCatColor(tx.category, categories);
    const catIcon  = getCatIcon(tx.category);
    const dateStr  = new Date(tx.date).toLocaleDateString('en-UG', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    const item = document.createElement('div');
    item.className = 'tx-item';
    item.dataset.id = tx.id;
    item.innerHTML = `
      <div class="tx-icon-wrap" style="background:${catColor.bg}; color:${catColor.color}">
        ${catIcon}
      </div>
      <div class="tx-info">
        <div class="tx-name">${escHtml(tx.name)}</div>
        <div class="tx-meta">
          <span class="tx-badge" style="background:${catColor.bg}; color:${catColor.color}">
            ${escHtml(tx.category)}
          </span>
          <span class="tx-date">${dateStr}</span>
        </div>
      </div>
      <div class="tx-amount">-${formatUGX(tx.amount)}</div>
      <button class="tx-del" data-id="${tx.id}" aria-label="Delete transaction">
        ${ICONS.trash}
      </button>`;

    item.querySelector('.tx-del').addEventListener('click', e => {
      e.stopPropagation();
      onDelete(tx.id);
    });

    listEl.appendChild(item);
  });
}

// ── Category Modal ────────────────────────────────
export function openCategoryModal(onUpdate) {
  const backdrop = document.getElementById('cat-modal-backdrop');
  backdrop.classList.add('open');
  renderCategoryList(onUpdate);

  // Clone inputs to clear stale listeners
  replaceEl('cat-input');
  replaceEl('cat-add-btn');

  const input  = document.getElementById('cat-input');
  const addBtn = document.getElementById('cat-add-btn');

  const doAdd = () => {
    const val = input.value.trim();
    if (!val) { showToast('Enter a category name', 'error'); return; }
    try {
      addCategory(val);
      input.value = '';
      renderCategoryList(onUpdate);
      onUpdate();
      showToast(`"${val}" added`, 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  addBtn.addEventListener('click', doAdd);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });

  document.getElementById('cat-modal-close').onclick = () => backdrop.classList.remove('open');
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.remove('open'); });

  setTimeout(() => input.focus(), 180);
}

function renderCategoryList(onUpdate) {
  const listEl = document.getElementById('cat-list');
  if (!listEl) return;
  const categories = getCategories();
  listEl.innerHTML = '';

  categories.forEach(cat => {
    const isDef = isDefaultCategory(cat);
    const item  = document.createElement('div');
    item.className = 'cat-modal-item';
    item.innerHTML = `
      <div class="cat-modal-name">
        ${ICONS.tag}
        ${escHtml(cat)}
        ${isDef ? '<span class="badge-default">Default</span>' : ''}
      </div>
      ${!isDef ? `<button class="cat-del-btn" aria-label="Remove ${escHtml(cat)}">${ICONS.trash}</button>` : ''}`;

    item.querySelector('.cat-del-btn')?.addEventListener('click', () => {
      deleteCategory(cat);
      renderCategoryList(onUpdate);
      onUpdate();
      showToast(`"${cat}" removed`, 'warning');
    });

    listEl.appendChild(item);
  });
}

// ── Toast ─────────────────────────────────────────
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const iconMap = { success: ICONS.check, error: ICONS.x, warning: ICONS.alert };
  const toast   = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${iconMap[type] || ''}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

// ── Form Helpers ──────────────────────────────────
export function getFormData() {
  const name      = document.getElementById('tx-name')?.value.trim();
  const rawAmount = document.getElementById('tx-amount')?.value.replace(/,/g, '');
  const category  = document.getElementById('tx-category')?.value;
  const date      = document.getElementById('tx-date')?.value;

  const errors = [];
  if (!name)     errors.push('Description is required');
  if (!rawAmount) errors.push('Amount is required');
  const amount = parseFloat(rawAmount);
  if (isNaN(amount) || amount <= 0) errors.push('Enter a valid positive amount');
  if (!category) errors.push('Select a category');
  if (!date)     errors.push('Date is required');

  if (errors.length) return { valid: false, errors };
  return { valid: true, data: { name, amount, category, date: new Date(date).toISOString() } };
}

export function clearForm() {
  ['tx-name', 'tx-amount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const dateEl = document.getElementById('tx-date');
  if (dateEl) dateEl.value = todayISO();
  const catEl = document.getElementById('tx-category');
  if (catEl) catEl.value = '';
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function renderPocketMoneyInput() {
  const { pocketMoney } = getBudgetConfig();
  const input = document.getElementById('pocket-input');
  if (input && pocketMoney > 0) input.value = pocketMoney;
}

export function initTimeframeToggle(onChange) {
  document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onChange(btn.dataset.tf);
    });
  });
}

export function initMobileFAB() {
  const fab     = document.getElementById('mobile-fab');
  const addCard = document.getElementById('add-card');
  if (!fab || !addCard) return;

  fab.addEventListener('click', () => {
    const isOpen = addCard.classList.toggle('open');
    fab.innerHTML = isOpen
      ? `${ICONS.x} <span>Close</span>`
      : `${ICONS.plus} <span>Add Expense</span>`;
    if (isOpen) addCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ── Utilities ─────────────────────────────────────
function setInnerText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function replaceEl(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const clone = el.cloneNode(true);
  el.parentNode.replaceChild(clone, el);
}
