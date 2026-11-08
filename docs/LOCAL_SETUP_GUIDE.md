# 💻 Local Development Setup Guide

Follow this guide to run the entire **Hen Management System** locally on your computer.

---

## 📋 Prerequisites
- **Python 3.11+ or 3.12+**
- **Node.js 18+ or 20+**
- **PostgreSQL 15+** (Installed locally on port 5432, or use a free Neon cloud DB for local testing)
- **Expo Go App** (Installed on your Android or iPhone from Google Play Store or App Store)

---

## 1. Backend Setup (Django REST API)

1. Open PowerShell and navigate to the project root:
   ```powershell
   cd "c:\HEN PROJECT"
   ```

2. Activate the Python virtual environment:
   ```powershell
   .venv\Scripts\Activate.ps1
   ```
   *(If you don't have a `.venv` yet, run `python -m venv .venv` first).*

3. Install required packages:
   ```powershell
   pip install -r backend\requirements.txt
   ```

4. Verify your `backend/.env` file:
   Ensure it contains:
   ```env
   DEBUG=True
   SECRET_KEY=django-insecure-hen-management-local-dev-key
   ALLOWED_HOSTS=*
   DB_NAME=hen_management_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=127.0.0.1
   DB_PORT=5432
   CORS_ALLOW_ALL_ORIGINS=True
   ```

5. Run database migrations:
   ```powershell
   python backend\manage.py migrate
   ```

6. Create a superuser (Admin login):
   ```powershell
   python backend\manage.py createsuperuser
   ```

7. Start the Django API server:
   ```powershell
   python backend\manage.py runserver 0.0.0.0:8000
   ```
   - Django API root: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
   - Django Admin: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## 2. Web Admin Setup (React 19 + Vite)

Open a **new** terminal window:

1. Navigate to the `web` directory:
   ```powershell
   cd "c:\HEN PROJECT\web"
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start Vite development server:
   ```powershell
   npm run dev
   ```
   - Web Admin URL: [http://localhost:5173/](http://localhost:5173/)

---

## 3. Mobile App Setup (React Native + Expo)

Open a **third** terminal window:

1. Navigate to the `mobile` directory:
   ```powershell
   cd "c:\HEN PROJECT\mobile"
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start Expo with Tunnel mode (allows your phone to connect over Wi-Fi/4G):
   ```powershell
   npx expo start --tunnel
   ```
   *(Or simply run the root batch script: `.\run-expo.bat`)*.

4. Scan the QR code:
   - On Android: Open the **Expo Go** app and tap **Scan QR code**.
   - On iOS: Open the camera app and scan the QR code to open in Expo Go.

---

## 4. Root Monorepo Helper Commands

From the root `c:\HEN PROJECT`, you can use the npm scripts defined in [package.json](file:///c:/HEN%20PROJECT/package.json):

| Command | Action |
| :--- | :--- |
| `npm run mobile` | Starts Expo mobile app with tunnel mode |
| `npm run web-admin` | Starts the React Vite admin dashboard |
| `npm run android` | Starts mobile app targeting Android emulator |
| `npm run web` | Runs the mobile app in web browser mode |
