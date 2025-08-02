#!/bin/bash

# Simple Monitor - Alternative sans Playwright pour WSL
echo "🔍 Monitoring Simple de Paroflow"
echo "================================="

# Créer dossier logs
mkdir -p tests/logs

# Test de connectivité de base
echo "📡 Test connectivité serveurs..."

if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Frontend accessible (port 8080)"
    FRONTEND_STATUS="OK"
else
    echo "❌ Frontend inaccessible (port 8080)"
    FRONTEND_STATUS="ERROR"
fi

if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Backend accessible (port 3001)"
    BACKEND_STATUS="OK"
else
    echo "❌ Backend inaccessible (port 3001)"
    BACKEND_STATUS="ERROR"
fi

# Test HTML de base
echo ""
echo "📄 Test contenu HTML..."

HTML_CONTENT=$(curl -s http://localhost:8080)
if echo "$HTML_CONTENT" | grep -q "Paroflow"; then
    echo "✅ Titre Paroflow présent"
    HTML_TITLE="OK"
else
    echo "❌ Titre Paroflow manquant"
    HTML_TITLE="ERROR"
fi

if echo "$HTML_CONTENT" | grep -q "root"; then
    echo "✅ Div root présent"
    HTML_ROOT="OK"
else
    echo "❌ Div root manquant"
    HTML_ROOT="ERROR"
fi

# Test routes principales
echo ""
echo "🧪 Test routes principales..."

ROUTES=("/" "/dental" "/patients" "/correspondants")
ROUTE_STATUS=""

for route in "${ROUTES[@]}"; do
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080$route")
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ Route $route : HTTP $HTTP_STATUS"
        ROUTE_STATUS="$ROUTE_STATUS $route:OK"
    else
        echo "❌ Route $route : HTTP $HTTP_STATUS"
        ROUTE_STATUS="$ROUTE_STATUS $route:ERROR"
    fi
done

# Générer rapport JSON
TIMESTAMP=$(date -Iseconds)
cat > tests/logs/simple-monitor-report.json << EOF
{
  "timestamp": "$TIMESTAMP",
  "monitoring_type": "simple_curl",
  "status": {
    "frontend": "$FRONTEND_STATUS",
    "backend": "$BACKEND_STATUS",
    "html_title": "$HTML_TITLE",
    "html_root": "$HTML_ROOT",
    "routes": "$ROUTE_STATUS"
  },
  "urls_tested": [
    "http://localhost:8080",
    "http://localhost:3001",
    "http://localhost:8080/dental",
    "http://localhost:8080/patients",
    "http://localhost:8080/correspondants"
  ],
  "summary": {
    "frontend_accessible": $([ "$FRONTEND_STATUS" = "OK" ] && echo "true" || echo "false"),
    "backend_accessible": $([ "$BACKEND_STATUS" = "OK" ] && echo "true" || echo "false"),
    "html_valid": $([ "$HTML_TITLE" = "OK" ] && echo "true" || echo "false"),
    "all_routes_ok": $(echo "$ROUTE_STATUS" | grep -q "ERROR" && echo "false" || echo "true")
  }
}
EOF

echo ""
echo "📊 Rapport sauvegardé: tests/logs/simple-monitor-report.json"
echo ""
echo "📈 Résumé:"
echo "- Frontend: $FRONTEND_STATUS"
echo "- Backend: $BACKEND_STATUS"  
echo "- HTML: $HTML_TITLE"
echo "- Routes: $(echo "$ROUTE_STATUS" | grep -q "ERROR" && echo "PROBLÈMES" || echo "OK")"

# Créer aussi un log lisible pour Claude
cat > tests/logs/latest-simple-report.txt << EOF
=== RAPPORT MONITORING PAROFLOW ===
Timestamp: $TIMESTAMP

Status Serveurs:
- Frontend (8080): $FRONTEND_STATUS
- Backend (3001): $BACKEND_STATUS

Status HTML:
- Titre Paroflow: $HTML_TITLE
- Div root: $HTML_ROOT

Status Routes:$ROUTE_STATUS

Recommandations:
$([ "$FRONTEND_STATUS" != "OK" ] && echo "- Démarrer le frontend: npm run dev:frontend")
$([ "$BACKEND_STATUS" != "OK" ] && echo "- Démarrer le backend: npm run dev:api")
$([ "$HTML_TITLE" != "OK" ] && echo "- Vérifier le fichier index.html")
$(echo "$ROUTE_STATUS" | grep -q "ERROR" && echo "- Vérifier la configuration des routes React")
EOF

echo "📝 Rapport texte: tests/logs/latest-simple-report.txt"