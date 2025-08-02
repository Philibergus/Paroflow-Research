// Debug Frontend avec Playwright - Console en temps réel
const { chromium } = require('playwright');

async function debugFrontend() {
  console.log('🚀 Démarrage debug frontend avec Playwright...');
  
  const browser = await chromium.launch({ 
    headless: false,  // Mode visible pour debug
    devtools: true,   // Ouvrir DevTools automatiquement
    slowMo: 500       // Ralentir pour observation
  });
  
  const context = await browser.newContext({
    // Simuler un navigateur normal
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  // Intercepter tous les logs console
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();
    
    console.log(`📟 [${type.toUpperCase()}] ${text}`);
    if (location.url) {
      console.log(`   📍 ${location.url}:${location.lineNumber}`);
    }
  });
  
  // Intercepter les erreurs
  page.on('pageerror', error => {
    console.error('❌ Page Error:', error.message);
    console.error('📍 Stack:', error.stack);
  });
  
  // Intercepter les réponses réseau
  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    
    if (status >= 400) {
      console.error(`🔴 HTTP ${status}: ${url}`);
    } else if (status >= 300) {
      console.warn(`🟡 HTTP ${status}: ${url}`);
    } else {
      console.log(`🟢 HTTP ${status}: ${url}`);
    }
  });
  
  // Intercepter les requêtes réseau échouées
  page.on('requestfailed', request => {
    console.error(`❌ Request Failed: ${request.url()}`);
    console.error(`   Failure: ${request.failure()?.errorText}`);
  });
  
  try {
    console.log('🌐 Tentative de connexion à http://localhost:8080...');
    await page.goto('http://localhost:8080', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('✅ Page chargée ! Analyse du contenu...');
    
    // Analyser le contenu de la page
    const title = await page.title();
    console.log(`📄 Titre: ${title}`);
    
    const bodyText = await page.locator('body').textContent();
    console.log(`📝 Contenu body (100 premiers chars): ${bodyText?.substring(0, 100)}...`);
    
    // Vérifier les éléments React
    const reactRoot = await page.locator('#root').count();
    console.log(`⚛️  React root trouvé: ${reactRoot > 0 ? '✅' : '❌'}`);
    
    // Vérifier les erreurs dans la console
    const errors = await page.evaluate(() => {
      return window.console?.errors || [];
    });
    
    if (errors.length > 0) {
      console.log('❌ Erreurs détectées:', errors);
    }
    
    // Attendre et observer
    console.log('👁️  Mode observation activé. Pressez Ctrl+C pour arrêter...');
    
    // Garder la page ouverte pour observation
    await new Promise(resolve => {
      process.on('SIGINT', () => {
        console.log('🛑 Arrêt du debug...');
        resolve();
      });
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la page:');
    console.error(error.message);
    
    // Essayer de diagnostiquer
    console.log('🔍 Diagnostic du problème...');
    
    try {
      // Tester si le serveur répond
      const response = await page.request.get('http://localhost:8080');
      console.log(`📊 Status serveur: ${response.status()}`);
      
      const html = await response.text();
      console.log(`📄 HTML reçu (200 premiers chars): ${html.substring(0, 200)}...`);
      
    } catch (serverError) {
      console.error('❌ Serveur inaccessible:', serverError.message);
    }
  }
  
  await browser.close();
}

// Lancer le debug
debugFrontend().catch(console.error);