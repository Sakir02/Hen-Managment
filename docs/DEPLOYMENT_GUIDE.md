# 🚀 Hen Management System — Complete Live Server Deployment Guide (From Zero to Production)

This guide provides end-to-end instructions for deploying all three components of the Hen Management System:
1. **Backend API** (Django REST Framework + SimpleJWT + PostgreSQL)
2. **Web Admin Dashboard** (React 19 + Vite)
3. **Mobile App** (React Native + Expo)

---

## 📌 Table of Contents
1. [Server Selection & Free Space Comparison](#1-server-selection--free-space-comparison)
2. [Data Capacity Math: How Long Does Free Space Last?](#2-data-capacity-math-how-long-does-free-space-last)
3. [Recommended 100% Free Architecture](#3-recommended-100-free-architecture)
4. [Step 0: GitHub Repository Preparation](#step-0-github-repository-preparation)
5. [Step 1: Free PostgreSQL Database Setup (Neon.tech)](#step-1-free-postgresql-database-setup-neontech)
6. [Step 2: Deploy Django Backend API (Render.com)](#step-2-deploy-django-backend-api-rendercom)
7. [Step 3: Deploy Web Admin Dashboard (Vercel)](#step-3-deploy-web-admin-dashboard-vercel)
8. [Step 4: Build & Deploy Expo Mobile App (EAS Android APK)](#step-4-build--deploy-expo-mobile-app-eas-android-apk)
9. [Step 5: Keeping Free Servers Awake (24/7 Uptime Trick)](#step-5-keeping-free-servers-awake-247-uptime-trick)
10. [Alternative: $4/month Dedicated Cloud VPS (Hetzner / DigitalOcean)](#10-alternative-4month-dedicated-cloud-vps-hetzner--digitalocean)

---

## 1. Server Selection & Free Space Comparison

To host this full-stack system, you need three hosting roles: **Database**, **Backend Server**, and **Frontend CDN**. Here is how the top free cloud providers compare:

| Provider | Component | Free Disk / Storage | Free RAM / Compute | Free Bandwidth | Sleep / Expiration Rules | Verdict / Best For |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Neon.tech** | PostgreSQL Database | **500 MB (0.5 GB)** | Serverless (Autoscaling) | 5 GB / month | **Never deleted**, always active | 🥇 **Best Free Database** |
| **Supabase** | PostgreSQL + Media Storage | **500 MB DB + 1 GB Storage** | 2 Free Projects | 2 GB / month | Pauses after 7 days of inactivity (unpause with 1 click) | 🥈 Great for DB + Image uploads |
| **Render.com** | Django Backend API | Ephemeral disk (resets on restart) | **512 MB RAM**, 0.1 CPU | 100 GB / month | Sleeps after 15 min idle (takes ~45s to wake up on first visit) | 🥇 **Best Free Python Backend** |
| **Vercel** | React/Vite Web Admin | Unlimited static | High-speed Edge CDN | **100 GB / month** | **Never sleeps**, instant global CDN | 🥇 **Best Free Web Frontend** |
| **Cloudflare Pages** | React/Vite Web Admin | Unlimited static | Edge CDN | **Unlimited Bandwidth** | **Never sleeps**, 100% free | 🥈 Solid alternative to Vercel |
| **Expo EAS** | Mobile App (.apk build) | Unlimited build storage | Cloud build runners | Free tier | **30 free cloud builds per month** | 🥇 **Best for Android APK** |
| **PythonAnywhere** | Django Backend | 512 MB disk | Shared CPU | Limited | Free tier blocks external PostgreSQL databases | ❌ Not recommended for Postgres |
| **Render Free PostgreSQL** | PostgreSQL Database | 1 GB | Shared | 100 GB | ⚠️ **Deleted automatically after 30 days!** | ❌ Avoid for production DB |
| **Oracle Cloud Always Free** | Cloud VPS (Linux) | **200 GB NVMe Disk** | **24 GB RAM**, 4 OCPU ARM | 10 TB / month | Forever free, but requires credit card verification | 🏆 Best self-hosted VPS if approved |

---

## 2. Data Capacity Math: How Long Does Free Space Last?

A common question is: *"Is 500 MB database space enough for my hen management business?"*

### Database Record Calculation:
- **1 Hen Sales / Customer Transaction record** in PostgreSQL takes approximately **0.5 KB to 0.8 KB** of storage.
- In **500 MB (512,000 KB)**:
  $$\frac{512,000 \text{ KB}}{0.7 \text{ KB/record}} \approx \mathbf{730,000 \text{ records}}$$

### Real-world Business Timeline:
If your hen operations business records:
- 30 customer sales orders per day
- 30 payment receipts per day
- 20 audit log actions per day
- **Total:** ~80 rows per day = ~29,200 rows per year.

$$\frac{730,000 \text{ rows}}{29,200 \text{ rows/year}} \approx \mathbf{25\text{ Years of data!}}$$

> 💡 **Summary**: The free **500 MB database** on Neon or Supabase is more than enough to store business records for **over 5 to 10 years** without paying a single dollar.

---

## 3. Recommended 100% Free Architecture

```
                      ┌──────────────────────────────────────────────┐
                      │              CLIENT PLATFORMS                │
                      │                                              │
                      │   📱 Mobile App (Android APK via Expo EAS)   │
                      │   💻 Web Admin (React Vite on Vercel CDN)    │
                      └──────────────────────┬───────────────────────┘
                                             │ HTTPS API Requests
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │             BACKEND API SERVER               │
                      │         Render.com (Python 3 / Gunicorn)     │
                      │        - SimpleJWT Authentication            │
                      │        - Django REST Framework               │
                      └──────────────────────┬───────────────────────┘
                                             │ Secure TLS Connection
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │            POSTGRESQL DATABASE               │
                      │            Neon.tech (500 MB Free)           │
                      │        - Persistent storage (No 30d wipe)    │
                      │        - Automated daily backups             │
                      └──────────────────────────────────────────────┘
```

---

## Step 0: GitHub Repository Preparation

Cloud providers like Render and Vercel automatically deploy directly from your GitHub repository.

### 1. Ensure `.env` is NOT tracked in Git
We have already created the root `.gitignore` in your project to prevent pushing secrets, virtual environments, or `node_modules`.

### 2. Commit and Push to GitHub
Open PowerShell in `c:\HEN PROJECT`:
```powershell
git init
git add .
git commit -m "feat: configure cloud production deployment"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/hen-management-system.git
git push -u origin main
```
*(Make the repository **Private** if you do not want public access to your code).*

---

## Step 1: Free PostgreSQL Database Setup (Neon.tech)

We use **Neon.tech** because unlike Render's free database (which deletes your data after 30 days), **Neon is permanent and free forever**.

1. Go to **[https://neon.tech](https://neon.tech)** and click **Sign Up** (Sign in with your GitHub account).
2. Click **Create Project**:
   - **Project Name:** `hen-management-db`
   - **Postgres Version:** `16` or `17` (latest)
   - **Region:** Choose the region closest to you (e.g., `Singapore (ap-southeast-1)` or `Frankfurt (eu-central-1)` or `US East`).
3. Click **Create Project**.
4. You will see a connection string screen:
   - Select the dropdown: **Connection string**
   - Click the **Parameters only** or **URI** tab.
   - It will look like:
     ```
     postgresql://neondb_owner:npg_xX123Abc@ep-cool-fog-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
     ```
5. **Copy this entire URI** and save it in your notepad. You will paste this into Render in Step 2.

---

## Step 2: Deploy Django Backend API (Render.com)

1. Go to **[https://render.com](https://render.com)** and sign up / log in with **GitHub**.
2. Click **New +** in the top navigation bar and select **Web Service**.
3. Choose **Build and deploy from a Git repository**, click **Next**, and select your `hen-management-system` repository.
4. Fill in the service configuration:
   - **Name:** `hen-backend-api` (or any custom name)
   - **Region:** Select the same region or nearest to your Neon database (e.g., `Singapore` or `Frankfurt` or `Oregon`).
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
     ```
   - **Start Command:**
     ```bash
     gunicorn config.wsgi:application
     ```
   - **Instance Type:** Select **Free** (512 MB RAM, 0.1 CPU).

5. Scroll down to **Environment Variables** and add the following keys:

| Environment Variable | Recommended Value | Note |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://neondb_owner:...` | Paste the exact URI copied from Neon in Step 1 |
| `SECRET_KEY` | `prod-secret-hen-mgr-9842a!@#x` | A strong random secret key |
| `DEBUG` | `False` | Turn off Django debug mode for security |
| `ALLOWED_HOSTS` | `*` | Or `hen-backend-api.onrender.com` |
| `CORS_ALLOW_ALL_ORIGINS` | `True` | Allows Web and Mobile apps to communicate with API |
| `PYTHON_VERSION` | `3.12.0` | Recommended modern Python runtime |

6. Click **Deploy Web Service**.
7. Render will pull your code, install dependencies, run database migrations on Neon, collect static files, and start Gunicorn.
8. Once deployment is complete, Render will provide your live API URL:
   ```
   https://hen-backend-api.onrender.com
   ```

### Create Django Superuser (Admin account):
1. In the Render Dashboard for your web service, click **Shell** in the left menu.
2. Type:
   ```bash
   python manage.py createsuperuser
   ```
3. Enter your desired admin username, email, and password.
4. You can now access Django Admin at: `https://hen-backend-api.onrender.com/admin/`

---

## Step 3: Deploy Web Admin Dashboard (Vercel)

Vercel provides free, high-speed hosting with SSL certificates and automatic continuous deployment.

1. Go to **[https://vercel.com](https://vercel.com)** and sign in with **GitHub**.
2. Click **Add New...** > **Project**.
3. Locate your `hen-management-system` repository and click **Import**.
4. In the project setup screen:
   - **Project Name:** `hen-management-web`
   - **Framework Preset:** `Vite` (Vercel automatically detects this)
   - **Root Directory:** Click **Edit** and select `web`.
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
5. Expand **Environment Variables**:
   - Add:
     - **Key:** `VITE_API_BASE_URL`
     - **Value:** `https://hen-backend-api.onrender.com` (Your live Render backend URL from Step 2)
6. Click **Deploy**.
7. In ~30 seconds, Vercel will complete the build and provide a live URL, for example:
   ```
   https://hen-management-web.vercel.app
   ```
8. We have already included `web/vercel.json` in your repository to prevent 404 errors when refreshing SPA routes.

---

## Step 4: Build & Deploy Expo Mobile App (EAS Android APK)

You can build a standalone **Android `.apk` file** that can be directly installed on any Android phone (or distributed via WhatsApp / Google Drive to staff).

### 1. Configure the Live Backend URL in Mobile App
Open your mobile app's API configuration or context file and point the base URL to your Render backend:
```javascript
export const API_BASE_URL = 'https://hen-backend-api.onrender.com';
```

### 2. Install EAS CLI and Log In
Open PowerShell inside `c:\HEN PROJECT\mobile`:
```powershell
npm install -g eas-cli
eas login
```
*(If you don't have an Expo account yet, register for free at [https://expo.dev](https://expo.dev)).*

### 3. Initialize EAS in Mobile Project
```powershell
eas build:configure
```
Select **Android** (or All). This creates an `eas.json` file.

### 4. Configure `eas.json` for Direct APK Generation
Ensure your `mobile/eas.json` includes the `apk` build type under preview:
```json
{
  "cli": {
    "version": ">= 15.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

### 5. Start the Cloud Build
Run the command:
```powershell
eas build -p android --profile preview
```
- Expo builds the `.apk` on their cloud servers (you don't need Android Studio).
- When finished, EAS provides a **direct download link and QR code**.
- Scan the QR code or click the download link on your Android phone to install the APK!

---

## Step 5: Keeping Free Servers Awake (24/7 Uptime Trick)

Render's free tier spins down the web service after 15 minutes of inactivity. When a user opens the app after it's asleep, the first request takes ~45 seconds to wake up.

### How to keep it awake 24/7 for FREE:
1. Go to **[https://cron-job.org](https://cron-job.org)** or **[https://uptimerobot.com](https://uptimerobot.com)** (both are 100% free).
2. Create an account.
3. Add a new monitor / cron job:
   - **URL:** `https://hen-backend-api.onrender.com/admin/login/` (or your health check endpoint)
   - **Execution Interval:** Every **10 minutes**.
4. This sends a lightweight ping every 10 minutes, keeping your Render backend permanently warm and ready with zero lag!

---

## 10. Alternative: $4/month Dedicated Cloud VPS (Hetzner / DigitalOcean)

If your business grows and you want an all-in-one private Linux server with dedicated resources, zero cold starts, and full control:

### Provider Recommendations:
- **Hetzner Cloud (CX22):** ~€3.79 / month (~$4.10) — 2 vCPUs, 4 GB RAM, 40 GB NVMe SSD, 20 TB traffic. (Best performance-to-price ratio in the world).
- **DigitalOcean Basic Droplet:** $4 - $6 / month — 1 vCPU, 1 GB RAM, 25 GB SSD.
- **Hostinger VPS 1:** ~$5.50 / month — 1 vCPU, 4 GB RAM, 50 GB NVMe.

### Deployment on a Ubuntu VPS (Quick Blueprint):
1. **Connect via SSH:**
   ```bash
   ssh root@YOUR_SERVER_IP
   ```
2. **Install Docker & Docker Compose:**
   ```bash
   apt update && apt install -y docker.io docker-compose git nginx certbot python3-certbot-nginx
   ```
3. **Clone Repo & Run with Docker Compose:**
   Run PostgreSQL, Django (Gunicorn), and Nginx in lightweight containers.
4. **SSL Setup:**
   ```bash
   certbot --nginx -d api.yourdomain.com -d admin.yourdomain.com
   ```
   Certbot provides free auto-renewing SSL certificates.
