// export.js — CSV export logic for UG Student Tracker

export function exportToCSV(transactions, timeframe = 'all') {
  if (!transactions || transactions.length === 0) return false;

  let data = transactions;

  if (timeframe !== 'all') {
    const now   = new Date();
    let start;
    if (timeframe === 'week') {
      const day = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() + (day === 0 ? -6 : 1 - day));
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    start.setHours(0, 0, 0, 0);
    data = transactions.filter(tx => new Date(tx.date) >= start);
  }

  if (data.length === 0) return false;

  const headers = ['Date', 'Description', 'Category', 'Amount (UGX)', 'Type'];

  const rows = data
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(tx => {
      const d = new Date(tx.date).toLocaleDateString('en-UG', {
        year: 'numeric', month: '2-digit', day: '2-digit',
      });
      return [
        d,
        `"${String(tx.name).replace(/"/g, '""')}"`,
        `"${String(tx.category).replace(/"/g, '""')}"`,
        tx.amount,
        tx.type || 'expense',
      ].join(',');
    });

  const total = data.reduce((s, t) => s + t.amount, 0);
  rows.push('');
  rows.push(`"Total Spent",,,${total},""`);

  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const label = timeframe === 'week' ? 'week' : timeframe === 'month' ? 'month' : 'all';

  link.setAttribute('href', url);
  link.setAttribute('download', `ug-expenses-${label}-${isoToday()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}
