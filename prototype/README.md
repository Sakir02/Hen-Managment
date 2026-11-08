# Hen Management — Mobile App Prototype Suite

Interactive mobile prototype designed specifically according to the **Hen Management (JV Poultry Mandi)** React Native application.

---

## 📱 Features

- **Oppo Reno 8 Simulation:** Realistic ColorOS chassis, punch-hole camera, status bar (Time, Wi-Fi, 5G, Battery), and Android navigation bar.
- **Device Switcher:** Toggle between **Oppo Reno 8**, **iPhone 16 Pro**, and **Full Screen** (mobile viewport).
- **Role Switcher:** Switch between **Super Admin** and **Field Operator** views.
- **Theme Switcher:** Light Slate Canvas (`#F8FAFC`) vs Dark ColorOS Canvas (`#0B1120`).
- **Interactive Mandi Modules:**
  1. **Live Mandi Command Center:** Benchmark rates for Marga (₹142.00/kg) & Margee (₹128.50/kg), live KPIs, and quick actions.
  2. **Hens Intake & Weigh-in:** Batch weighing calculator with gross weight, crates count, tare deduction, and automatic locked valuation.
  3. **Customer Khata Ledger:** Search, filter by Due / Settled, debit/credit records, and "+ Add Customer" (strictly NO address field).
  4. **Payments & Settlement:** Collections summary, UPI / Cash ledger, and digital receipt generation.
  5. **Direct 1-to-1 Chat & Voice:** Text messaging and simulated audio recording waveform.
  6. **Security & Audit Logs:** Live audit entries for rate adjustments and batch intakes.
- **Approved Design Tokens:**
  - Primary Blue: `#2563EB`
  - Mandi Teal: `#0D9488`
  - Slate Background: `#F8FAFC`
  - Dark Slate Text: `#0F172A`
  - Zero-emoji rule enforced (100% 2D vector glyphs).

---

## 🚀 How to Run the Prototype

### Method 1: Instant Local Browser (No installation needed)
Simply open `index.html` in your browser:
- Double click `c:\HEN PROJECT\prototype\index.html`
- Or open Chrome/Edge and press `Ctrl + O`, then select `index.html`.

### Method 2: Open Directly on your Oppo Reno 8 Phone
1. Start a lightweight HTTP server on your PC:
   ```bash
   cd "c:\HEN PROJECT"
   python -m http.server 8080
   ```
2. Make sure your phone and PC are connected to the same Wi-Fi / hotspot.
3. Open Chrome on your Oppo Reno 8 and navigate to:
   ```text
   http://172.20.10.10:8080/prototype/
   ```
4. Click **Full Screen** in the top bar for a full-screen native mobile experience.

---

## 📁 File Structure

```
prototype/
├── index.html          # Interactive smartphone mockup & live prototype
├── styles.css          # Device chassis styles, ColorOS theme, JV design tokens
├── app.js              # State management, weighing calculators, chat & modals
├── design-system.html  # Complete UI design tokens & vector glyph catalog
└── README.md           # Documentation and quickstart guide
```

