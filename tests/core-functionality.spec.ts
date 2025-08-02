import { test, expect, Page } from '@playwright/test';

// Système de capture des logs intégré aux tests
class TestLogger {
  private logs: Array<{timestamp: string, type: string, message: string}> = [];
  
  captureConsoleLogs(page: Page) {
    page.on('console', msg => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        type: msg.type(),
        message: msg.text()
      };
      this.logs.push(logEntry);
      
      // Afficher les erreurs immédiatement
      if (msg.type() === 'error') {
        console.error(`🔴 Console Error: ${msg.text()}`);
      }
    });

    page.on('pageerror', error => {
      const errorEntry = {
        timestamp: new Date().toISOString(),
        type: 'pageerror',
        message: `${error.message}\n${error.stack}`
      };
      this.logs.push(errorEntry);
      console.error(`❌ Page Error: ${error.message}`);
    });
  }

  getErrors() {
    return this.logs.filter(log => log.type === 'error' || log.type === 'pageerror');
  }

  getAllLogs() {
    return this.logs;
  }
}

test.describe('Paroflow Core Functionality', () => {
  let logger: TestLogger;

  test.beforeEach(async ({ page }) => {
    logger = new TestLogger();
    logger.captureConsoleLogs(page);
    await page.goto('/');
  });

  test('Application loads without JavaScript errors', async ({ page }) => {
    // Attendre que l'app se charge complètement
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(3000); // Laisser le temps aux composants de se monter
    
    // Vérifier qu'il n'y a pas d'erreurs JavaScript
    const errors = logger.getErrors();
    
    if (errors.length > 0) {
      console.log('📋 Erreurs détectées:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type}] ${error.message}`);
      });
    }
    
    expect(errors.length).toBe(0);
  });

  test('All main pages render correctly', async ({ page }) => {
    const pages = [
      { path: '/', title: 'Tableau de bord' },
      { path: '/dental', title: 'Gestion Dentaire' },
      { path: '/patients', title: 'Patients' },
      { path: '/correspondants', title: 'Correspondants' }
    ];

    for (const testPage of pages) {
      await page.goto(testPage.path);
      
      // Vérifier que la page se charge
      await expect(page.locator('h1, h2')).toContainText(testPage.title);
      
      // Vérifier qu'il n'y a pas d'erreurs sur cette page
      await page.waitForTimeout(2000);
      const pageErrors = logger.getErrors();
      
      if (pageErrors.length > 0) {
        console.log(`❌ Erreurs sur ${testPage.path}:`);
        pageErrors.forEach(error => console.log(`  - ${error.message}`));
      }
      
      expect(pageErrors.length).toBe(0);
    }
  });

  test('Navigation works without errors', async ({ page }) => {
    // Test de navigation via la sidebar
    const navItems = ['Patients', 'Gestion Dentaire', 'Correspondants'];
    
    for (const item of navItems) {
      await page.click(`text=${item}`);
      await page.waitForTimeout(1000);
      
      // Vérifier que la navigation a fonctionné
      await expect(page.locator('main')).toBeVisible();
    }
    
    // Pas d'erreurs pendant la navigation
    const navErrors = logger.getErrors();
    expect(navErrors.length).toBe(0);
  });

  test('Components render with proper error boundaries', async ({ page }) => {
    await page.goto('/dental');
    
    // Vérifier que les composants principaux sont présents
    await expect(page.locator('text=Gestion Dentaire')).toBeVisible();
    
    // Si des composants ne se chargent pas, les logs le révéleront
    const componentErrors = logger.getErrors();
    expect(componentErrors.length).toBe(0);
  });

  test.afterEach(async () => {
    // Sauvegarder tous les logs pour analyse par Claude
    const allLogs = logger.getAllLogs();
    if (allLogs.length > 0) {
      console.log(`📊 Session logs: ${allLogs.length} entrées`);
      
      // Sauvegarder dans un fichier que Claude peut lire
      const fs = require('fs');
      const logsPath = './tests/logs/latest-test-session.json';
      fs.mkdirSync('./tests/logs', { recursive: true });
      fs.writeFileSync(logsPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        logs: allLogs
      }, null, 2));
    }
  });
});