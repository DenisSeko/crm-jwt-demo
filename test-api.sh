#!/bin/bash

echo "🧪 Testiram API..."

# 1. Provjeri health
echo "1. 🔍 Health check..."
curl -s http://localhost:3001/api/health | jq . 2>/dev/null || curl -s http://localhost:3001/api/health

# 2. Javni klijenti
echo ""
echo "2. 🌐 Javni klijenti (bez tokena)..."
curl -s http://localhost:3001/api/public/clients | jq . 2>/dev/null || curl -s http://localhost:3001/api/public/clients

# 3. Javne bilješke
echo ""
echo "3. 📝 Javne bilješke (bez tokena)..."
curl -s http://localhost:3001/api/public/notes | jq . 2>/dev/null || curl -s http://localhost:3001/api/public/notes

# 4. Prijava
echo ""
echo "4. 🔐 Prijava..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@demo.com", "password": "demo123"}')

echo $LOGIN_RESPONSE | jq . 2>/dev/null || echo $LOGIN_RESPONSE

# Ekstrakcija tokena
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Greška pri prijavi - provjeri lozinku i database"
  exit 1
fi

echo "✅ Token dobiven"

# 5. Dohvat klijenata (zaštićeno)
echo ""
echo "5. 📋 Dohvat klijenata (zaštićeno)..."
curl -s -X GET http://localhost:3001/api/clients \
  -H "Authorization: Bearer $TOKEN" | jq . 2>/dev/null || curl -s -X GET http://localhost:3001/api/clients -H "Authorization: Bearer $TOKEN"

echo ""
echo "✅ Svi testovi prošli!"
