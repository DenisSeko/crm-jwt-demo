#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Pokrećem CRM JWT Demo iz: $PROJECT_DIR"

# 1. Oslobodi portove
echo "🔧 Provjeravam portove..."
for port in 5433 8080 3001 5173; do
  if command -v lsof >/dev/null 2>&1 && lsof -i :$port >/dev/null 2>&1; then
    echo "Port $port zauzet – oslobađam..."
    kill -9 $(lsof -t -i :$port) 2>/dev/null || true
    sleep 1
  fi
done

# 2. Čišćenje starih Docker containera
echo "🧹 Čistim stare containere..."
docker ps -aq --filter "name=crm-" --format '{{.ID}}' | xargs -r docker rm -f 2>/dev/null || true
docker network prune -f 2>/dev/null || true
docker-compose -f "$PROJECT_DIR/docker-compose.yml" down --remove-orphans 2>/dev/null || true

# 3. Pokreni PostgreSQL i Adminer
echo "🐘 Pokrećem PostgreSQL i Adminer..."
docker-compose -f "$PROJECT_DIR/docker-compose.yml" up -d

# 4. Čekaj DB
echo "⏳ Čekam PostgreSQL..."
timeout=30
elapsed=0
until docker exec -i $(docker-compose -f "$PROJECT_DIR/docker-compose.yml" ps -q db) pg_isready -U crm_user -d crm_demo >/dev/null 2>&1; do
  sleep 1
  elapsed=$((elapsed + 1))
  if [ $elapsed -ge $timeout ]; then
    echo "❌ GREŠKA: DB nije spreman nakon $timeout sekundi!"
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" logs db
    exit 1
  fi
  printf "."
done
echo " ✅"

# 5. Ručno pokreni schema.sql ako treba
echo "🗃️  Provjeravam database setup..."
docker exec -i crm-postgres psql -U crm_user -d crm_demo -c "
SELECT 'Users: ' || COUNT(*) FROM information_schema.tables WHERE table_name = 'users';
SELECT 'Clients: ' || COUNT(*) FROM information_schema.tables WHERE table_name = 'clients'; 
SELECT 'Notes: ' || COUNT(*) FROM information_schema.tables WHERE table_name = 'notes';
" || echo "⚠️  Tablice možda ne postoje, ali nastavljamo..."

# 6. Backend
echo "🔧 Pokrećem backend..."
cd "$PROJECT_DIR/backend"
if [ ! -d "node_modules" ]; then
  echo "📦 Instaliram backend dependencies..."
  npm i --silent
fi

echo "🚀 Pokrećem backend server..."
node src/server.js &
BACKEND_PID=$!
cd "$PROJECT_DIR"

# 7. Frontend
echo "🎨 Pokrećem frontend..."
cd "$PROJECT_DIR/frontend"

# Očisti stare CommonJS konfiguracije ako postoje
rm -f postcss.config.cjs tailwind.config.cjs 2>/dev/null || true

if [ ! -d "node_modules" ]; then
  echo "📦 Instaliram frontend dependencies..."
  npm i --silent
fi

echo "🚀 Pokrećem frontend dev server..."
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
cd "$PROJECT_DIR"

# 8. Čekaj da servisi budu spremni
echo "⏳ Čekam da servisi budu spremni..."
sleep 5

# Provjeri backend
if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
  echo "✅ Backend je spreman"
else
  echo "⚠️  Backend možda nije potpuno spreman, ali nastavljamo..."
fi

# Provjeri frontend
if curl -f http://localhost:5173 >/dev/null 2>&1; then
  echo "✅ Frontend je spreman"
else
  echo "⚠️  Frontend možda nije potpuno spreman, ali nastavljamo..."
fi

echo ""
echo "🎉 USPJEŠNO POKRENUTO!"
echo "========================"
echo "🌐 Frontend:  http://localhost:5173"
echo "🔧 Backend:   http://localhost:3001"
echo "🗄️  Adminer:   http://localhost:8080"
echo "📊 PostgreSQL: localhost:5433"
echo ""
echo "🔑 Demo pristup:"
echo "   Email: demo@demo.com"
echo "   Lozinka: demo123"
echo ""
echo "📋 Adminer pristup:"
echo "   Sistem: PostgreSQL"
echo "   Server: db"
echo "   Korisnik: crm_user"
echo "   Lozinka: crm_password"
echo "   Baza: crm_demo"
echo ""
echo "🛠️  Ako imaš problema:"
echo "   ./stop.sh && docker-compose down -v && ./start.sh"
echo ""
echo "⏹️  Za zaustavljanje: ./stop.sh"
echo ""

# Funkcija za zaustavljanje
cleanup() {
    echo ""
    echo "🛑 Zaustavljam servise..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" down
    echo "✅ Svi servisi zaustavljeni"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Čekaj da se procesi završe
wait $BACKEND_PID $FRONTEND_PID
