# Brightloop 360 — Hackathon MVP

A beginner-friendly B2B subscription management starter with a React + TypeScript dashboard, Express API, SQLite persistence, demo authentication and role-based access.

## What is included

- Admin, Staff and Customer demo accounts
- Dashboard: active subscriptions, collected revenue, outstanding balance and overdue invoices
- Customers, Products (including variants), Plans, Quotations, Subscriptions, Invoices, Payments, Discounts and Taxes screens
- Create records from the UI; search records; admin-only delete API
- Generate an invoice from a subscription, with duplicate-period protection
- Record partial payments and update invoice status
- Customer portal data is filtered to the signed-in customer's records
- SQLite database is created automatically in `server/data/brightloop.db` and seeded with demo data

## Requirements

- Node.js LTS (install from https://nodejs.org/)
- VS Code
- Internet for the first dependency installation

## Run on Windows

1. Extract the ZIP file to a folder, for example `Desktop/brightloop-360`.
2. Open VS Code → **File → Open Folder** → choose `brightloop-360`.
3. Open **Terminal → New Terminal**.
4. Run these commands one at a time:

```bash
npm install
npm install --prefix server
npm install --prefix client
npm run dev
```

5. Wait until both servers are ready. Open **http://localhost:5173** in your browser.
6. Keep the VS Code terminal open while using the application. Press `Ctrl + C` in the terminal to stop it.

## Demo login accounts

All demo accounts use the password `Brightloop@123`.

| Role | Email |
|---|---|
| Admin | admin@brightloop.demo |
| Staff | staff@brightloop.demo |
| Customer | aarav@example.com |

## Suggested division for a 4-person team

- **Member 1 — Frontend/UI:** dashboard styling, responsive layout, forms and usability.
- **Member 2 — Backend/API:** validation, API routes, role checks and error handling.
- **Member 3 — Subscription & billing:** plan lifecycle, invoice generation, payment and discount calculations.
- **Member 4 — QA & presentation:** test all roles, prepare test data, screenshots, demo script and submission video.

Use one shared GitHub repository. Avoid having multiple people edit the same file at the same time. Agree on small tasks and commit frequently.

## Important limitations — read before presenting

This is a **hackathon MVP starter**, not a production-ready financial system. The main navigation and CRUD flows are scaffolded, and the demo includes basic subscription-to-invoice and payment workflows. Before claiming full completion, your team should test and extend:

- Automatic scheduled recurring billing and robust daily/weekly/monthly/yearly billing periods
- Full subscription state transitions, pause/resume/renew/early-close rules
- Quotation-to-subscription conversion and complete invoice line-item detail
- Automatic discount eligibility/usage caps and tax configuration per product/customer
- Email verification, password reset email delivery and invitation-based staff creation
- Stronger production security, audit logs, rate limiting, HTTPS, backups and secret management
- Customer portal invoice/payment-history screens and stricter customer-only field permissions
- Automated tests, pagination and performance testing with large datasets

The demo JWT secret is a placeholder. Set `JWT_SECRET` to a long random secret before deploying. Do not publish real customer information or passwords in this demo database.

## Database reset

Stop the app, delete `server/data/brightloop.db`, then restart the server. A fresh demo database will be created automatically.

## GitHub

Create a repository named `brightloop-360` and push this folder. Add your evaluator using the exact GitHub username or email supplied by the organizers. Do not guess the evaluator's account.
