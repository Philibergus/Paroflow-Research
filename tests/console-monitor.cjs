// Console Monitor - Capture et sauvegarde les logs pour Claude Code
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class ConsoleMonitor {
  constructor() {
    this.logs = [];
    this.logFile = path.join(__dirname, 'logs', 'browser-console.json');
    this.ensureLogDir();
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  async startMonitoring(url = 'http://localhost:8080') {
    console.log('🔍 Démarrage monitoring console navigateur...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Capturer TOUS les logs
    page.on('console', msg => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
        url: page.url()
      };
      
      this.logs.push(logEntry);
      console.log(`📟 [${logEntry.type.toUpperCase()}] ${logEntry.text}`);
      
      // Sauvegarder en temps réel
      this.saveLogs();
    });

    // Capturer les erreurs JavaScript
    page.on('pageerror', error => {
      const errorEntry = {
        timestamp: new Date().toISOString(),
        type: 'pageerror',
        message: error.message,
        stack: error.stack,
        url: page.url()
      };
      
      this.logs.push(errorEntry);
      console.error('❌ Page Error:', error.message);
      this.saveLogs();
    });

    // Capturer les échecs de requêtes
    page.on('requestfailed', request => {
      const failEntry = {
        timestamp: new Date().toISOString(),
        type: 'requestfailed',
        url: request.url(),
        failure: request.failure()?.errorText,
        method: request.method()
      };
      
      this.logs.push(failEntry);
      console.error('🔴 Request Failed:', request.url());
      this.saveLogs();
    });

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Tester navigation sur pages principales
      const testPages = ['/dental', '/patients', '/correspondants'];
      
      for (const testPage of testPages) {
        console.log(`🧪 Test page: ${testPage}`);
        await page.goto(`${url}${testPage}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000); // Laisser le temps aux composants de se charger
      }
      
      console.log('✅ Monitoring terminé');
      
    } catch (error) {
      console.error('❌ Erreur monitoring:', error.message);
      this.logs.push({
        timestamp: new Date().toISOString(),
        type: 'monitor_error',
        message: error.message,
        stack: error.stack
      });
      this.saveLogs();
    }

    await browser.close();
    return this.generateReport();
  }

  saveLogs() {
    try {
      fs.writeFileSync(this.logFile, JSON.stringify(this.logs, null, 2));
    } catch (error) {
      console.error('Erreur sauvegarde logs:', error);
    }
  }

  generateReport() {
    const errors = this.logs.filter(log => 
      log.type === 'error' || log.type === 'pageerror' || log.type === 'requestfailed'
    );
    const warnings = this.logs.filter(log => log.type === 'warning');
    
    const report = {
      summary: {
        total_logs: this.logs.length,
        errors: errors.length,
        warnings: warnings.length,
        timestamp: new Date().toISOString()
      },
      critical_errors: errors,
      all_logs: this.logs
    };

    // Sauvegarder le rapport
    const reportFile = path.join(__dirname, 'logs', 'latest-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`📊 Rapport généré: ${reportFile}`);
    console.log(`📈 Stats: ${this.logs.length} logs, ${errors.length} erreurs, ${warnings.length} warnings`);
    
    return report;
  }
}

// Export pour utilisation dans tests
module.exports = { ConsoleMonitor };

// Exécution directe
if (require.main === module) {
  const monitor = new ConsoleMonitor();
  monitor.startMonitoring().catch(console.error);
}