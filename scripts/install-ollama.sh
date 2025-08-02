#!/bin/bash

# Script d'installation Ollama pour Paroflow
echo "🤖 Installation d'Ollama pour Paroflow..."
echo ""
echo "Ce script va installer Ollama et configurer les modèles IA locaux."
echo "Vous devrez entrer votre mot de passe sudo."
echo ""

# Installation Ollama
echo "📦 Installation d'Ollama..."
curl -fsSL https://ollama.com/install.sh | sh

# Vérifier l'installation
if command -v ollama &> /dev/null; then
    echo "✅ Ollama installé avec succès!"
    
    # Démarrer le service
    echo "🚀 Démarrage du service Ollama..."
    ollama serve &
    sleep 5
    
    # Télécharger les modèles recommandés
    echo "📥 Téléchargement des modèles IA optimisés pour Paroflow..."
    echo ""
    
    echo "1️⃣ Téléchargement Llama 3.2:3b (2GB - Ultra-rapide)..."
    ollama pull llama3.2:3b-instruct-q6_K
    
    echo "2️⃣ Téléchargement Mistral 7B (5GB - Français médical)..."
    ollama pull mistral:7b-instruct-q6_K
    
    echo "3️⃣ Téléchargement Phi-3.5 (3GB - Classification)..."
    ollama pull phi3.5:3.8b-mini-instruct-q6_K
    
    echo ""
    echo "📋 Modèles installés :"
    ollama list
    
    echo ""
    echo "✅ Installation terminée avec succès!"
    echo ""
    echo "🔧 Configuration recommandée (ajouter à ~/.bashrc) :"
    echo "export OLLAMA_MAX_LOADED_MODELS=2"
    echo "export OLLAMA_NUM_PARALLEL=2"
    echo "export OLLAMA_HOST=127.0.0.1:11434"
else
    echo "❌ Erreur : Ollama n'a pas pu être installé."
    echo "Veuillez installer manuellement : https://ollama.com/download"
fi