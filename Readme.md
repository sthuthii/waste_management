# ♻️ Smart Waste Collection System

A scalable, real-time, role-based web app to digitize and track door-to-door waste collection. Built using **React (Vite)** and **Firebase**.

---

## 🚀 Live Demo

[👉 Click here to access the deployed version](#)

---

## 🔐 Role-Based Access

| Role     | Description |
|----------|-------------|
| 👷 Worker | Logs house-wise waste collection with real-time sync |
| 🧑‍⚕️ Admin | Monitors collection status, assigns wards/houses, views reports |
| 🙋 Citizen | Reports missed pickups with photo and message |

---

## ✅ Features Implemented

### 👷 Worker Dashboard
- View assigned houses based on `workerID`
- Log collection for each house (`collectedToday`)
- Auto-tracked location + timestamp (`collectedAt`)
- Reset log (set `collectedToday: false`)
- Realtime updates from Admin via Firestore listener
- Logout & protected access

### 🧑‍⚕️ Admin Dashboard
- Manage workers and their ward assignment
- Seed and manage house list with assigned worker & ward
- View all houses with collection status
- Reset any house's collection log
- Google Maps view for collection logs with geolocation
- View citizen complaints with photos & messages

### 🙋 Citizen Portal
- Report missed pickups with a message
- Upload image evidence (via Firebase Storage)
- Track submission status
- Data stored in Firestore under `reports/`

### 🔐 Authentication
- Firebase Auth with email/password
- Role selected at signup
- Auth-guarded routing (`ProtectedRoute`)

---

## 🛠 Tech Stack

- **Frontend**: React (Vite)
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Maps**: Google Maps API
- **Hosting**: Firebase Hosting / Vercel

---

## 🔮 Features To Be Added (Future Scope)

| Feature | Description |
|--------|-------------|
| 📲 NFC Integration | Use NFC tags to auto-log collection when worker is nearby |
| 📦 QR Code Scanning | Citizens can scan house QR to file missed pickup |
| 📅 Auto Daily Reset | Cloud Function to reset `collectedToday` every midnight |
| 📈 Collection Analytics | Admin dashboard charts for ward-wise stats |
| 🔔 Notifications | Alert admins when complaints are filed |
| 🕓 History Logs | Store daily collection logs for each house (`collectionHistory`) |

---

## 🧑‍💻 Running Locally

```bash
git clone https://github.com/yourusername/smart-waste-app.git
cd smart-waste-app
npm install
npm run dev
