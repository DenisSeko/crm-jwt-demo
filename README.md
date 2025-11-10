# CRM JWT Demo

Moderan full-stack CRM demo projekt s Vue 3 frontenom, Express.js backenom i PostgreSQL bazom. **Sada u potpunosti ESM kompatibilan!** 🎉

## ✨ Ključne Karakteristike

- ✅ **ES Modules (ESM)** – moderan JavaScript modul sistem
- ✅ **Vue 3 + Vite** – brz frontend s hot reload-om
- ✅ **Express.js + PostgreSQL** – robustan backend
- ✅ **JWT Autentifikacija** – sigurna prijava
- ✅ **Docker** – lako pokretanje s Docker Compose
- ✅ **Tailwind CSS** – moderan styling

## 🚀 Brzo pokretanje

```bash
./setup.sh    # samo prvi put
./start.sh    # pokretanje aplikacije
./stop.sh     # zaustavljanje aplikacije
./test-api.sh # testiranje API-ja
```

## 📍 Pristup Aplikaciji

Nakon pokretanja, dostupni su:

| Servis | URL | Opis |
|--------|-----|------|
| **Frontend** | http://localhost:5173 | Vue 3 aplikacija |
| **Backend** | http://localhost:3001 | Express API |
| **Adminer** | http://localhost:8080 | Web UI za bazu |
| **PostgreSQL** | localhost:5433 | Baza podataka |

## 🔑 Demo Pristup

```
Email: demo@demo.com
Lozinka: demo123
```

## 📊 Arhitektura

```
CRM JWT Demo
├── Frontend (Vue 3 + Vite)
│   ├── Components
│   ├── Views (Home, Login, Dashboard, Notes)
│   ├── Router
│   ├── Stores (Pinia)
│   └── Services (Axios)
│
├── Backend (Express.js)
│   ├── Controllers (Auth, Client, Note)
│   ├── Routes
│   ├── Middleware (JWT Auth)
│   └── Database Config
│
└── Database (PostgreSQL)
    ├── users
    ├── clients
    └── notes
```

## 🔄 ESM Migracija

Projekt je u potpunosti migriran na **ES Modules**. Detaljne informacije:

📖 Vidi: [ESM_MIGRATION.md](./ESM_MIGRATION.md)

### Što se Promijenilo

- ✅ `postcss.config.cjs` → `postcss.config.js`
- ✅ `tailwind.config.cjs` → `tailwind.config.js`
- ✅ `vite.config.js` – ažuriran za ESM `__dirname`
- ✅ Backend – već koristi ESM

## 🛠️ Razvoj

### Frontend

```bash
cd frontend
npm run dev      # Razvoj s hot reload-om
npm run build    # Production build
```

### Backend

```bash
cd backend
npm run dev      # Pokretanje servera
npm run db:setup # Setup baze
npm run db:reset # Reset baze
```

## 🐳 Docker

Projekt koristi Docker Compose za PostgreSQL i Adminer:

```bash
docker-compose up -d    # Pokretanje
docker-compose down     # Zaustavljanje
docker-compose down -v  # Zaustavljanje + brisanje volumena
```

## 📦 Tehnologije

### Frontend
- Vue 3
- Vue Router 4
- Pinia (State Management)
- Axios (HTTP Client)
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt

### DevOps
- Docker
- Docker Compose
- PostgreSQL 15

## 🔐 Sigurnost

- ✅ JWT tokeni za autentifikaciju
- ✅ bcrypt heširanje lozinki
- ✅ CORS zaštita
- ✅ Javne i zaštićene rute

## 📝 API Rute

### Javne Rute
- `GET /api/public/clients` – Svi klijenti
- `GET /api/public/notes` – Sve bilješke

### Autentifikacija
- `POST /api/auth/login` – Prijava
- `POST /api/auth/register` – Registracija

### Zaštićene Rute (JWT)
- `GET /api/clients` – Moji klijenti
- `POST /api/clients` – Dodaj klijenta
- `PUT /api/clients/:id` – Uredi klijenta
- `DELETE /api/clients/:id` – Obriši klijenta
- `GET /api/notes` – Moje bilješke
- `POST /api/notes` – Dodaj bilješku
- `PUT /api/notes/:id` – Uredi bilješku
- `DELETE /api/notes/:id` – Obriši bilješku

## 🛠️ Troubleshooting

### Problem: Port već zauzet
```bash
./stop.sh
./start.sh
```

### Problem: Baza nije sprema
```bash
docker-compose down -v
./start.sh
```

### Problem: Frontend ne učitava
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📚 Dodatni Resursi

- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
- [Vue 3 Guide](https://vuejs.org/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📄 Licenca

MIT

## 👨‍💻 Autor

CRM JWT Demo – Edukativni projekt za učenje full-stack razvoja
