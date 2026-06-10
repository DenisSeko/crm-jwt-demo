# Modern Full-Stack CRM with Native ESM & JWT Authentication

A decoupled, containerized full-stack CRM demonstration platform built to showcase modern JavaScript development practices. The architecture utilizes **Vue 3** (Pinia/Vite) on the frontend and an **Express.js** REST API on the backend, fully backed by a **PostgreSQL** database.

> This repository highlights a complete migration to native ES Modules (ESM) across the entire dependency tree, solving common enterprise modernization bottlenecks.

---

## ✨ Core Technical Highlights

- ⚡ **Full ES Modules (ESM) Integration** – Modernized JavaScript module pattern removing legacy CommonJS patterns, correctly handling ESM pathing (`__dirname`) inside build tools and runtime environments.
- 🔐 **Stateful JWT Authentication Flow** – Complete authorization pipeline using JSON Web Tokens combined with `bcrypt` password hashing, secure route guards, and automated token handling via Axios interceptors.
- 📦 **Reactivity & State Management** – Powered by Vue 3 (Composition API) and Pinia, providing a clean, single-source-of-truth store architecture for active clients and user sessions.
- 🐳 **Orchestrated DevOps Environment** – Multi-container Docker Compose mesh managing an isolated PostgreSQL 15 instance and Adminer web UI for zero-configuration local database administration.
- 🎨 **Utility-First UI Design** – High-fidelity, responsive user interface styled with Tailwind CSS, featuring active dashboard statistics and modal-driven CRUD interfaces.

---

## 📊 System Architecture

```text
CRM JWT Demo
├── Frontend (Vue 3 + Vite)
│   ├── Components     (Global UI elements)
│   ├── Views          (Home, Login, Dashboard, Notes)
│   ├── Router         (Secure navigation guards)
│   ├── Stores         (Pinia session & data hydration)
│   └── Services       (Axios HTTP client configurations)
│
├── Backend (Express.js REST API)
│   ├── Controllers    (Auth, client, note transaction logic)
│   ├── Routes         (Decoupled endpoints layer)
│   ├── Middleware     (JWT state & token validation)
│   └── Database       (PostgreSQL pool connection)
│
└── Database (PostgreSQL 15)
    ├── users          (Hashed credentials)
    ├── clients        (Enterprise records)
    └── notes          (One-to-many relational client notes)
```

---

## 🚀 Automated Local Provisioning

Ensure you have **Docker**, **Docker Compose**, and **Node.js** installed. The environment includes custom shell automation to bypass manual migrations and configuration.

```bash
# 1. Initialize environment settings and automatically seed the PostgreSQL schema
./setup.sh

# 2. Start all orchestrated services (Frontend, API, DB, Adminer)
./start.sh

# 3. Test API gateway connectivity and endpoint health
./test-api.sh

# 4. Tear down the infrastructure safely when finished
./stop.sh
```

---

## 📍 Local Service Map

| Component | URL | Environment |
|---|---|---|
| Frontend SPA | http://localhost:5173 | Vue 3 Dev Server |
| Backend REST API | http://localhost:3001 | Express.js Runtime |
| Adminer Database UI | http://localhost:8080 | Local DB Management |
| PostgreSQL Instance | `localhost:5433` | Relational Storage |

---

## 🔑 Demo Credentials

Pre-configured credentials seeded into the database for immediate testing of authenticated views:

```
Email:    demo@demo.com
Password: demo123
```

---

## 🛡️ Security & Operational Notes

### Local Development vs. Production

**CORS & Network Layer:** The backend API features explicit Cross-Origin Resource Sharing (CORS) security configurations.

**Network Protocol:** Local container networking runs over HTTP for frictionless debugging, state inspection, and log monitoring. Production manifests are designed to offload TLS/HTTPS termination to cloud reverse-proxies (e.g., Nginx, Traefik, AWS ALB), keeping the core application layer portable.

---

## 🔄 ESM Migration Details

The codebase has been fully refactored to adhere to strict ES Modules standards. Key files modernized during this migration:

| Before | After |
|---|---|
| `postcss.config.cjs` | `postcss.config.js` (native ESM) |
| `tailwind.config.cjs` | `tailwind.config.js` (native ESM) |
| `vite.config.js` | modernized with safe dynamic path resolution |

---

## 📄 License

[MIT](./LICENSE) — Created for technical assessment and educational engineering architecture demonstrations.
