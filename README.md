# UG Student Tracker

A production-ready, browser-based pocket money and expense tracker built for university students in Uganda. Zero backend. Zero login. Works offline after first load.

---

## Features

| Feature | Detail |
|---|---|
| Pocket Money Tracking | Set your total budget; balance updates in real time |
| Visual Progress Bar | Green under 70%, Amber 70–90%, Red above 90% |
| Doughnut Chart | Chart.js spending breakdown by category |
| Timeframe Toggle | Switch between This Week and This Month across all metrics |
| Custom Categories | 7 default Ugandan categories plus full add/remove management |
| CSV Export | Download transactions as a formatted spreadsheet |
| Light / Dark Mode | Full CSS variable theming with animated toggle |
| Mobile-First | Single-column layout on mobile with sticky FAB; Bento grid on desktop |
| Offline-First | All data persists in localStorage, no internet required after load |

---

## Default Categories

- Boda/Transport
- Rolex & Food
- Airtime & Data
- Hostel/Rent
- Yaka/Utilities
- Stationery
- Plot/Entertainment

---

## Project Structure

```
ug-student-tracker/
├── index.html                  # Semantic HTML5 entry point
├── assets/
│   ├── css/
│   │   ├── theme.css           # Design token system (light + dark)
│   │   └── style.css           # Mobile-first Bento layout
│   └── js/
│       ├── app.js              # Main init and event orchestration
│       ├── storage.js          # LocalStorage CRUD and aggregation
│       ├── ui.js               # DOM rendering, icons, toasts
│       ├── chartManager.js     # Chart.js doughnut integration
│       └── export.js           # CSV download logic
├── .gitignore
├── LICENSE                     # MIT
└── README.md
```

---

## Data Model

### `ugt_transactions`
```json
[
  {
    "id":       "tx_1719000000000_abc123",
    "name":     "Boda to Makerere",
    "amount":   3000,
    "category": "Boda/Transport",
    "date":     "2025-06-01T08:30:00.000Z",
    "type":     "expense"
  }
]
```

### `ugt_categories`
```json
["Boda/Transport", "Rolex & Food", "Airtime & Data", ...]
```

### `ugt_budgetConfig`
```json
{ "pocketMoney": 350000 }
```

---

## Getting Started

ES6 modules require an HTTP server, not a `file://` URL.

```bash
git clone https://github.com/your-username/ug-student-tracker.git
cd ug-student-tracker

# Any static server works:
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

---

## Design System

- **Display font:** Syne (700, 800) — bold, characterful headings
- **Body font:** DM Sans (400, 500, 600, 700) — clean, readable
- **Primary:** Electric Violet `#7C3AED` (light) / `#A78BFA` (dark)
- **Accent:** Neon Cyan `#06B6D4` (light) / `#22D3EE` (dark)
- **Layout:** CSS Grid Bento Box, 12-column desktop, 1–2 column mobile
- **Icons:** Inline Lucide SVGs — no external icon font dependency
- **Theming:** 80+ CSS custom properties, toggled via `[data-theme]` on `<html>`

---

## Browser Support

Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, Mobile Chrome/Safari.

---

## License

MIT © 2025 UG Student Tracker
