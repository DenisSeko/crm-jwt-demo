# ESM Migration Guide

## 📋 Pregled Migracije

Projekt je u potpunosti migriran sa CommonJS na **ES Modules (ESM)** standard. Ovo poboljšava:

- ✅ **Moderniji kod** – koristi standardni JavaScript modul sistem
- ✅ **Bolja kompatibilnost** – ESM je standard u Node.js 14+
- ✅ **Lakše održavanje** – konzistentan stil kroz cijeli projekt
- ✅ **Bolje tree-shaking** – optimizacija veličine bundla

---

## 🔄 Što se Promijenilo

### Frontend Konfiguracije

#### Prije (CommonJS)
```javascript
// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

#### Sada (ESM)
```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

### Vite Konfiguracija

#### Prije
```javascript
import path from 'path';
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

#### Sada
```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname
    }
  }
});
```

---

## 📁 Datoteke Koje su Promijenjene

### Frontend
- ✅ `postcss.config.cjs` → `postcss.config.js`
- ✅ `tailwind.config.cjs` → `tailwind.config.js`
- ✅ `vite.config.js` – ažuriran za ESM `__dirname`

### Backend
- ✅ Već koristi ESM (sve datoteke koriste `import`/`export`)

### Dokumentacija
- ✅ `.env.example` – dodana za konfiguraciju

---

## 🚀 Kako Koristiti

### 1. Pokretanje Projekta
```bash
./start.sh
```

Skripta će automatski:
- Obrisati stare `.cjs` datoteke
- Koristiti nove ESM konfiguracije
- Pokrenuti sve servise

### 2. Razvoj

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
npm run dev
```

### 3. Build

**Frontend:**
```bash
cd frontend
npm run build
```

---

## 📦 Package.json Konfiguracija

Oba `package.json` datoteke već imaju:
```json
{
  "type": "module"
}
```

Ovo omogućava korištenje ESM sintakse bez `.mjs` ekstenzije.

---

## 🔍 Provjera ESM Kompatibilnosti

### Backend
```bash
cd backend
node src/server.js
```

### Frontend
```bash
cd frontend
npm run dev
```

---

## ⚠️ Važne Napomene

### 1. `__dirname` i `__filename`
U ESM-u, `__dirname` i `__filename` nisu dostupni po defaultu. Trebate ih kreirati:

```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### 2. Dinamički Import
Ako trebate dinamički importati module:

```javascript
// ESM
const module = await import('./path/to/module.js');
```

### 3. JSON Import
Za import JSON datoteka:

```javascript
import data from './data.json' assert { type: 'json' };
```

---

## 🛠️ Troubleshooting

### Problem: "Cannot find module"
**Rješenje:** Osigurajte da sve datoteke imaju `.js` ekstenziju u importima:
```javascript
// ✅ Ispravno
import { auth } from '../middleware/auth.js';

// ❌ Pogrešno
import { auth } from '../middleware/auth';
```

### Problem: "ReferenceError: __dirname is not defined"
**Rješenje:** Kreirajte `__dirname` kao što je prikazano gore.

### Problem: Vite ne prepoznaje konfiguraciju
**Rješenje:** Osigurajte da je `vite.config.js` (ne `.cjs`) u root direktoriju frontenda.

---

## 📚 Dodatni Resursi

- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
- [Vite ESM Guide](https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server)
- [MDN: JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

## ✅ Checklist za Nove Datoteke

Ako dodajete nove datoteke, osigurajte:

- [ ] Koristite `import`/`export` umjesto `require`/`module.exports`
- [ ] Sve importane datoteke imaju `.js` ekstenziju
- [ ] `package.json` ima `"type": "module"`
- [ ] Ako trebate `__dirname`, kreirajte ga kao gore
- [ ] Testirati s `npm run dev` ili `node src/server.js`

---

## 🎯 Zaključak

Projekt je sada u potpunosti ESM kompatibilan, što ga čini:
- Modernijim
- Lakšim za održavanje
- Kompatibilnijim s budućim verzijama Node.js-a
- Spremnijim za produkciju
