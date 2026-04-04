// app.js — Main application entry point
import {
  getTransactions, addTransaction, deleteTransaction,
  setPocketMoney, getCategories, generateId,
} from './storage.js';

import {
  initTheme, toggleTheme,
  populateCategoryDropdown,
  renderStats, renderTransactionList,
  openCategoryModal, showToast,
  getFormData, clearForm, todayISO,
  renderPocketMoneyInput,
  initTimeframeToggle, initMobileFAB,
  ICONS,
} from './ui.js';

import { renderDoughnutChart, refreshChartTheme } from './chartManager.js';
import { exportToCSV } from './export.js';

// ── App State ─────────────────────────────────────
const state = {
  transactions: [],
  timeframe: 'month',
  theme: 'light',
};

// ── Init ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  state.theme        = initTheme();
  state.transactions = getTransactions();

  // Set today's date in form
  const dateEl = document.getElementById('tx-date');
  if (dateEl) dateEl.value = todayISO();

  // Populate category dropdown
  const catEl = document.getElementById('tx-category');
  if (catEl) populateCategoryDropdown(catEl);

  renderPocketMoneyInput();
  refreshDashboard();
  wireEvents();
  initMobileFAB();
  initTimeframeToggle(tf => { state.timeframe = tf; refreshDashboard(); });
});

// ── Dashboard Refresh ─────────────────────────────
function refreshDashboard() {
  const { transactions, timeframe } = state;
  renderStats(transactions, timeframe);
  renderDoughnutChart(transactions, timeframe);
  renderTransactionList(transactions, timeframe, handleDelete);
  const catEl = document.getElementById('tx-category');
  if (catEl) populateCategoryDropdown(catEl);
}

// ── Event Wiring ──────────────────────────────────
function wireEvents() {

  // Theme toggle
  document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
    state.theme = toggleTheme();
    setTimeout(() => refreshChartTheme(state.transactions, state.timeframe), 80);
  });

  // Pocket money
  document.getElementById('btn-set-pm')?.addEventListener('click', handleSetPocketMoney);
  document.getElementById('pocket-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSetPocketMoney();
  });

  // Add transaction
  document.getElementById('btn-add-tx')?.addEventListener('click', handleAddTx);
  document.getElementById('tx-amount')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleAddTx();
  });

  // Format amount on blur / clear on focus
  const amtEl = document.getElementById('tx-amount');
  if (amtEl) {
    amtEl.addEventListener('blur', () => {
      const v = parseFloat(amtEl.value.replace(/,/g, ''));
      if (!isNaN(v) && v > 0) amtEl.value = v.toLocaleString('en-UG');
    });
    amtEl.addEventListener('focus', () => {
      amtEl.value = amtEl.value.replace(/,/g, '');
    });
  }

  // Category manager
  document.getElementById('btn-cat-manager')?.addEventListener('click', () => {
    openCategoryModal(() => {
      const el = document.getElementById('tx-category');
      if (el) populateCategoryDropdown(el);
      refreshDashboard();
    });
  });

  // CSV export
  document.getElementById('btn-export')?.addEventListener('click', handleExport);

  // Escape closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.getElementById('cat-modal-backdrop')?.classList.remove('open');
    }
  });
}

// ── Handlers ──────────────────────────────────────
function handleSetPocketMoney() {
  const input = document.getElementById('pocket-input');
  if (!input) return;
  const v = parseFloat(input.value.replace(/,/g, ''));
  if (isNaN(v) || v < 0) { showToast('Enter a valid amount', 'error'); return; }
  setPocketMoney(v);
  showToast(`Budget set to ${v.toLocaleString('en-UG')} UGX`, 'success');
  refreshDashboard();
}

function handleAddTx() {
  const result = getFormData();
  if (!result.valid) { showToast(result.errors[0], 'error'); return; }

  const { name, amount, category, date } = result.data;
  const newTx = { id: generateId(), name, amount, category, date, type: 'expense' };

  state.transactions = addTransaction(newTx);
  clearForm();
  refreshDashboard();
  showToast(`Added: ${name} — ${amount.toLocaleString('en-UG')} UGX`, 'success');

  // Collapse mobile add card
  const addCard = document.getElementById('add-card');
  const fab     = document.getElementById('mobile-fab');
  if (addCard?.classList.contains('open')) {
    addCard.classList.remove('open');
    if (fab) fab.innerHTML = `${ICONS.plus} <span>Add Expense</span>`;
  }
}

function handleDelete(id) {
  const tx = state.transactions.find(t => t.id === id);
  state.transactions = deleteTransaction(id);
  refreshDashboard();
  showToast(tx ? `Deleted: ${tx.name}` : 'Transaction deleted', 'warning');
}

function handleExport() {
  const ok = exportToCSV(state.transactions, state.timeframe);
  showToast(ok ? 'CSV downloaded successfully' : 'No transactions to export', ok ? 'success' : 'error');
}
