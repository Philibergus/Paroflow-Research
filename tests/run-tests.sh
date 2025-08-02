#!/bin/bash

# Script de lancement des tests E2E Paroflow
echo "🧪 Lancement des tests E2E Paroflow"
echo "==================================="

# Vérifier que les serveurs sont lancés
echo "📡 Vérification des serveurs..."

# Vérifier le backend (port 3000)
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Backend non accessible sur le port 3000"
    echo "💡 Lancez: npm run dev:api"
    exit 1
fi

# Vérifier le frontend (port 8080)
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ Frontend non accessible sur le port 8080"
    echo "💡 Lancez: npm run dev:frontend"
    exit 1
fi

echo "✅ Serveurs accessibles"

# Lancer les tests par catégorie
echo ""
echo "🚀 Lancement des tests..."

echo ""
echo "1️⃣ Tests de Navigation et Recherche"
npx playwright test navigation.spec.ts --reporter=line

echo ""
echo "2️⃣ Tests du Module Dentaire"
npx playwright test dental-management.spec.ts --reporter=line

echo ""
echo "3️⃣ Tests Schéma Dentaire et Timeline"
npx playwright test dental-chart-timeline.spec.ts --reporter=line

echo ""
echo "4️⃣ Tests API et Performance"
npx playwright test api-performance.spec.ts --reporter=line

echo ""
echo "📊 Génération du rapport HTML..."
npx playwright show-report

echo ""
echo "✅ Tests terminés!"
echo "📁 Rapport disponible dans: playwright-report/"