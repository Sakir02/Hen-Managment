# 🐓 Hen Management System Monorepo

Enterprise Management System for Poultry Operations, Rates, Customer Ledgers, Sales Orders, Payments, and Audit Trails.

---

## 🗂️ Project Structure

- **`backend/`**: Django REST Framework API + SimpleJWT + PostgreSQL
- **`web/`**: React 19 + Vite Enterprise Admin Dashboard
- **`mobile/`**: React Native + Expo Cross-Platform Mobile App
- **`docs/`**: Complete Project Documentation & Deployment Guides

---

## 📖 Documentation Quick Links

All project documentation is located inside the **[`docs/`](docs/)** directory:

- 🚀 **[Live Server Deployment Guide (0 to Production)](docs/DEPLOYMENT_GUIDE.md)**
- 📊 **[Server & Free Space Pricing Comparison](docs/SERVER_AND_PRICING_COMPARISON.md)**
- 🏗️ **[System Architecture & Tech Specs](docs/PROJECT_ARCHITECTURE.md)**
- 💻 **[Local Development Setup Guide](docs/LOCAL_SETUP_GUIDE.md)**
- 📑 **[Documentation Hub Index](docs/README.md)**

---

## ⚡ Quick Start (Local Run)

```powershell
# 1. Run Mobile App
npm run mobile

# 2. Run Web Admin Dashboard
npm run web-admin

# 3. Run Backend API
.venv\Scripts\python.exe backend\manage.py runserver
```
