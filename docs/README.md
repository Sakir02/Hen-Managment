# 📚 Hen Management System — Project Documentation

Welcome to the central documentation hub for the **Hen Management System**. All guides and technical documentation are kept organized inside this directory.

---

## 📑 Available Guides

### 1. 🚀 [Live Server Deployment Guide](DEPLOYMENT_GUIDE.md)
The complete zero-to-production deployment guide:
- Setting up the free PostgreSQL database on Neon.tech.
- Deploying the Django REST API on Render.com.
- Deploying the React 19 / Vite Web Admin on Vercel.
- Building and releasing the Android `.apk` via Expo EAS.
- Keeping the free server awake 24/7 with zero cold starts.

### 2. 📊 [Server & Pricing Comparison](SERVER_AND_PRICING_COMPARISON.md)
Detailed breakdown of hosting resources:
- How much free disk space you get (Neon 500 MB, Supabase 1 GB, Render 512 MB, Vercel 100 GB).
- Data capacity math: why 500 MB holds 730,000+ records and lasts 10+ years.
- When and how to upgrade to a cheap dedicated VPS ($4/month).

### 3. 🏗️ [System Architecture & Codebase Overview](PROJECT_ARCHITECTURE.md)
Technical structure of the monorepo:
- Backend Django apps (`customers`, `hens`, `rates`, `payments`, `audit`).
- Web Admin components (`web/src/admin/pages`).
- Mobile app screens and data contexts (`mobile/src`).
- JWT authentication flow & database models.

### 4. 💻 [Local Development Setup Guide](LOCAL_SETUP_GUIDE.md)
How to run the full stack on your local machine:
- Starting Django backend API (`manage.py runserver`).
- Starting Web Admin portal (`npm run dev`).
- Starting Mobile App with Expo tunnel (`npx expo start --tunnel`).
