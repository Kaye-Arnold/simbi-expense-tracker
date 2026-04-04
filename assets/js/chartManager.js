// chartManager.js — Chart.js doughnut integration
import { filterByTimeframe, aggregateByCategory } from './storage.js';
import { getCategories } from './storage.js';
import { formatUGX } from './ui.js';

let chart = null;

// Resolved color arrays per theme
const COLORS = {
  light: ['#7C3AED','#06B6D4','#F97316','#10B981','#F59E0B','#EF4444','#8B5CF6','#0EA5E9'],
  dark:  ['#A78BFA','#22D3EE','#FB923C','#34D399','#FBBF24','#F87171','#C4B5FD','#38BDF8'],
};

function theme()       { return document.documentElement.getAttribute('data-theme') || 'light'; }
function isDark()      { return theme() === 'dark'; }
function textColor()   { return isDark() ? '#A89FC8' : '#4B4569'; }
function surfaceColor(){ return isDark() ? '#13102A' : '#FFFFFF'; }
function chartColors() { return COLORS[theme()]; }

export function renderDoughnutChart(transactions, timeframe) {
  const canvas  = document.getElementById('spending-chart');
  const emptyEl = document.getElementById('chart-empty');
  if (!canvas) return;

  const filtered   = filterByTimeframe(transactions, timeframe);
  const byCat      = aggregateByCategory(filtered);
  const labels     = Object.keys(byCat);
  const data       = Object.values(byCat);
  const total      = data.reduce((a, b) => a + b, 0);
  const colors     = chartColors();
  const bgColors   = labels.map((_, i) => colors[i % colors.length]);

  if (labels.length === 0) {
    canvas.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'flex';
    if (chart) { chart.destroy(); chart = null; }
    renderLegend([], [], [], 0);
    return;
  }

  canvas.style.display = 'block';
  if (emptyEl) emptyEl.style.display = 'none';

  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: bgColors,
      borderColor: surfaceColor(),
      borderWidth: 2.5,
      hoverBorderWidth: 0,
      hoverOffset: 7,
    }],
  };

  if (chart) {
    chart.data = chartData;
    chart.data.datasets[0].borderColor = surfaceColor();
    chart.options.plugins.tooltip.backgroundColor = surfaceColor();
    chart.options.plugins.tooltip.titleColor = textColor();
    chart.options.plugins.tooltip.bodyColor   = textColor();
    chart.update('active');
  } else {
    chart = new Chart(canvas, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        animation: { animateRotate: true, duration: 680, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: surfaceColor(),
            titleColor: textColor(),
            bodyColor:  textColor(),
            borderColor: 'rgba(124,58,237,0.12)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12,
            callbacks: {
              label: ctx => ` ${formatUGX(ctx.parsed)}  (${((ctx.parsed / total) * 100).toFixed(1)}%)`,
            },
          },
        },
      },
      plugins: [centerTextPlugin(total)],
    });
  }

  renderLegend(labels, bgColors, data, total);
}

function centerTextPlugin(total) {
  return {
    id: 'centerText',
    afterDraw(c) {
      const { width, height, ctx } = c;
      ctx.restore();
      const cx = width / 2;
      const cy = height / 2;
      const dark = isDark();
      const primary = dark ? '#EDE9FE' : '#0F0A1E';
      const muted   = dark ? '#6B5F8A' : '#9B91B8';

      ctx.font = `600 11px 'DM Sans', sans-serif`;
      ctx.fillStyle = muted;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TOTAL SPENT', cx, cy - 13);

      const formatted = formatUGX(total).replace(' UGX', '');
      ctx.font = `800 14px 'Syne', sans-serif`;
      ctx.fillStyle = primary;
      ctx.fillText(formatted, cx, cy + 3);

      ctx.font = `500 10px 'DM Sans', sans-serif`;
      ctx.fillStyle = muted;
      ctx.fillText('UGX', cx, cy + 17);

      ctx.save();
    },
  };
}

function renderLegend(labels, colors, data, total) {
  const el = document.getElementById('chart-legend');
  if (!el) return;
  el.innerHTML = '';
  labels.forEach((label, i) => {
    const pct = total > 0 ? ((data[i] / total) * 100).toFixed(0) : 0;
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <span class="legend-dot" style="background:${colors[i % colors.length]}"></span>
      <span>${label} <span style="opacity:.55">(${pct}%)</span></span>`;
    el.appendChild(item);
  });
}

export function destroyChart() {
  if (chart) { chart.destroy(); chart = null; }
}

export function refreshChartTheme(transactions, timeframe) {
  renderDoughnutChart(transactions, timeframe);
}
