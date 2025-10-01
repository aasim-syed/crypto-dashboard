# 📑 Spec: Crypto Dashboard with Chat Assistant

### 📌 Overview
This project delivers a **full-stack crypto dashboard** with live market data, historical price charts, and a natural-language query chat assistant. Built with **FastAPI backend + React (Vite) frontend + Chart.js**, it balances functional correctness with user experience through clean design, dark/light theming, skeleton loading, and tooltips.

---

## 🔹 Implemented Features & UX Impact

### 1. **Backend Features**
| Feature | Description | UX Impact |
|---------|-------------|-----------|
| **API Integration (CoinGecko)** | Live fetching of top coins and historical data. | High – ensures real, up-to-date data. |
| **Data Persistence (DB storage)** | Caches top 10 coins & 30-day history. | Medium – faster responses, fewer API failures (important given rate limits). |
| **Endpoints** | `/coins/top`, `/coins/{id}/history`, `/qa` (Q&A). | High – enables frontend to render dashboard and chat. |
| **Rule-Based Chat Q&A** | String-parsing for queries like *“What’s Bitcoin price?”*. | Medium – gives chat feel without needing AI model. |
| **Error Handling (429 Too Many Requests)** | Basic fallback/caching to avoid CoinGecko throttling. | Medium – prevents app from breaking under API limits. |

---

### 2. **Frontend Dashboard**
| Feature | Description | UX Impact |
|---------|-------------|-----------|
| **Top 10 Coins Table** | Table showing price, % change, volume. | High – core requirement, immediate value for user. |
| **Sortable Columns (bonus)** | Users can sort/filter coins. | Medium – power-users benefit. |
| **Dark/Light Mode** | Theme toggle with CSS vars. | High – accessibility, modern app feel. |
| **Gradients & Aesthetic Styling** | Modern visuals, brand color accents. | Medium – improves first impression. |
| **Skeleton Shimmers (Table + Chart)** | Placeholder loading UI before data arrives. | High – avoids “empty screen” UX gap. |
| **Tooltips on Chart** | Hover shows exact price values. | High – essential for usability. |
| **Crosshair Plugin (TradingView-style)** | Vertical dashed line follows hover. | High – gives professional finance-app feel. |
| **Chat Assistant Panel** | Text input box connected to backend Q&A. | High – interactive, differentiates app from static dashboards. |
| **Error States (No Data)** | Displays fallback message if API returns nothing. | Medium – avoids confusion. |

---

### 3. **Small UX Features (but impactful)**
| Feature | Description | UX Impact |
|---------|-------------|-----------|
| **Point Highlight on Hover** | Circle enlarges when hovered. | Small but High – makes interaction feel alive. |
| **Tooltip Value Formatting** | Numbers formatted with `toLocaleString()`. | Medium – readability boost, esp. big numbers. |
| **Responsive Layout** | Mobile-friendly via flex/grid. | High – supports wider usage. |
| **Tour Walkthrough (planned)** | Tooltips explaining UI sections. | Medium – onboarding aid. |
| **Consistent Color Palette** | Coins + charts styled with same theme. | Small but Medium – visual consistency. |
| **Loading Spinner vs. “No Data”** | Clear distinction between “loading” and “no results.” | Medium – reduces user frustration. |

---

## 🔹 Coverage Matrix

| Requirement | Implemented? | Details |
|-------------|--------------|---------|
| **Backend: Fetch data from CoinGecko** | ✅ | `fetch_top_coins`, `fetch_history` |
| **Backend: Store top 10 coins & 30-day history** | ✅ | SQLite/Postgres (depending on config) |
| **Backend: Get top N coins endpoint** | ✅ | `/coins/top?n=10` |
| **Backend: Get historical price trends** | ✅ | `/coins/{id}/history?days=30` |
| **Backend: Rule-based Q&A** | ✅ | `/qa?query=...` |
| **Frontend: Dashboard table (top 10)** | ✅ | Table with sorting, % change, volume |
| **Frontend: Line chart with history** | ✅ | Chart.js + tooltip + crosshair |
| **Frontend: Chat assistant panel** | ✅ | Input → backend Q&A API |
| **Bonus: Auth & favorites** | ❌ | Not implemented (time constraint) |
| **Bonus: Filtering/sorting** | ✅ | Basic column sorting |
| **Bonus: Deploy (Vercel/Netlify)** | ⚠️ Partial | Works locally; deploy optional |
| **Bonus: Caching API calls** | ✅ | TTLCache in backend |
| **Bonus: Unit tests** | ❌ | Not implemented |

---

## 🔹 UX Impact Summary

- **Critical UX wins:**  
  - Skeleton loading, crosshair tooltips, dark/light mode → app feels smooth, modern.  
  - Error handling and fallback states → app doesn’t “break” under bad API calls.  

- **Medium UX wins:**  
  - Chat assistant (basic rule-based) → adds interactivity, but limited in intelligence.  
  - Sorting/filtering → quality-of-life improvement.  

- **Low but noticeable wins:**  
  - Point hover highlight, number formatting, gradients → polish & trust factor.  

---

## 📊 Impact Weighting (How much each feature affects UX)
- **High Impact (~50%)** → Core dashboard (table + chart + tooltips + loading states).  
- **Medium Impact (~30%)** → Theming, chat assistant, caching/error handling.  
- **Low Impact (~20%)** → Micro-interactions (hover highlights, gradient polish).  
