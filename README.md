# Subscription Management System — Brightloop Software

Enterprise-grade subscription lifecycle management, recurring billing engine, and financial analytics dashboard built for the hackathon showcase.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS%20%7C%20Recharts-6366f1)
![Status](https://img.shields.io/badge/Build-Passing-emerald)

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# Application runs at: http://localhost:5173/
```

---

## 🎯 3-Minute Hackathon Judge Walkthrough

Follow this complete end-to-end flow to test every core enterprise module:

1. **Role Switcher & Dashboard**:
   - Notice the top right role buttons: **Admin (Vishnupriya)**, **Staff (Alex Miller)**, and **Customer (Sarah Chen)**.
   - Switch between them to see role-based navigation and permissions in action.
   - Observe live calculated KPI metrics: **Total Revenue**, **Active Subscriptions**, **Total Customers**, **Pending Payments**, and **Overdue Invoices**.

2. **Step 1: Create a Product**:
   - Go to **Products** ➔ Click `+ Add New Product`.
   - Enter name: `Cloud AI Copilot Cluster`, Category: `Cloud Resource`, Sales Price: `$3,500`, Cost Price: `$800`.
   - Add a variant: `High Bandwidth Dedicated IP (+$450)` ➔ Save.

3. **Step 2: Create a Subscription Plan**:
   - Go to **Subscription Plans** ➔ Click `+ Create Plan`.
   - Title: `Enterprise Quarterly Accelerator`, Cycle: `Monthly`, Price: `$3,500`, Renewal: `Auto` ➔ Save.

4. **Step 3: Register a Customer**:
   - Go to **Customers** ➔ Click `+ Add Customer`.
   - Name: `Alexander Wright`, Company: `Vertex Global Technologies`, Email: `alexander@vertexglobal.com` ➔ Save.
   - Click **Customer 360°** to inspect the customer's lifetime contract drawer and history.

5. **Step 4: Provision a Subscription**:
   - Go to **Subscriptions** ➔ Click `+ Create Subscription`.
   - Select Customer: `Vertex Global Technologies`, Product: `Cloud AI Copilot Cluster`, Plan: `Enterprise Quarterly Accelerator`.
   - Enter promo code: `LAUNCH20` ➔ Notice instant live validation calculating `$700` discount!
   - Click `Create Subscription` ➔ Confetti celebratory animation triggers!

6. **Step 5: Generate an Invoice**:
   - Click `Invoice` on the newly created subscription (or go to **Invoices** ➔ `+ Generate Invoice`).
   - Notice duplicate invoice detection will block duplicate runs for the same period.
   - Click `Generate Invoice` ➔ Opens the official **Commercial Tax Invoice Preview**.
   - Review tax calculation (10%), subtotal, line items, and click `Print Invoice` (`window.print()`).

7. **Step 6: Settle Payment**:
   - Click `Record Payment` directly from the invoice modal or the **Payments** tab.
   - Choose Method (`Stripe`, `Wire Transfer`, or `Credit Card`) ➔ Click `Confirm & Settle Payment`.
   - The invoice turns `PAID`, receipt is generated with TXN reference, and the **Dashboard total revenue updates live!**

8. **Step 7: Reports & Analytics**:
   - Go to **Reports & Analytics** to see multi-dimensional financial charts (Product Revenue, Plan Volume, Payment Channels).
   - Click `Export CSV` to download the spreadsheet report.

---

## 🏗️ Architecture & Modules

| Module | Core Functionality |
| :--- | :--- |
| **Dashboard** | Total revenue, active contracts, MRR/ARR calculation, overdue payment alert banners, Recharts area & donut charts. |
| **Auth & Roles** | Dynamic role switching between `Admin`, `Staff`, and `Customer` with restricted views and permissions. |
| **Products** | Full CRUD for catalog items, profit margin calculations, SKU variants with pricing adjustments. |
| **Subscription Plans** | Multi-interval billing (`daily`, `weekly`, `monthly`, `yearly`), pause policy flags, minimum seat commitments. |
| **Subscriptions** | State machine (`draft` ➔ `quotation` ➔ `confirmed` ➔ `active` ➔ `paused` ➔ `closed`). Pause/Resume/Renew actions with audit timelines. |
| **Invoices** | Net-15 tax invoice generator, Net GST/VAT calculations, duplicate billing period protection, printable layout. |
| **Payments** | Ledger with unique transaction codes (`TXN-*`), payment settlement modal, pending vs overdue balance tracking. |
| **Discounts** | Percentage and fixed promo codes with min-spend thresholds, expiration checks, and redemption limit meters. |
| **Customers** | Complete Customer 360° drawer with subscription and invoice histories. |
| **Reports** | Interactive Recharts breakdown with one-click CSV financial export. |

---

## 💾 Zero-Friction Data Layer
The application utilizes a responsive `localStorage` persistence layer seeded with realistic SaaS enterprise data. Judges can click the **Reset Demo Data** button in the header at any time to restore factory state.
