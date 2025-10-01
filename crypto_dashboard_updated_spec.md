# 📌 Crypto Dashboard – Updated Spec

## 🎯 Objective
Build a crypto dashboard with a **chat assistant** and support for **user authentication** + **favorite coins**. The system fetches live cryptocurrency data from CoinGecko, persists it in a database, and provides both REST APIs and a frontend UI.

---

## 🔹 Backend Features

### 1. Data Ingestion
- Fetches top N coins from CoinGecko.  
- Fetches historical price data (last 30 days).  
- Stores in relational DB (SQLite by default).  
- API:  
  - `POST /sync` → syncs latest top N + history.  
  - `GET /coins` → returns top coins (sortable).  
  - `GET /coins/{coin_id}/history` → returns historical series.  

### 2. Chat Assistant (Rule-Based Q&A)
- Endpoint: `POST /qa`  
- Keyword-based parser for queries like:  
  - “What is the price of Bitcoin?”  
  - “Show me 7-day trend of Ethereum.”  
- Maps query → DB lookup → structured JSON response.  

### 3. Authentication (JWT)
- Endpoint:  
  - `POST /auth/register` → register new user.  
  - `POST /auth/login` → login and get JWT token.  
- Passwords hashed with **pbkdf2_sha256** (no 72-byte issue).  
- JWT contains username as subject.  
- Middleware for `get_current_user` → required for favorites.  

### 4. Favorites
- Endpoint:  
  - `GET /favorites` → list logged-in user’s favorites.  
  - `POST /favorites/{coin_id}` → add a coin to favorites.  
  - `DELETE /favorites/{coin_id}` → remove a coin.  
- Uses JWT-protected routes.  
- Prevents duplicate favorites with DB constraint.  

---

## 🔹 Frontend Features

### 1. Dashboard Page
- **Table of top 10 coins** with:  
  - Name, Symbol, Rank  
  - Price, % Change, Volume, Market Cap  
  - ⭐ Favorite toggle (auth only)  
- **Line chart** showing selected coin’s 30-day price trend.  
  - Tooltip on hover shows `$value`.  
  - Dark & light mode support.  

### 2. Chat Assistant Panel
- Users type natural queries.  
- Assistant calls `/qa` backend API.  
- Shows response inline in chat bubble style.  

### 3. Authentication UI
- Modal for **Login / Register**.  
- Stores JWT in `localStorage`.  
- Shows login state (e.g. user’s name).  
- Enables favorite ⭐ button only if logged in.  

### 4. User Experience Enhancements
- Responsive, gradient-based styling.  
- Skeleton loaders for tables & charts.  
- Guided tooltips (walkthrough for first-time users).  

---

## 🔹 Coverage Matrix

| Requirement                          | Implemented | Impact on UX |
|--------------------------------------|-------------|--------------|
| Fetch top N coins                    | ✅ Yes       | High – core dashboard data |
| Fetch 30-day historical prices       | ✅ Yes       | High – enables charts |
| Store data in DB                     | ✅ Yes       | Medium – caching & persistence |
| Get top coins API                    | ✅ Yes       | High – feeds UI |
| Get history API                      | ✅ Yes       | High – drives charts |
| Rule-based chat assistant            | ✅ Yes       | Medium – interactive queries |
| Auth: Register/Login (JWT)           | ✅ Yes       | High – enables personalization |
| Password hashing (pbkdf2_sha256)     | ✅ Yes       | High – secure accounts |
| Favorites CRUD APIs                  | ✅ Yes       | High – personalization feature |
| Frontend table (top coins)           | ✅ Yes       | High – main UI |
| Frontend line chart                  | ✅ Yes       | High – data visualization |
| Frontend chat panel                  | ✅ Yes       | Medium – interactive experience |
| Frontend auth modal                  | ✅ Yes       | High – user management |
| Favorites integration in UI          | ✅ Yes       | High – UX boost |
| Dark/light theme                     | ✅ Yes       | Medium – accessibility |
| Skeleton loaders                     | ✅ Yes       | Medium – smoother UX |
| Guided tooltips                      | ✅ Yes       | Medium – onboarding |
| Deployment (optional)                | ⚠️ Pending   | Medium – live demo |
| Unit tests (optional)                | ⚠️ Pending   | Medium – reliability |

---

## 🔹 Evaluation Highlights
- **Backend**: Modular, clean, covers both crypto + auth + favorites.  
- **Frontend**: Professional design, responsive, theme support, UX extras.  
- **Chat Assistant**: Rule-based but functional, can be extended later.  
- **Auth**: Secure with JWT + PBKDF2.  
- **Favorites**: Completes personalization flow.  
