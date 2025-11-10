# 🌳 Git Workflow

## Pregled Brancha

Projekt koristi sljedeću git strukturu:

```
master (main branch)
└── crm-demo (development branch)
```

---

## 📋 Branchevi

### `master` (Main Branch)
- **Opis:** Stabilna verzija projekta
- **Status:** Production-ready
- **Pravila:** 
  - Samo tested i reviewed kod
  - Bez direktnih pusheva
  - Koristi pull requests

### `crm-demo` (Development Branch)
- **Opis:** Aktivni razvoj CRM aplikacije
- **Status:** Active development
- **Sadržaj:**
  - ✅ ESM migracija (CommonJS → ES Modules)
  - ✅ Konvertovane konfiguracije (postcss, tailwind, vite)
  - ✅ ESM dokumentacija
  - ✅ Poboljšani `.gitignore`
  - ✅ `.env.example` datoteke

---

## 🔄 Git Workflow

### 1. Kloniranje Repozitorija

```bash
git clone <repository-url>
cd crm-jwt-demo
```

### 2. Prebacivanje na Development Branch

```bash
git checkout crm-demo
```

### 3. Rad na Kodu

```bash
# Napravite promjene
# Testirajte lokalno
npm run dev
```

### 4. Commit Promjena

```bash
git add .
git commit -m "Opis promjene"
```

### 5. Push na Remote

```bash
git push origin crm-demo
```

### 6. Pull Request (na GitHubu)

- Otvorite PR s `crm-demo` → `master`
- Dodajte opis promjena
- Čekajte review
- Merge nakon approvala

---

## 📝 Commit Poruke

Koristite jasne i deskriptivne commit poruke:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipovi

- `feat:` – Nova funkcionalnost
- `fix:` – Ispravka buga
- `docs:` – Dokumentacija
- `style:` – Formatiranje koda
- `refactor:` – Refaktoriranje
- `perf:` – Performanse
- `test:` – Testovi
- `chore:` – Održavanje

### Primjeri

```bash
# Nova funkcionalnost
git commit -m "feat(auth): add JWT token refresh"

# Ispravka buga
git commit -m "fix(client): resolve null reference error"

# Dokumentacija
git commit -m "docs(readme): update installation instructions"

# ESM migracija
git commit -m "refactor(config): migrate to ESM modules"
```

---

## 🔍 Pregled Promjena

### Trenutne Promjene

```bash
git status
```

### Razlike od Master Brancha

```bash
git diff master
```

### Commit Historija

```bash
git log --oneline
```

### Detaljni Pregled Commita

```bash
git show <commit-hash>
```

---

## 🚀 Deployment

### Iz Master Brancha

```bash
# Production deployment
git checkout master
git pull origin master
./start.sh
```

### Iz Development Brancha (Development)

```bash
# Development deployment
git checkout crm-demo
git pull origin crm-demo
./start.sh
```

---

## 📊 Statistika

### Broj Datoteka

```bash
git ls-files | wc -l
```

### Veličina Repozitorija

```bash
du -sh .git
```

### Commit Historija

```bash
git log --oneline | wc -l
```

---

## 🔐 Sigurnost

### Zaštita Osjetljivih Datoteka

Sljedeće datoteke su u `.gitignore`:

- ✅ `.env` – Kredencijali
- ✅ `node_modules/` – Zavisnosti
- ✅ `dist/` – Build outputi
- ✅ `.vscode/` – IDE konfiguracija
- ✅ `postgres_data/` – Baza podataka

### Nikada Ne Commitajte

```
❌ .env datoteke s kredencijalima
❌ node_modules folder
❌ Build outpute (dist, build)
❌ IDE konfiguracije
❌ Lozinke ili API ključeve
```

---

## 🛠️ Česti Zadaci

### Prebacivanje na Master

```bash
git checkout master
git pull origin master
```

### Ažuriranje Development Brancha

```bash
git checkout crm-demo
git pull origin master
git merge master
```

### Brisanje Lokalnog Brancha

```bash
git branch -d crm-demo
```

### Brisanje Remote Brancha

```bash
git push origin --delete crm-demo
```

### Vraćanje Promjena

```bash
# Vraćanje jedne datoteke
git checkout -- <file>

# Vraćanje svih promjena
git reset --hard HEAD
```

### Stash Promjena

```bash
# Spremi promjene privremeno
git stash

# Vrati promjene
git stash pop
```

---

## 📚 Dodatni Resursi

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

---

## ✅ Checklist za Novi Branch

Ako kreirate novi branch:

- [ ] Kreirajte branch s jasnim imenom (`feature/`, `fix/`, `docs/`)
- [ ] Radite na feature branchu, ne na masteru
- [ ] Redovito commitajte s jasnim porukama
- [ ] Testirajte lokalno prije pusha
- [ ] Pushajte na remote
- [ ] Otvorite pull request
- [ ] Čekajte review
- [ ] Mergejte nakon approvala

---

## 🎯 Zaključak

Ovaj git workflow osigurava:

1. **Organiziranost** – Jasna struktura brancha
2. **Sigurnost** – Zaštita osjetljivih datoteka
3. **Kvaliteta** – Code review kroz pull requests
4. **Lakše održavanje** – Jasne commit poruke
5. **Lakšu kolaboraciju** – Standardizirani proces

Slijedi ovaj workflow za najbolje rezultate! 🚀
