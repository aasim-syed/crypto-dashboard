# 📈 Crypto Dashboard with Chat Assistant

This project was built as part of the **Jetapult Fullstack Engineer Assignment**.  
It is a full-stack **Crypto Dashboard** with a **rule-based chat assistant** that integrates with the live CoinGecko API.  

Users can:  
- View top 10 cryptocurrencies (price, market cap, volume, % change).  
- Explore 30-day historical price charts.  
- Chat in natural language to query prices or trends.  
- (Bonus) Register/Login and manage favorite coins ⭐.  
- (Bonus) Switch between light/dark themes with UX enhancements.  

🚀 **Deployed App**: [Crypto Dashboard Live](https://crypto-dashboard-eight-puce.vercel.app/)  
⚡ **Backend API**: [Render Backend](https://crypto-dashboard-ldxf.onrender.com/)  
📌 **GitHub Repo**: [aasim-syed/crypto-dashboard](https://github.com/aasim-syed/crypto-dashboard)  

---

## 📊 Coverage Matrix

| Requirement Area             | Jetapult Requirement                                                                 | My Implementation                                                                                                   | Coverage |
|-------------------------------|---------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|----------|
| **Backend – API Integration** | Fetch data from CoinGecko and store top 10 coins + 30-day history                     | Implemented `/sync` endpoint with `sync_top_and_history` using CoinGecko API; persisted in SQLite DB                 | ✅ Done  |
| **Backend – Endpoints**       | - Get top N coins<br>- Get historical prices<br>- Rule-based Q&A                      | - `/coins` → top N coins<br>- `/coins/{id}/history` → historical data<br>- `/qa` → rule-based parsing for price/trend | ✅ Done  |
| **Backend – Caching**         | Reduce API calls                                                                      | TTLCache (30s) added to minimize DB scans and CoinGecko fetch                                                        | ✅ Bonus |
| **Frontend – Dashboard Table**| Table of top 10 coins (price, volume, % change)                                       | React + Vite table with sorting, favorites toggle ⭐                                                                  | ✅ Done  |
| **Frontend – Chart**          | Line chart showing 30-day historical trend                                            | Chart.js TrendChart with gradients, hover tooltips, responsive UI                                                    | ✅ Done  |
| **Frontend – Chat Assistant** | Panel for natural queries → backend Q&A                                               | ChatPanel connected to `/qa` endpoint, supports “price of btc”, “7-day trend of ETH”, etc.                           | ✅ Done  |
| **Frontend – UX**             | Functional UI, polish optional                                                        | Dark/Light mode toggle, gradients, skeleton loaders, guided tooltips, onboarding tour                                | ✅ Bonus |
| **Auth (Bonus)**              | User authentication and favorites                                                     | JWT auth with `/auth/register` + `/auth/login`; favorites endpoint with add/remove/list                              | ✅ Bonus |
| **Filtering/Sorting (Bonus)** | Sort/filter table                                                                     | Dropdown sort supported (price, volume, rank, % change, name)                                                        | ✅ Bonus |
| **Deployment (Bonus)**        | Deploy app                                                                            | Frontend deployed on **Vercel**; Backend deployed on **Render**                                                      | ✅ Bonus |
| **Tests (Bonus)**             | Unit tests                                                                            | Added backend unit tests (pytest) and frontend tests (Vitest)                                                        | ✅ Done |
| **Documentation**             | README with setup, logic explanation, assumptions                                     | This README includes setup, coverage matrix, timeline, and walkthrough                                               | ✅ Done  |

---

## ⏱ Timeline Breakdown (4 Hours)

| Time  | Features Implemented                                                                 | Impact on User Experience |
|-------|---------------------------------------------------------------------------------------|----------------------------|
| **Hour 1** | - Setup FastAPI + SQLite ORM models<br>- Ingestion pipeline from CoinGecko (`/sync`)<br>- `/coins` & `/coins/{id}/history` endpoints | 🔹 Reliable data foundation<br>🔹 Immediate access to crypto prices & trends |
| **Hour 2** | - Rule-based Q&A endpoint `/qa`<br>- JWT auth (register/login)<br>- Favorites API (add/remove/list) | 🔹 Natural chat queries<br>🔹 Personalized experience<br>🔹 Favorites ⭐ for engagement |
| **Hour 3** | - React + Vite setup<br>- Dashboard Table (sortable)<br>- TrendChart (Chart.js) with tooltips<br>- Chat Assistant UI | 🔹 Clean data visualization<br>🔹 Interactive charts<br>🔹 Conversational assistant |
| **Hour 4** | - Auth modal (login/register)<br>- Favorites integration in table<br>- Dark/Light theme toggle<br>- Skeleton loaders + gradients<br>- Walkthrough (guided tour) | 🔹 Smooth, polished UX<br>🔹 Personalized themes<br>🔹 Easy onboarding with tooltips |

---

## 🛠 Setup Instructions

### Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend (React + Vite + TS)
```bash
cd frontend
npm install
npm run dev   # runs at http://localhost:5173
```

### Environment Variables
- **Frontend**: `VITE_API_URL=https://crypto-dashboard-ldxf.onrender.com`  
- **Backend**: No external vars required (SQLite DB auto-created).  

---

## 💬 Chat Assistant Logic
- **Rule-based string parsing** using keywords like `price`, `trend`, `7-day`, `btc`, `eth`.  
- Routes queries to:  
  - `/coins` → price lookup.  
  - `/coins/{id}/history` → trend lookup.  
- Fallback: returns `"Sorry, I didn't understand the query."`.  

---

## 🌟 Features to Improve
- Expand Q&A with NLP intent classification.  
- Add pagination & filters for more coins.  
- Extend test coverage (frontend + backend).  
- CI/CD pipelines for automated deployment.  
