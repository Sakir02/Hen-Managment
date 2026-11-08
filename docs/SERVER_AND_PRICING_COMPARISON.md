# 📊 Server & Free Space Comparison Guide

This document breaks down every major cloud provider's free tier, resource allowances, storage calculation math, and long-term scaling considerations for the **Hen Management System**.

---

## 1. Quick Comparison Matrix

| Cloud Provider | Component | Free Disk / Storage | Free RAM (Memory) | Bandwidth Allowance | Expiration / Sleep Behavior | Best For |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Neon.tech** | PostgreSQL Database | **500 MB (0.5 GB)** | Serverless (Autoscaling) | 5 GB data transfer / mo | **Forever Free**. Does NOT expire. | 🏆 Primary Production Database |
| **Supabase** | PostgreSQL + Storage | **500 MB DB + 1 GB Media** | Shared 2 Free Projects | 2 GB data transfer / mo | Pauses after 7 days of inactivity (1-click restart). | 🥈 Database + Image Uploads |
| **Render.com** | Django Backend API | Ephemeral disk | **512 MB RAM**, 0.1 CPU | 100 GB bandwidth / mo | Spins down after 15 min idle (wakes in ~45s). | 🏆 Free Python Backend API |
| **Vercel** | React / Vite Web Admin | Unlimited static assets | High-speed Global CDN | **100 GB bandwidth / mo** | **Never sleeps**. Always 100% online. | 🏆 Web Admin Frontend |
| **Cloudflare Pages** | React / Vite Web Admin | Unlimited static assets | Global Anycast CDN | **Unlimited Bandwidth** | **Never sleeps**. 100% free forever. | 🥈 Alternate Web Frontend |
| **Expo EAS** | React Native Android App | Unlimited APK storage | Cloud build runners | Free tier | **30 free Android builds / month**. | 🏆 Mobile APK Builds |
| **Railway.app** | Fullstack (Backend + DB) | Shared disk | 512 MB RAM | $5 one-time credit | No permanent free tier (shuts off once $5 credit spent). | ⚠️ Testing only |
| **PythonAnywhere** | Django Backend | 512 MB disk | Shared CPU | Low | Blocks outbound traffic to external PostgreSQL on free tier. | ❌ Not recommended |
| **Render Free Postgres** | PostgreSQL Database | 1 GB storage | Shared | 100 GB | ⚠️ **Automatically DELETED after 30 days!** | ❌ Avoid for production |
| **Oracle Cloud Free** | Cloud VPS (Ubuntu) | **200 GB NVMe Disk** | **24 GB RAM**, 4 OCPU ARM | 10 TB bandwidth / mo | Forever free, but requires credit card verification. | 🏆 Best Free VPS (if approved) |
| **AWS Free Tier** | Cloud VPS (EC2) | **30 GB EBS Disk** | 1 GB RAM (t2/t3.micro) | 100 GB egress / mo | **Expires after 12 months**. | ⚠️ Temporary 1-year free |

---

## 2. In-Depth Free Storage Analysis: How Much Space Do You Actually Need?

### A. Database Storage (PostgreSQL on Neon or Supabase: 500 MB)
PostgreSQL stores structured data in tables (users, customers, hen transactions, rates, audit logs).

- **Customer Profile Row:** ~0.4 KB (name, phone, address, credit limit, balance)
- **Hen Rate History Row:** ~0.2 KB (date, rate per kg, created_by)
- **Sales Order / Hen Dispatch Row:** ~0.6 KB (customer_id, weight, rate, total_amount, date, status)
- **Payment Transaction Row:** ~0.4 KB (customer_id, amount, payment_mode, reference_no, date)
- **Audit Log Row:** ~0.5 KB (actor, action, timestamp, diff JSON)

**Average row size across the database:** $\approx 0.5 \text{ to } 0.7 \text{ KB}$.

$$\text{Total Records in 500 MB} = \frac{500 \times 1,024 \text{ KB}}{0.7 \text{ KB}} \approx \mathbf{731,428 \text{ Records}}$$

#### How Many Years Is 731,000 Records?
| Daily Activity Level | Daily Records Created | Records Per Year | Years to Fill 500 MB |
| :--- | :--- | :--- | :--- |
| **Small Farm** (10 sales, 10 payments/day) | ~25 records/day | 9,125 / year | **~80 Years** |
| **Medium Business** (30 sales, 30 payments/day) | ~80 records/day | 29,200 / year | **~25 Years** |
| **High Volume** (100 sales, 100 payments/day) | ~250 records/day | 91,250 / year | **~8 Years** |

> 📌 **Conclusion:** You will **not** run out of database space for many years. 500 MB is generous for text and financial records.

---

### B. Media & File Upload Storage (Customer Receipts / Hen Photos)
If you allow users to upload photos of chicks/hens or bank payment slips:
- A smartphone photo directly from camera: ~3 MB to 6 MB (Too large!).
- When compressed on the frontend or backend before upload: **~150 KB to 250 KB**.
- **Supabase 1 GB Free Media Storage:**
  $$\frac{1,000,000 \text{ KB}}{200 \text{ KB/image}} \approx \mathbf{5,000 \text{ Photos}}$$
- **Cloudinary Free Tier:**
  Offers **25 GB** of managed cloud storage with automated resizing = **~125,000 Photos**.

---

### C. Frontend Bandwidth (Vercel: 100 GB / month)
- Built React/Vite admin bundle: **~350 KB** (gzipped and cached by browser).
- With browser caching enabled, repeat visits load 0 KB from the server.
- **100 GB per month** allows over **280,000 full page visits per month** without paying anything.

---

## 3. Important Free Tier Gotchas & How to Avoid Them

### Trap 1: Render Free PostgreSQL Expiration
Render offers a free PostgreSQL database, but it displays a warning:
> *"Free databases expire 30 days after creation."*

**Solution:** Do **NOT** use Render's database. Instead, use **Neon.tech** or **Supabase**. They are free forever and never delete your data.

### Trap 2: Render Free Backend Inactivity Sleep
Render's free web service spins down after 15 minutes of zero traffic. When someone opens the app after it was sleeping, it takes ~45 seconds for the server to boot up ("cold start").

**Solution:** Setup a free 10-minute automated ping on **[cron-job.org](https://cron-job.org)** or **[uptimerobot.com](https://uptimerobot.com)**. This keeps your Render server awake 24/7.

---

## 4. When Should You Upgrade to a Paid Server?

Upgrade when:
1. **Zero Cold Starts Guaranteed:** You don't want any delay even if cron monitors fail.
2. **Dedicated Heavy Computing:** Processing hundreds of bulk PDF receipts simultaneously.
3. **Single All-in-One Linux Server:** You want PostgreSQL, Django, and Web all on a single private virtual machine.

### Best Budget Dedicated Cloud VPS (Starting at $3 - $5/mo):
- **Hetzner Cloud CX22:** €3.79 / month (~$4.10) — 2 vCPUs, 4 GB RAM, 40 GB NVMe SSD, 20 TB traffic.
- **DigitalOcean Basic Droplet:** $4 - $6 / month — 1 vCPU, 1 GB RAM, 25 GB SSD.
- **Hostinger VPS 1:** $5.49 / month — 1 vCPU, 4 GB RAM, 50 GB NVMe SSD.
