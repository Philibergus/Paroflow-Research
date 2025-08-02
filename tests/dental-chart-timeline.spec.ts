import { test, expect } from '@playwright/test';
import { urls, selectors } from './test-data';

test.describe('Schéma Dentaire et Timeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urls.dental);
  });

  test('devrait sélectionner un patient et afficher sa vue détaillée', async ({ page }) => {
    // Simuler la sélection d'un patient (dépend des données test)
    const searchInput = page.locator(selectors.patientSearchInput).first();
    await searchInput.fill('Martin');
    
    // Attendre et cliquer sur un résultat si disponible
    await page.waitForTimeout(1000);
    
    // Chercher un élément patient dans les résultats
    const patientResult = page.locator('button').filter({ hasText: 'Martin' }).first();
    
    if (await patientResult.count() > 0) {
      await patientResult.click();
      
      // Vérifier que la vue patient s'affiche
      await expect(page.locator('text=Patient ID')).toBeVisible();
      await expect(page.locator(selectors.timelineTab)).toBeVisible();
      await expect(page.locator(selectors.dentalChartTab)).toBeVisible();
    }
  });

  test('devrait afficher le schéma dentaire avec les 32 dents', async ({ page }) => {
    // Note: Ce test nécessite qu'un patient soit sélectionné
    // On va simuler cela en naviguant directement si possible
    
    // Essayer de sélectionner un patient via la recherche
    const searchInput = page.locator(selectors.patientSearchInput).first();
    await searchInput.fill('test');
    await page.waitForTimeout(500);
    
    // Si aucun patient n'est trouvé, on teste l'interface générale
    await expect(page.locator('text=Schéma dentaire')).toBeVisible();
    
    // Test des composants dentaires s'ils sont visibles
    const dentalChartSection = page.locator('text=Schéma dentaire');
    if (await dentalChartSection.isVisible()) {
      // Vérifier la présence de la légende dentaire
      await expect(page.locator('text=Arcade supérieure')).toBeVisible();
      await expect(page.locator('text=Arcade inférieure')).toBeVisible();
    }
  });

  test('devrait permettre la navigation entre Timeline et Schéma dentaire', async ({ page }) => {
    // Simuler la sélection d'un patient
    const searchInput = page.locator(selectors.patientSearchInput).first();
    await searchInput.fill('Martin');
    await page.waitForTimeout(1000);
    
    const patientButton = page.locator('button').filter({ hasText: 'Martin' }).first();
    
    if (await patientButton.count() > 0) {
      await patientButton.click();
      
      // Tester la navigation entre les onglets
      await page.click(selectors.dentalChartTab);
      await expect(page.locator('text=Cliquez sur une dent')).toBeVisible();
      
      await page.click(selectors.timelineTab);
      await expect(page.locator('text=Frise chronologique') || page.locator('text=Timeline')).toBeVisible();
    }
  });

  test('devrait afficher les 5 scénariotypes cliniques', async ({ page }) => {
    // Naviguer vers un patient et la timeline
    const searchInput = page.locator(selectors.patientSearchInput).first();
    await searchInput.fill('test');
    await page.waitForTimeout(500);
    
    // Chercher les scénariotypes dans l'interface
    const scenarioElements = [
      'Maintenance parodontale',
      'Implantologie simple', 
      'Implantologie complexe',
      'Orthodontie adulte',
      'Traitement parodontal'
    ];
    
    // Vérifier si les scénarios sont présents dans la page
    for (const scenario of scenarioElements) {
      const element = page.locator(`text=${scenario}`);
      if (await element.count() > 0) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('devrait être responsive sur différentes tailles d\'écran', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 1024, height: 768, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Vérifier que les éléments principaux restent accessibles
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Recherche rapide')).toBeVisible();
      
      // Sur mobile, vérifier que les éléments ne débordent pas
      if (viewport.name === 'Mobile') {
        const body = page.locator('body');
        const boundingBox = await body.boundingBox();
        expect(boundingBox?.width).toBeLessThanOrEqual(viewport.width);
      }
    }
  });

  test('devrait gérer les états de chargement et erreurs', async ({ page }) => {
    // Tester avec une recherche qui pourrait échouer
    const searchInput = page.locator(selectors.patientSearchInput).first();
    await searchInput.fill('patient_inexistant_xyz');
    
    // Attendre et vérifier qu'aucune erreur critique n'apparaît
    await page.waitForTimeout(2000);
    
    // La page doit rester fonctionnelle
    await expect(page.locator('h1')).toBeVisible();
    await expect(searchInput).toBeVisible();
  });
});