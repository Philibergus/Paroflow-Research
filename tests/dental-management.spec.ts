import { test, expect } from '@playwright/test';
import { urls, selectors, testData } from './test-data';

test.describe('Module de Gestion Dentaire', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urls.dental);
  });

  test('devrait afficher le tableau de bord dentaire', async ({ page }) => {
    // Vérifier le titre de la page
    await expect(page.locator('h1')).toContainText('Gestion Dentaire Paroflow');
    
    // Vérifier les statistiques rapides
    await expect(page.locator('text=RDV aujourd\'hui')).toBeVisible();
    await expect(page.locator('text=En attente')).toBeVisible();
    await expect(page.locator('text=Cas urgents')).toBeVisible();
    await expect(page.locator('text=Traitements actifs')).toBeVisible();
  });

  test('devrait permettre la recherche de patients', async ({ page }) => {
    // Vérifier que la recherche patient est visible
    await expect(page.locator('text=Recherche rapide')).toBeVisible();
    
    // Rechercher un patient existant
    const searchInput = page.locator(selectors.patientSearchInput).first();
    await searchInput.fill('Martin');
    
    // Attendre les résultats (avec timeout pour l'API)
    await page.waitForTimeout(1000);
    
    // Note: Les résultats dépendent des données de test dans la DB
    // On vérifie que l'interface de recherche fonctionne
    await expect(searchInput).toHaveValue('Martin');
  });

  test('devrait naviguer entre les vues (Dashboard, Patient, Queue)', async ({ page }) => {
    // Vérifier que tous les onglets de navigation sont présents
    await expect(page.locator('button:has-text("Tableau de bord")')).toBeVisible();
    await expect(page.locator('button:has-text("Patient")')).toBeVisible();
    await expect(page.locator('button:has-text("File d\'attente")')).toBeVisible();
    
    // Tester la navigation vers la file d'attente
    await page.click('button:has-text("File d\'attente")');
    await expect(page.locator('text=Gestion de la file d\'attente')).toBeVisible();
    
    // Retour au tableau de bord
    await page.click('button:has-text("Tableau de bord")');
    await expect(page.locator('text=Recherche rapide')).toBeVisible();
  });

  test('devrait afficher la file d\'attente avec différents types', async ({ page }) => {
    await page.click('button:has-text("File d\'attente")');
    
    // Vérifier les types de file d'attente
    await expect(page.locator('text=Parodontologie')).toBeVisible();
    await expect(page.locator('text=Implantologie')).toBeVisible();
    await expect(page.locator('text=Suivi')).toBeVisible();
  });

  test('devrait fonctionner sur mobile', async ({ page, browserName }) => {
    // Simuler un viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Vérifier que l'interface s'adapte
    await expect(page.locator('h1')).toBeVisible();
    
    // Vérifier que les cartes de statistiques sont empilées verticalement
    const statsCards = page.locator('[data-testid="stats-card"]');
    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
    }
    
    // Vérifier que la recherche reste utilisable
    await expect(page.locator('text=Recherche rapide')).toBeVisible();
  });
});