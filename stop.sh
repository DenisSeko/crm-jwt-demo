#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🛑 Zaustavljam CRM JWT Demo..."

# Zaustavi backend procese
echo "🔧 Zaustavljam backend..."
pkill -f "node.*server.js" 2>/dev/null || true

# Zaustavi frontend procese
echo "🎨 Zaustavljam frontend..."
pkill -f "vite.*5173" 2>/dev/null || true

# Zaustavi Docker containere
echo "🐳 Zaustavljam Docker containere..."
docker-compose -f "$PROJECT_DIR/docker-compose.yml" down --remove-orphans 2>/dev/null || true

# Oslobodi portove
echo "🔌 Oslobađam portove..."
for port in 3001 5173; do
  lsof -i :$port >/dev/null 2>&1 && kill -9 $(lsof -t -i :$port) 2>/dev/null || true
done

echo "✅ SVE ZAUSTAVLJENO."
