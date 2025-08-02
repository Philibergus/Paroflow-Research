import { test, expect } from '@playwright/test';
import { urls } from './test-data';

test.describe('Tests API et Performance', () => {
  test('devrait charger la page dentaire en moins de 3 secondes', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(urls.dental);
    await expect(page.locator('h1')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('devrait valider les endpoints API principaux', async ({ page }) => {
    // Intercepter et vérifier les appels API
    const apiCalls = [];
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        apiCalls.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    await page.goto(urls.dental);
    
    // Effectuer une recherche pour déclencher des appels API
    const searchInput = page.locator('input[placeholder*="Rechercher"]').first();
    await searchInput.fill('test');
    await page.waitForTimeout(2000);
    
    // Vérifier que les APIs répondent correctement
    const successfulCalls = apiCalls.filter(call => call.status >= 200 && call.status < 300);
    const errorCalls = apiCalls.filter(call => call.status >= 400);
    
    console.log('Appels API réussis:', successfulCalls.length);
    console.log('Appels API en erreur:', errorCalls.length);
    
    // Au moins quelques appels API devraient être réussis
    expect(successfulCalls.length).toBeGreaterThan(0);
    
    // Afficher les erreurs pour debug
    if (errorCalls.length > 0) {
      console.log('Erreurs API:', errorCalls);
    }
  });

  test('devrait gérer les erreurs réseau gracieusement', async ({ page }) => {
    // Simuler une perte de connexion pour certaines APIs
    await page.route('**/api/patients*', route => {
      route.abort('networkfailure');
    });
    
    await page.goto(urls.dental);
    
    // L'application doit rester fonctionnelle même avec des erreurs API
    await expect(page.locator('h1')).toBeVisible();
    
    // Essayer de faire une recherche
    const searchInput = page.locator('input[placeholder*="Rechercher"]').first();
    await searchInput.fill('test');
    
    // L'interface ne doit pas crasher
    await expect(searchInput).toBeVisible();
  });

  test('devrait maintenir de bonnes performances avec de nombreuses interactions', async ({ page }) => {
    await page.goto(urls.dental);
    
    const startTime = Date.now();
    
    // Série d'interactions rapides
    for (let i = 0; i < 10; i++) {
      // Navigation entre les vues
      await page.click('button:has-text("File d\'attente")');
      await page.waitForTimeout(100);
      await page.click('button:has-text("Tableau de bord")');
      await page.waitForTimeout(100);
      
      // Recherches multiples
      const searchInput = page.locator('input[placeholder*="Rechercher"]').first();
      await searchInput.fill(`test${i}`);
      await page.waitForTimeout(50);
      await searchInput.clear();
    }
    
    const totalTime = Date.now() - startTime;
    
    // Les interactions ne doivent pas ralentir l'application
    expect(totalTime).toBeLessThan(10000);
    
    // L'interface doit rester responsive
    await expect(page.locator('h1')).toBeVisible();
  });

  test('devrait fonctionner correctement dans tous les navigateurs', async ({ page, browserName }) => {
    await page.goto(urls.dental);
    
    // Vérifications spécifiques par navigateur
    await expect(page.locator('h1')).toBeVisible();
    
    // Test des fonctionnalités JavaScript
    await page.keyboard.press('Control+k');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.keyboard.press('Escape');
    
    // Vérifier que les styles CSS sont bien appliqués
    const titleElement = page.locator('h1');
    const computedColor = await titleElement.evaluate(el => 
      window.getComputedStyle(el).color
    );
    
    // La couleur ne doit pas être la couleur par défaut du navigateur
    expect(computedColor).not.toBe('rgb(0, 0, 0)');
    
    console.log(`Test réussi sur ${browserName}`);
  });

  test('devrait avoir une bonne accessibilité', async ({ page }) => {
    await page.goto(urls.dental);
    
    // Vérifier les éléments d'accessibilité de base
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    expect(headings).toBeGreaterThan(0);
    
    // Vérifier que les boutons ont des labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      // Chaque bouton doit avoir soit un texte soit un aria-label
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }
    
    // Vérifier la navigation au clavier
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT', 'A']).toContain(focusedElement);
  });
});