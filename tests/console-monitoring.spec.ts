import { test, expect, ConsoleMessage } from '@playwright/test';

test.describe('Console Monitoring & Error Detection', () => {
  let consoleMessages: ConsoleMessage[] = [];
  let consoleErrors: ConsoleMessage[] = [];
  let consoleWarnings: ConsoleMessage[] = [];

  test.beforeEach(async ({ page }) => {
    // Reset message arrays
    consoleMessages = [];
    consoleErrors = [];
    consoleWarnings = [];

    // Listen to console events
    page.on('console', (msg) => {
      consoleMessages.push(msg);
      
      if (msg.type() === 'error') {
        consoleErrors.push(msg);
        console.log(`🔴 Console Error: ${msg.text()}`);
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg);
        console.log(`🟡 Console Warning: ${msg.text()}`);
      } else if (msg.type() === 'log') {
        console.log(`📝 Console Log: ${msg.text()}`);
      }
    });

    // Listen to page errors (uncaught exceptions)
    page.on('pageerror', (error) => {
      console.log(`💥 Page Error: ${error.message}`);
      console.log(`Stack: ${error.stack}`);
    });

    // Listen to request failures
    page.on('requestfailed', (request) => {
      console.log(`🌐 Request Failed: ${request.url()} - ${request.failure()?.errorText}`);
    });
  });

  test('CommandBar should load without console errors', async ({ page }) => {
    await page.goto('/dental');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Open CommandBar to trigger the problematic Circle import
    await page.keyboard.press('Control+k');
    
    // Wait for CommandBar to fully render
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Check for ReferenceError specifically
    const referenceErrors = consoleErrors.filter(msg => 
      msg.text().includes('ReferenceError') || 
      msg.text().includes('is not defined')
    );
    
    if (referenceErrors.length > 0) {
      console.log('🚨 Reference Errors Found:');
      referenceErrors.forEach(error => {
        console.log(`   - ${error.text()}`);
      });
    }
    
    // The test should pass now that we fixed the Circle import
    expect(referenceErrors).toHaveLength(0);
    
    // Verify CommandBar renders correctly
    await expect(page.locator('input[placeholder*="commande"]')).toBeVisible();
    
    // Close CommandBar
    await page.keyboard.press('Escape');
  });

  test('All main pages should load without critical console errors', async ({ page }) => {
    const pages = [
      { name: 'Dashboard', url: '/' },
      { name: 'Patients', url: '/patients' },
      { name: 'Correspondants', url: '/correspondants' },
      { name: 'Reports', url: '/reports' },
      { name: 'Dental Management', url: '/dental' },
      { name: 'Todo', url: '/todo' },
      { name: 'Statistics', url: '/statistics' }
    ];

    for (const pageInfo of pages) {
      console.log(`🧪 Testing ${pageInfo.name} page...`);
      
      // Reset error counters for each page
      consoleErrors = [];
      
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      
      // Check for critical errors
      const criticalErrors = consoleErrors.filter(msg => {
        const text = msg.text().toLowerCase();
        return (
          text.includes('referenceerror') ||
          text.includes('typeerror') ||
          text.includes('syntaxerror') ||
          text.includes('is not defined') ||
          text.includes('cannot read property') ||
          text.includes('cannot read properties')
        );
      });
      
      if (criticalErrors.length > 0) {
        console.log(`❌ Critical errors found on ${pageInfo.name}:`);
        criticalErrors.forEach(error => {
          console.log(`   - ${error.text()}`);
        });
      }
      
      expect(criticalErrors, `${pageInfo.name} should not have critical console errors`).toHaveLength(0);
      
      // Verify basic page functionality
      await expect(page.locator('body')).toBeVisible();
      
      console.log(`✅ ${pageInfo.name} page loaded successfully`);
    }
  });

  test('CommandBar component rendering test', async ({ page }) => {
    await page.goto('/');
    
    // Open CommandBar
    await page.keyboard.press('Control+k');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Test searching for each command to ensure all icons render
    const commands = [
      'nouveau patient',
      'correspondant',
      'rapports',
      'dentaire',
      'todo',
      'statistiques'
    ];
    
    for (const command of commands) {
      console.log(`🔍 Testing command: ${command}`);
      
      // Clear and type search
      await page.fill('input[placeholder*="commande"]', '');
      await page.fill('input[placeholder*="commande"]', command);
      
      // Wait for results
      await page.waitForTimeout(100);
      
      // Check that at least one result appears (no "Aucune commande trouvée")
      const noResultsText = page.locator('text=Aucune commande trouvée');
      await expect(noResultsText).not.toBeVisible();
      
      // Check for any rendering errors in console
      const renderErrors = consoleErrors.filter(msg => 
        msg.text().includes('Warning: Failed to create element') ||
        msg.text().includes('Element type is invalid')
      );
      
      expect(renderErrors, `Command "${command}" should render without errors`).toHaveLength(0);
    }
    
    await page.keyboard.press('Escape');
  });

  test('Import validation - detect missing imports', async ({ page }) => {
    // This test specifically looks for import-related errors
    await page.goto('/dental');
    
    // Trigger various components that might have import issues
    await page.keyboard.press('Control+k'); // CommandBar
    await page.waitForTimeout(500);
    
    // Check for specific import-related errors
    const importErrors = consoleErrors.filter(msg => {
      const text = msg.text();
      return (
        text.includes('is not defined') ||
        text.includes('Cannot resolve module') ||
        text.includes('Module not found') ||
        text.includes('Failed to resolve import')
      );
    });
    
    if (importErrors.length > 0) {
      console.log('📦 Import Errors Detected:');
      importErrors.forEach(error => {
        console.log(`   - ${error.text()}`);
        console.log(`   - Type: ${error.type()}`);
        console.log(`   - Location: ${error.location()}`);
      });
    }
    
    expect(importErrors, 'No import-related errors should be present').toHaveLength(0);
    
    await page.keyboard.press('Escape');
  });

  test('Performance monitoring - detect slow renders', async ({ page }) => {
    console.log('⏱️ Starting performance monitoring...');
    
    const startTime = Date.now();
    
    await page.goto('/dental');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`📊 Page load time: ${loadTime}ms`);
    
    // Check for performance warnings
    const performanceWarnings = consoleWarnings.filter(msg =>
      msg.text().includes('performance') ||
      msg.text().includes('slow') ||
      msg.text().includes('optimization')
    );
    
    if (performanceWarnings.length > 0) {
      console.log('⚠️ Performance Warnings:');
      performanceWarnings.forEach(warning => {
        console.log(`   - ${warning.text()}`);
      });
    }
    
    // Fail if page takes more than 10 seconds to load
    expect(loadTime, 'Page should load within reasonable time').toBeLessThan(10000);
  });

  test.afterEach(async () => {
    // Summary of console activity
    console.log('\n📋 Console Summary:');
    console.log(`   Total messages: ${consoleMessages.length}`);
    console.log(`   Errors: ${consoleErrors.length}`);
    console.log(`   Warnings: ${consoleWarnings.length}`);
    
    if (consoleErrors.length > 0) {
      console.log('\n🔴 All Errors:');
      consoleErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.text()}`);
      });
    }
  });
});