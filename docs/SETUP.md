# 📖 YatraBook — Setup Guide

## Prerequisites

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **npm** v9+
- **MongoDB Atlas** account (free tier: [cloud.mongodb.com](https://cloud.mongodb.com))
- **Git** (optional, for version control)

---

## Step 1: Clone / Navigate to Project

```bash
cd "Travel Booking Platform"
```

---

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd server
npm install
```

### 2.2 Configure Environment

1. Open `server/.env`
2. Replace `MONGODB_URI` with your Atlas connection string:

```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/yatrabook?retryWrites=true&w=majority
```

> **How to get your Atlas connection string:**
> 1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
> 2. Click your cluster → "Connect" → "Connect your application"
> 3. Copy the connection string
> 4. Replace `<password>` with your database user's password

### 2.3 Extract Data Files (first time only)

The project uses real Indian train and flight data. Extract the zip files:

```powershell
# PowerShell
Expand-Archive -Path "trains.json.zip" -DestinationPath "temp_trains" -Force
Expand-Archive -Path "stations.json.zip" -DestinationPath "temp_stations" -Force
Expand-Archive -Path "schedules.json.zip" -DestinationPath "temp_schedules" -Force
```

### 2.4 Seed the Database

```bash
cd server
npm run seed
```

This will:
- Transform 200 trains from your raw data
- Transform 200 flights from your CSV
- Generate 100+ buses
- Create a demo user: `demo@yatrabook.com` / `demo123456`

### 2.5 Start the Backend

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

Verify: Open `http://localhost:5000/api/health`

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd client
npm install
```

### 3.2 Start the Frontend

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

The Vite proxy will forward `/api` requests to the backend automatically.

---

## Step 4: Using the App

1. Open `http://localhost:5173`
2. Register a new account or use demo credentials
3. Search for trains/flights/buses between Indian cities
4. Book a ticket → See confirmation
5. Check dashboard for booking history

---

## Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Check your Atlas connection string in `.env` |
| `npm` not found | Install Node.js from [nodejs.org](https://nodejs.org) |
| Port 5000 in use | Change `PORT` in `server/.env` |
| No search results | Run `npm run seed` to populate the database |
| CORS errors | Ensure `CLIENT_URL` in `.env` matches your frontend URL |
