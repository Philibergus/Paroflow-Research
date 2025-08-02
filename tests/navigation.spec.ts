import { test, expect } from '@playwright/test';
import { urls, selectors } from './test-data';

test.describe('Navigation et Recherche Globale', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('devrait afficher le titre Paroflow correctement', async ({ page }) => {
    await expect(page).toHaveTitle(/Paroflow/);
    
    // Vérifier que l'ancien titre "perio-scribe" n'apparaît plus
    await expect(page).not.toHaveTitle(/perio-scribe/);
  });

  test('devrait naviguer vers toutes les pages principales', async ({ page }) => {
    const pages = [
      { name: 'Patients', url: urls.patients },
      { name: 'Correspondants', url: urls.correspondants },
      { name: 'Comptes Rendus', url: urls.reports },
      { name: 'To-Do List', url: urls.todo }
    ];

    for (const pageInfo of pages) {
      await page.click(`text=${pageInfo.name}`);
      await expect(page).toHaveURL(pageInfo.url);
      
      // Vérifier que la page se charge sans erreurs
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('devrait ouvrir la recherche globale avec Ctrl+K', async ({ page }) => {
    // Aller sur la page dental management
    await page.goto(urls.dental);
    
    // Ouvrir la command bar avec Ctrl+K
    await page.keyboard.press('Control+k');
    
    // Vérifier que la command bar s'ouvre
    await expect(page.locator(selectors.modal)).toBeVisible();
    await expect(page.locator(selectors.commandBarInput)).toBeVisible();
  });

  test('devrait ouvrir la recherche globale via le bouton', async ({ page }) => {
    await page.goto(urls.dental);
    
    // Cliquer sur le bouton de recherche globale
    await page.click(selectors.commandBarTrigger);
    
    // Vérifier que la command bar s'ouvre
    await expect(page.locator(selectors.modal)).toBeVisible();
    await expect(page.locator(selectors.commandBarInput)).toBeFocused();
  });

  test('devrait effectuer une recherche et naviguer vers les résultats', async ({ page }) => {
    await page.goto(urls.dental);
    
    // Ouvrir la command bar
    await page.keyboard.press('Control+k');
    
    // Rechercher "dentaire"
    await page.fill(selectors.commandBarInput, 'dentaire');
    
    // Vérifier que "Gestion Dentaire" apparaît dans les résultats
    await expect(page.locator(selectors.commandBarOption('Gestion Dentaire'))).toBeVisible();
    
    // Cliquer sur le résultat
    await page.click(selectors.commandBarOption('Gestion Dentaire'));
    
    // Vérifier la navigation
    await expect(page).toHaveURL(urls.dental);
    await expect(page.locator(selectors.modal)).not.toBeVisible();
  });

  test('devrait proposer des suggestions intelligentes', async ({ page }) => {
    await page.goto(urls.dental);
    await page.keyboard.press('Control+k');
    
    const searches = [
      { query: 'nouveau patient', expectedResult: 'Nouveau patient' },
      { query: 'ajouter correspondant', expectedResult: 'Nouveau correspondant' },
      { query: 'rapport', expectedResult: 'Rapports et traitements' },
      { query: 'todo', expectedResult: 'Tâches et Todos' }
    ];

    for (const search of searches) {
      await page.fill(selectors.commandBarInput, '');
      await page.fill(selectors.commandBarInput, search.query);
      
      await expect(page.locator(selectors.commandBarOption(search.expectedResult))).toBeVisible();
    }
  });

  test('devrait naviguer avec les flèches du clavier', async ({ page }) => {
    await page.goto(urls.dental);
    await page.keyboard.press('Control+k');
    
    // Rechercher pour avoir plusieurs résultats
    await page.fill(selectors.commandBarInput, 'patient');
    
    // Utiliser les flèches pour naviguer
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    
    // Confirmer avec Entrée
    await page.keyboard.press('Enter');
    
    // Vérifier que la command bar se ferme
    await expect(page.locator(selectors.modal)).not.toBeVisible();
  });

  test('devrait fermer la command bar avec Escape', async ({ page }) => {
    await page.goto(urls.dental);
    await page.keyboard.press('Control+k');
    
    await expect(page.locator(selectors.modal)).toBeVisible();
    
    await page.keyboard.press('Escape');
    
    await expect(page.locator(selectors.modal)).not.toBeVisible();
  });
});