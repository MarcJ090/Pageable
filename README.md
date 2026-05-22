# 📚 Pageable — Campus Library Management System

> A full-stack, role-based campus library tracker built with **NestJS** (backend) and **React + Vite** (frontend).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v20%2B-green)
![NestJS](https://img.shields.io/badge/backend-NestJS-red)
![React](https://img.shields.io/badge/frontend-React%2018-61dafb)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Roles & Permissions](#roles--permissions)
- [Features](#features)
- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
- [Environment Notes](#environment-notes)
- [Contributing](#contributing)

---

## Overview

**Pageable** is a campus library management system that enables:

- **Students** to browse the catalog and request book loans
- **Librarians** to manage books, approve or reject loan requests, and watch book availability update automatically
- **Administrators** to oversee all users, manage campus library records, and control the entire catalog

The system enforces strict role-based access control (RBAC) via a custom HTTP header (`x-user-role`) attached to every API request. The admin account is hardcoded server-side and is never exposed through the registration interface — entering the admin credentials on the login page silently redirects to the admin dashboard.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Vite | UI, routing, state management |
| Backend | NestJS 11 + TypeScript | REST API, RBAC enforcement |
| Styling | Plain CSS with CSS variables | Design system (no framework) |
| Icons | Font Awesome 6 (CDN) | UI iconography throughout |
| Fonts | Google Fonts (Nunito + Lato) | Typography |
| Process manager | PM2 | Keep Node alive in production |
| Web server | Apache2 | Serve static build + proxy API |

---

## Roles & Permissions

| Action | Student | Librarian | Admin |
|---|---|---|---|
| View catalog | ✅ | ✅ | ✅ |
| Request a book loan | ✅ | — | — |
| Add books | ❌ | ✅ | ✅ |
| Toggle book availability | ❌ | ✅ | ✅ |
| Approve / reject loans | ❌ | ✅ | ✅ |
| Delete books | ❌ | ❌ | ✅ |
| Manage campus libraries | ❌ | ❌ | ✅ |
| View all registered users | ❌ | ❌ | ✅ |

**Hidden admin credentials (not shown anywhere in the UI):**
| Field | Value |
|---|---|
| Email | `admin@pageable.com` |
| Password | `admin123` |

> Change these before any public or institutional deployment.

---

## Features

### 🏠 Landing Page
Clean hero layout with feature highlights, a Login button for returning users, and a Sign Up CTA for new ones. Navigation trimmed to Home, About, and Contact.

### 🔐 Authentication
- Card-only login and register pages (no split-panel layout)
- Register offers only Student and Librarian roles — admin is never selectable
- Admin is silently recognised by credentials and redirected to the admin dashboard
- Back-to-home button on both auth pages

### 📚 Book Catalog & Management
- Searchable catalog with real-time availability badges
- Librarians and admins can toggle availability with a single click
- Admins can permanently delete records

### 📬 Loan Request Flow
1. Student clicks **Request Loan** on any available book
2. Librarian sees the request in the **Loan Requests** panel (filterable by status)
3. Librarian clicks **Approve** → book automatically switches to *Checked Out*
4. Librarian clicks **Reject** → book remains available
5. Student sees live status updates (pending / approved / rejected) under **My Loans**

### 📊 Dashboards
- **Admin:** 4 stat cards, donut charts for user breakdown (students vs librarians), bar progress indicators, libraries CRUD table, full user list
- **Librarian:** 4 stat cards, catalog statistics donuts, pending loan request preview, unified Books & Catalog page
- **Student:** 4 stat cards, available books grid with request buttons, full catalog table, loan history

### 🖼 Logo Support
Drop `logo.png` into `frontend/src/assets/` — it appears automatically in the navbar, sidebar, and auth pages via a shared `<Logo />` component. Falls back to a book icon if no file is found.

---

## Project Structure

```
Pageable/
├── backend/
│   ├── src/
│   │   ├── main.ts               # Bootstrap + CORS (port 3000)
│   │   ├── app.module.ts         # Root NestJS module
│   │   └── books.controller.ts   # CRUD endpoints + RBAC guards
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/               # ← place logo.png here
    │   ├── context/
    │   │   └── AuthContext.jsx   # Auth state + loan request system
    │   ├── components/
    │   │   └── UI.jsx            # Logo, Sidebar, TopBar, StatCard,
    │   │                         #   Modal, DonutChart, Badge, etc.
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── LibrarianDashboard.jsx
    │   │   └── StudentDashboard.jsx
    │   ├── App.jsx               # Routing + auth guard + API calls
    │   ├── main.jsx              # React entry point
    │   └── index.css             # CSS variables, fonts, animations
    ├── index.html
    └── package.json
```

---

## Local Development Setup

### Prerequisites
- Node.js v18 or later
- npm v9 or later
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/pageable.git
cd pageable
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
# API running on http://localhost:3000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```

### 4. Open in browser

```
http://localhost:5173
```

The frontend automatically sends all API requests to `http://localhost:3000` with the correct role header. If the backend is offline, all book operations fall back gracefully to in-memory state.

---


## Environment Notes

| Item | Value | Notes |
|---|---|---|
| Frontend dev port | `5173` | Vite default |
| Backend port | `3000` | NestJS default |
| RBAC header | `x-user-role` | Injected by frontend on every request |
| Admin email | `admin@pageable.com` | Never visible in registration UI |
| Admin password | `admin123` | **Change before any real deployment** |
| Data persistence | In-memory only | A server restart resets all books and users |

> ⚠️ **Production note:** The backend currently stores all data in a server-side array. Integrating a database (PostgreSQL + TypeORM is the natural NestJS choice) is the recommended next step before institutional use.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit using the project convention: `feat(scope): short description`
4. Push and open a Pull Request against `main`

---

*📚 Pageable — built for campus libraries, powered by modern web technology.*