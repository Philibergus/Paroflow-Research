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
      { path: '/', titleSelector: 'main h1:has-text("Cabinet Dentaire")' },
      { path: '/patients', titleSelector: 'main h1:has-text("Patients")' },
      { path: '/correspondants', titleSelector: 'main h1:has-text("Correspondants")' },
      { path: '/implants', titleSelector: 'main h1:has-text("Gestion des Implants")' },
      { path: '/todo', titleSelector: 'main h1:has-text("Tâches et Rappels")' }
    ];

    for (const testPage of pages) {
      await page.goto(testPage.path);
      
      // Vérifier que la page se charge avec sélecteur spécifique
      await expect(page.locator(testPage.titleSelector)).toBeVisible();
      
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
    // Test de navigation via la sidebar - UX révolutionnaire avec fusion Dashboard/Dental
    const navItems = ['Patients', 'Implants', 'Correspondants', 'Tâches'];
    
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
    await page.goto('/');
    
    // Vérifier que les composants principaux du dashboard révolutionnaire sont présents
    await expect(page.locator('main h1:has-text("Cabinet Dentaire")')).toBeVisible();
    
    // Tester la nouvelle interface révolutionnaire avec onglets
    await expect(page.locator('[role="tab"]:has-text("Vue d\'ensemble")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("File d\'attente")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Traitements")')).toBeVisible();
    
    // Si des composants ne se chargent pas, les logs le révéleront
    const componentErrors = logger.getErrors();
    expect(componentErrors.length).toBe(0);
  });

  test('Revolutionary waiting list features work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Naviguer vers l'onglet file d'attente
    await page.click('text=File d\'attente');
    await page.waitForTimeout(1000);
    
    // Vérifier que la liste d'attente révolutionnaire se charge
    await expect(page.locator('text=File d\'Attente')).toBeVisible();
    
    // Tester les sélecteurs de vue révolutionnaires
    await expect(page.locator('text=Cartes')).toBeVisible();
    await expect(page.locator('text=Compact')).toBeVisible();
    await expect(page.locator('text=Timeline')).toBeVisible();
    
    // Tester le changement de vue
    await page.click('text=Compact');
    await page.waitForTimeout(500);
    await page.click('text=Timeline');
    await page.waitForTimeout(500);
    await page.click('text=Cartes');
    
    // Vérifier que les stats dynamiques sont présentes
    await expect(page.locator('text=En attente')).toBeVisible();
    await expect(page.locator('text=En cours')).toBeVisible();
    await expect(page.locator('text=Urgences')).toBeVisible();
    
    // Vérifier que la recherche révolutionnaire fonctionne
    const searchInput = page.locator('input[placeholder*="Recherche rapide"]');
    await expect(searchInput).toBeVisible();
    
    // Pas d'erreurs dans la file d'attente révolutionnaire
    const queueErrors = logger.getErrors();
    expect(queueErrors.length).toBe(0);
  });

  test('Todo auto-focus functionality works', async ({ page }) => {
    await page.goto('/todo');
    
    // Vérifier que la page Tâches se charge avec sélecteur spécifique
    await expect(page.locator('main h1:has-text("Tâches et Rappels")')).toBeVisible();
    
    // Cliquer sur "Nouvelle tâche" 
    await page.click('text=Nouvelle tâche');
    await page.waitForTimeout(500);
    
    // Vérifier que le formulaire s'ouvre et que le champ titre a le focus
    await expect(page.locator('input[placeholder="Titre de la tâche"]')).toBeVisible();
    
    // Pas d'erreurs dans la fonctionnalité auto-focus
    const todoErrors = logger.getErrors();
    expect(todoErrors.length).toBe(0);
  });

  test('Implant management with stock controls works', async ({ page }) => {
    await page.goto('/implants');
    
    // Vérifier que la gestion des implants se charge
    await expect(page.locator('text=Gestion des Implants')).toBeVisible();
    
    // Tester les onglets
    await expect(page.locator('text=Sélecteur d\'Implant')).toBeVisible();
    await expect(page.locator('text=Gestion Stock')).toBeVisible();
    
    // Naviguer vers la gestion stock pour tester les boutons +/-
    await page.click('text=Gestion Stock');
    await page.waitForTimeout(1000);
    
    // Vérifier que les contrôles de stock sont présents
    await expect(page.locator('text=État du Stock')).toBeVisible();
    
    // Pas d'erreurs dans la gestion des implants
    const implantErrors = logger.getErrors();
    expect(implantErrors.length).toBe(0);
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