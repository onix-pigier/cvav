#!/usr/bin/env bash

# 🚀 QUICK START - Admin Dashboard
# Guide rapide pour commencer à tester

echo "🎛️ ========================="
echo "   Admin Dashboard Testing"
echo "=========================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier que le serveur est en cours d'exécution
echo -e "${BLUE}1️⃣ Vérification du serveur...${NC}"
if ! curl -s http://localhost:3000/api/check-db > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️ Le serveur ne semble pas démarré.${NC}"
  echo "Démarrez-le avec: npm run dev"
  exit 1
fi
echo -e "${GREEN}✅ Serveur détecté${NC}"
echo ""

# Menu des options
echo -e "${BLUE}Choisissez une option:${NC}"
echo "1) Tester les pages admin (accès)"
echo "2) Tester les notifications"
echo "3) Tester les attestations"
echo "4) Tester les cérémonies"
echo "5) Voir tous les tests"
echo "6) Lancer tests automatisés"
echo ""

read -p "Votre choix (1-6): " choice

case $choice in
  1)
    echo -e "${BLUE}🔍 Test d'accès aux pages admin...${NC}"
    echo ""
    
    for page in "admin" "admin/dashboard" "admin/attestations" "admin/ceremonies"; do
      echo -n "  Vérification /admin/$page... "
      status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/$page)
      if [ $status -eq 200 ]; then
        echo -e "${GREEN}✅ OK ($status)${NC}"
      elif [ $status -eq 401 ] || [ $status -eq 403 ]; then
        echo -e "${YELLOW}⚠️ Authentification requise ($status)${NC}"
      else
        echo -e "${YELLOW}⚠️ Status $status${NC}"
      fi
    done
    echo ""
    echo -e "${GREEN}✅ Test accès complété${NC}"
    ;;
    
  2)
    echo -e "${BLUE}🔔 Test des notifications...${NC}"
    echo ""
    echo "Récupération des notifications..."
    curl -s http://localhost:3000/api/notifications | jq '.' 2>/dev/null || echo "API disponible"
    echo ""
    ;;
    
  3)
    echo -e "${BLUE}📋 Test des attestations...${NC}"
    echo ""
    echo "Récupération des attestations..."
    curl -s "http://localhost:3000/api/attestations?limit=5" | jq '.data | length' 2>/dev/null || echo "API disponible"
    echo ""
    ;;
    
  4)
    echo -e "${BLUE}🎊 Test des cérémonies...${NC}"
    echo ""
    echo "Récupération des cérémonies..."
    curl -s "http://localhost:3000/api/ceremonies?limit=5" | jq '.data | length' 2>/dev/null || echo "API disponible"
    echo ""
    ;;
    
  5)
    echo -e "${BLUE}📊 Tous les tests...${NC}"
    echo ""
    echo -e "${GREEN}✅ Pages Admin${NC}"
    for page in "admin" "admin/dashboard" "admin/attestations" "admin/ceremonies"; do
      status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/$page)
      echo "  • /$page: $status"
    done
    echo ""
    
    echo -e "${GREEN}✅ APIs${NC}"
    for api in "attestations" "ceremonies" "notifications"; do
      status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/$api)
      echo "  • /api/$api: $status"
    done
    echo ""
    ;;
    
  6)
    echo -e "${BLUE}🧪 Lancement des tests automatisés...${NC}"
    echo ""
    npm run test:admin-dashboard 2>/dev/null || npx ts-node scripts/test-admin-dashboard.ts
    echo ""
    ;;
    
  *)
    echo -e "${YELLOW}Choix invalide${NC}"
    exit 1
    ;;
esac

echo -e "${BLUE}=========================${NC}"
echo -e "${GREEN}✅ Test complété!${NC}"
echo ""
echo "📖 Pour plus d'infos:"
echo "   • Docs: cat docs/ADMIN_TESTING_GUIDE.md"
echo "   • Admin: http://localhost:3000/admin"
echo "   • Dashboard: http://localhost:3000/admin/dashboard"
echo ""
