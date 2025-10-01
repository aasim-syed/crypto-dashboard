# 🚀 Crypto Dashboard with Chat Assistant + Favorites

## 📌 What This Project Solves

Tracking cryptocurrency data can be overwhelming:  
- Most platforms show raw numbers without context.  
- Users have to jump between multiple sources to compare coins.  
- Personalized tracking (like favorites) is locked behind heavy platforms.  

**This project solves that problem** by delivering a **lightweight, interactive crypto dashboard** with:  
- **Clean visualization** of top coins and their price history.  
- **Natural query interface** (chat assistant) to get answers quickly.  
- **Personalized experience** with login & favorites ⭐.  
- **Polished UI** (dark/light mode, tooltips, skeleton loaders) for smooth user experience.  

👉 In just a few hours, this app demonstrates **end-to-end fullstack skills**:  
data ingestion → backend APIs → frontend UI → authentication → personalization.

---

## ✨ Features

### 🔹 Backend
- **Live Crypto Data** from [CoinGecko API](https://www.coingecko.com/).  
- **Database persistence** (SQLite) for top coins & 30-day history.  
- **REST APIs**:  
  - `POST /sync` → fetch top coins + history  
  - `GET /coins` → top N coins  
  - `GET /coins/{id}/history` → historical prices  
  - `POST /qa` → rule-based Q&A assistant  
  - `POST /auth/register` & `POST /auth/login` → JWT authentication  
  - `GET/POST/DELETE /favorites/*` → manage user’s favorite coins  

### 🔹 Frontend
- **Dashboard Table**: top 10 coins with rank, price, volume, % change.  
- **Trend Chart**: interactive 30-day price graph with hover tooltips.  
- **Chat Assistant Panel**: ask queries in plain English (“What’s BTC price?”).  
- **Auth Modal**: login/register with JWT.  
- **Favorites ⭐**: mark coins to track personally.  
- **Polished UX**: dark/light mode, gradients, skeleton loaders, guided tooltips.  

---

## 🛠️ Tech Stack
- **Backend**: FastAPI, SQLAlchemy, SQLite, httpx, JWT, Passlib (pbkdf2).  
- **Frontend**: React (Vite + TS), Chart.js, TailwindCSS.  
- **Auth**: JWT-based, secure password hashing with pbkdf2.  

---

## 🌟 Why It Matters
- **For users**: Simple, fast, and personalized crypto insights.  
- **For developers**: Showcases integration of API + DB + Auth + UI.  
- **For evaluators**: Demonstrates full-stack capability (backend + frontend + UX polish) in just 4 hours.  

---

## 🚀 Future Improvements
- Add real-time WebSocket updates for live prices.  
- Extend chat assistant to LLM-powered semantic Q&A.  
- Deploy to cloud (Vercel + Render/Heroku) for public demo.  
- Unit tests & CI/CD pipeline for production-readiness.  

---

## ⚡ Quickstart

### 1. Clone Repo
```bash
git clone https://github.com/aasim-syed/crypto-dashboard.git
cd crypto-dashboard
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# or: source .venv/bin/activate  # Linux/Mac

pip install -r requirements.txt

# Copy env file
cp .env.example .env

# Run server
uvicorn app.main:app --reload --port 8000
```
Backend will be running on: [http://localhost:8000](http://localhost:8000)  

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be running on: [http://localhost:5173](http://localhost:5173)  

### 4. Access APIs & UI
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)  
- Dashboard: [http://localhost:5173](http://localhost:5173)  

---

## ✅ Features Completed in 4 Hours

| Time | Features | Impact on UX |
|------|-----------|--------------|
| Hour 1 | Backend setup, DB models, CoinGecko sync, `/coins` + `/history` APIs | Core data available instantly |
| Hour 2 | Rule-based Q&A, JWT Auth, Favorites API | Chat + personalization boost |
| Hour 3 | React setup, Dashboard table, Trend chart, Chat panel | Data viz + interactive queries |
| Hour 4 | Auth modal, Favorites ⭐ UI, Dark/Light mode, skeleton loaders, guided tooltips | Smooth UX, personalization, polish |

---

🔥 With just 4 hours of work, this project delivers a **full-stack crypto dashboard** that is **functional, interactive, secure, and user-friendly**.
