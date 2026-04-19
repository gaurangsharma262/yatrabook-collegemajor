# 📡 YatraBook — API Documentation

**Base URL:** `http://localhost:5000/api`

All responses follow this format:
```json
{
  "success": true,
  "message": "Description",
  "data": { ... }
}
```

---

## 🔐 Authentication

### POST `/auth/register`
Create a new user account.

**Body:**
```json
{
  "name": "Gaurav Sharma",
  "email": "gaurav@example.com",
  "password": "securepassword",
  "phone": "9876543210"
}
```

**Response:** `201 Created` — Returns `{ user, token }`

---

### POST `/auth/login`
Login with email and password.

**Body:**
```json
{
  "email": "gaurav@example.com",
  "password": "securepassword"
}
```

**Response:** `200 OK` — Returns `{ user, token }`

---

### GET `/auth/me`
Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

---

## 🚂 Trains

### GET `/trains/search`
Search trains by route.

**Query Params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| from | string | ✅ | Source city or station code |
| to | string | ✅ | Destination city or station code |
| date | string | ❌ | Travel date (YYYY-MM-DD) |
| sort | string | ❌ | `price_asc`, `duration_asc`, `rating_desc` |
| class | string | ❌ | `1A`, `2A`, `3A`, `SL`, `CC`, `2S` |
| page | number | ❌ | Page number (default: 1) |
| limit | number | ❌ | Results per page (default: 20) |

**Example:** `GET /trains/search?from=Delhi&to=Mumbai&sort=price_asc&class=3A`

---

### GET `/trains/:id`
Get train details by trainId.

### GET `/trains/:id/availability?class=SL`
Check seat availability for a specific class.

### GET `/trains/stations`
Get all unique stations.

### GET `/trains/popular`
Get popular routes.

---

## ✈️ Flights

### GET `/flights/search`
Search flights (same query params as trains).

### GET `/flights/:id`
Get flight details.

### GET `/flights/airports`
Get all airports.

---

## 🚌 Buses

### GET `/buses/search`
Search buses (same query params as trains).

### GET `/buses/:id`
Get bus details.

### GET `/buses/operators`
Get all bus operators.

---

## 🎫 Bookings (Requires Auth)

### POST `/bookings`
Create a new booking.

**Body:**
```json
{
  "type": "train",
  "travelId": "12301",
  "travelDate": "2026-05-01",
  "class": "3A",
  "passengers": [
    { "name": "Gaurav Sharma", "age": 22, "gender": "male" },
    { "name": "Priya Sharma", "age": 20, "gender": "female" }
  ],
  "paymentMethod": "upi"
}
```

**Response:** `201 Created` — Returns booking with `bookingId`, `pnr`, seat details.

---

### GET `/bookings`
Get user's booking history.

### GET `/bookings/:id`
Get booking details by bookingId.

### PATCH `/bookings/:id/cancel`
Cancel a booking (restores seats).

**Body:** `{ "reason": "Change of plans" }`

---

## 🧠 Recommendations

### GET `/recommend/cheapest?from=Delhi&to=Mumbai`
Get cheapest option across trains, flights, buses.

### GET `/recommend/fastest?from=Delhi&to=Mumbai`
Get fastest option across all modes.

### POST `/recommend/multi-city`
Plan a multi-city trip.

**Body:**
```json
{
  "cities": ["Delhi", "Jaipur", "Udaipur", "Mumbai"]
}
```

---

## 👤 User Profile (Requires Auth)

### GET `/users/profile`
Get user profile.

### PUT `/users/profile`
Update profile (name, phone, avatar).

### GET `/users/recent-searches`
Get recent searches.

### DELETE `/users/recent-searches`
Clear recent searches.
