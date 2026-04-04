// storage.js — LocalStorage persistence layer
// Keys: ugt_transactions | ugt_categories | ugt_budgetConfig

const KEYS = {
  TRANSACTIONS: 'ugt_transactions',
  CATEGORIES:   'ugt_categories',
  BUDGET:       'ugt_budgetConfig',
};

const DEFAULT_CATEGORIES = [
  'Boda/Transport',
  'Rolex & Food',
  'Airtime & Data',
  'Hostel/Rent',
  'Yaka/Utilities',
  'Stationery',
  'Plot/Entertainment',
];

// ── Transactions ──────────────────────────────────

export function getTransactions() {
  try {
    const raw = localStorage.getItem(KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(list) {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(list));
}

export function addTransaction(tx) {
  const list = getTransactions();
  list.unshift(tx);
  saveTransactions(list);
  return list;
}

export function deleteTransaction(id) {
  const list = getTransactions().filter(t => t.id !== id);
  saveTransactions(list);
  return list;
}

// ── Categories ────────────────────────────────────

export function getCategories() {
  try {
    const raw = localStorage.getItem(KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* fall through */ }
  saveCategories(DEFAULT_CATEGORIES);
  return [...DEFAULT_CATEGORIES];
}

export function saveCategories(list) {
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(list));
}

export function addCategory(name) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Category name cannot be empty');
  const list = getCategories();
  if (list.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) {
    throw new Error('Category already exists');
  }
  list.push(trimmed);
  saveCategories(list);
  return list;
}

export function deleteCategory(name) {
  const list = getCategories().filter(c => c !== name);
  saveCategories(list);
  return list;
}

export function isDefaultCategory(name) {
  return DEFAULT_CATEGORIES.includes(name);
}

// ── Budget Config ─────────────────────────────────

export function getBudgetConfig() {
  try {
    const raw = localStorage.getItem(KEYS.BUDGET);
    return raw ? JSON.parse(raw) : { pocketMoney: 0 };
  } catch {
    return { pocketMoney: 0 };
  }
}

export function saveBudgetConfig(config) {
  localStorage.setItem(KEYS.BUDGET, JSON.stringify(config));
}

export function setPocketMoney(amount) {
  const config = getBudgetConfig();
  config.pocketMoney = Number(amount) || 0;
  saveBudgetConfig(config);
  return config;
}

// ── Filtering & Aggregation ───────────────────────

export function getDateRange(timeframe) {
  const now = new Date();
  let start;
  if (timeframe === 'week') {
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start = new Date(now);
    start.setDate(now.getDate() + diff);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  start.setHours(0, 0, 0, 0);
  return { start, end: now };
}

export function filterByTimeframe(transactions, timeframe) {
  const { start } = getDateRange(timeframe);
  return transactions.filter(tx => new Date(tx.date) >= start);
}

export function aggregateByCategory(transactions) {
  return transactions.reduce((map, tx) => {
    map[tx.category] = (map[tx.category] || 0) + tx.amount;
    return map;
  }, {});
}

export function getTotalSpent(transactions) {
  return transactions.reduce((sum, tx) => sum + tx.amount, 0);
}

export function generateId() {
  return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
