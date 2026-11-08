# 🏗️ System Architecture & Codebase Overview

This document provides a technical overview of the **Hen Management System** codebase, detailing how the backend, web admin portal, and mobile app interact.

---

## 1. Monorepo Structure

```
HEN PROJECT/
├── backend/                  # Python 3 + Django 6 REST Framework Backend
│   ├── apps/
│   │   ├── access_control/   # Role-based access control (RBAC), permission matrices
│   │   ├── audit/            # Tamper-proof audit logs, actor tracking, diffs
│   │   ├── authentication/   # Custom User model, SimpleJWT authentication
│   │   ├── core/             # Base models, custom pagination, exception handlers
│   │   ├── customers/        # Customer profiles, balances, credit limits, ledgers
│   │   ├── hens/             # Hen batches, mortality, daily collection, sales orders
│   │   ├── payments/         # Payment receipts, outstanding balance settlement
│   │   └── rates/            # Daily egg & hen pricing, historical trends
│   ├── config/               # Django project settings, WSGI, ASGI, root URLs
│   ├── manage.py             # Django CLI management entry point
│   ├── Procfile              # Gunicorn web server process file
│   └── requirements.txt      # Production Python dependencies
│
├── web/                      # React 19 + Vite Web Admin Portal
│   ├── public/               # Static assets & icons
│   ├── src/
│   │   ├── admin/pages/      # AuditLogs, Customers, Rates, Sales, Settings, Users
│   │   ├── assets/           # SVG icons & branding
│   │   ├── App.jsx           # Main Admin dashboard layout & routing
│   │   └── main.jsx          # React DOM root entry point
│   ├── package.json          # Web dependencies (React 19, Lucide icons, Vite)
│   └── vercel.json           # Vercel SPA routing rewrites
│
├── mobile/                   # React Native + Expo Mobile Application
│   ├── src/
│   │   ├── components/       # Reusable mobile UI components & skeletons
│   │   ├── context/          # React contexts (AdminDataContext, AuthContext)
│   │   ├── data/             # Initial seeds & default mock structures
│   │   ├── screens/          # CustomerList, HenStock, Orders, Payments, Settings
│   │   └── utils/            # Calculation utilities, formatters, helpers
│   ├── App.js                # Mobile navigation & screen provider root
│   ├── app.json              # Expo application configuration & splash screen
│   └── package.json          # React Native 0.86, Expo 57 dependencies
│
├── docs/                     # Project Documentation Hub
│   ├── DEPLOYMENT_GUIDE.md   # Zero-to-production deployment guide
│   ├── SERVER_AND_PRICING_COMPARISON.md # Server storage, RAM, and pricing breakdown
│   ├── PROJECT_ARCHITECTURE.md # Architecture & technical design (this file)
│   ├── LOCAL_SETUP_GUIDE.md  # Running the project locally on your computer
│   └── README.md             # Documentation index
│
├── .gitignore                # Git ignore rules for Python, Node, Expo, and Secrets
└── package.json              # Monorepo root command scripts (expo, admin, mobile)
```

---

## 2. Authentication Flow

The system uses **JSON Web Tokens (JWT)** via `djangorestframework_simplejwt`:

```
┌──────────────────┐               ┌──────────────────┐               ┌──────────────────┐
│  Client (Mobile  │               │  Django Backend  │               │   PostgreSQL     │
│    or Web SPA)   │               │   (SimpleJWT)    │               │    Database      │
└────────┬─────────┘               └────────┬─────────┘               └────────┬─────────┘
         │                                  │                                  │
         │ 1. POST /api/token/              │                                  │
         │    { email, password }           │                                  │
         ├─────────────────────────────────>│                                  │
         │                                  │ 2. Validate user & hash          │
         │                                  ├─────────────────────────────────>│
         │                                  │<─────────────────────────────────┤
         │ 3. Return { access, refresh }    │                                  │
         │<─────────────────────────────────┤                                  │
         │                                  │                                  │
         │ 4. GET /api/customers/           │                                  │
         │    Authorization: Bearer <token> │                                  │
         ├─────────────────────────────────>│                                  │
         │                                  │ 5. Verify token & permissions    │
         │                                  │ 6. Query DB                      │
         │                                  ├─────────────────────────────────>│
         │                                  │<─────────────────────────────────┤
         │ 7. Return Customer Data JSON     │                                  │
         │<─────────────────────────────────┤                                  │
```

- **Access Token Lifetime:** 1 day (Configurable in `backend/config/settings.py`)
- **Refresh Token Lifetime:** 7 days with rotation enabled
- **Security:** In production, transmission is strictly enforced over HTTPS/TLS.

---

## 3. Core Database Models

1. **User (`apps.authentication.models.User`):**
   - Custom user model extending `AbstractUser`.
   - Fields: `role` (Super Admin, Manager, Operator), `phone_number`, `is_active`.
2. **Customer (`apps.customers.models.Customer`):**
   - Represents poultry buyers, wholesalers, and retail shops.
   - Fields: `name`, `shop_name`, `phone`, `address`, `credit_limit`, `current_balance`, `status`.
3. **DailyRate (`apps.rates.models.DailyRate`):**
   - Master poultry and egg daily market rates.
   - Fields: `date`, `rate_per_kg`, `egg_tray_rate`, `recorded_by`.
4. **SalesOrder (`apps.hens.models.SalesOrder`):**
   - Hen dispatch and sales transactions.
   - Fields: `customer`, `weight_kg`, `crate_count`, `rate_applied`, `total_amount`, `paid_amount`, `balance_due`.
5. **Payment (`apps.payments.models.Payment`):**
   - Financial receipts.
   - Fields: `customer`, `amount`, `payment_mode` (Cash, UPI, Bank Transfer), `reference_number`, `created_at`.
6. **AuditLog (`apps.audit.models.AuditLog`):**
   - Immutable security log for compliance.
   - Fields: `actor`, `action`, `entity_type`, `entity_id`, `before_state`, `after_state`, `ip_address`, `timestamp`.
