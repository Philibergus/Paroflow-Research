/**
 * Système de logging et monitoring pour Paroflow
 * Centralisé, sécurisé et conforme RGPD/HIPAA
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  context?: string
  userId?: string
  patientId?: string
  sessionId?: string
  metadata?: Record<string, unknown>
  stackTrace?: string
}

export interface PerformanceMetric {
  operation: string
  duration: number
  timestamp: Date
  success: boolean
  metadata?: Record<string, unknown>
}

class Logger {
  private logs: LogEntry[] = []
  private performanceMetrics: PerformanceMetric[] = []
  private maxLogEntries = 1000
  private logLevel = LogLevel.INFO

  constructor() {
    if (typeof window !== 'undefined') {
      // Client-side: load from localStorage
      this.loadFromStorage()
    }
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('paroflow-logs')
      if (saved) {
        const parsed = JSON.parse(saved)
        this.logs = parsed.logs || []
        this.performanceMetrics = parsed.metrics || []
      }
    } catch (error) {
      console.warn('Failed to load logs from storage:', error)
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const data = {
        logs: this.logs.slice(-this.maxLogEntries),
        metrics: this.performanceMetrics.slice(-this.maxLogEntries)
      }
      localStorage.setItem('paroflow-logs', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save logs to storage:', error)
    }
  }

  private addLog(level: LogLevel, message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (level < this.logLevel) return

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message: this.sanitizeMessage(message),
      context,
      metadata: this.sanitizeMetadata(metadata),
      sessionId: this.getSessionId()
    }

    this.logs.push(entry)

    // Keep only recent logs
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries)
    }

    this.saveToStorage()

    // Console output in development
    if (process.env.NODE_ENV === 'development') {
      const logMethod = this.getConsoleMethod(level)
      logMethod(`[${LogLevel[level]}] ${message}`, metadata)
    }
  }

  private sanitizeMessage(message: string): string {
    // Remove potential PII from log messages
    return message
      .replace(/email:\s*[\w\.-]+@[\w\.-]+/gi, 'email: [REDACTED]')
      .replace(/phone:\s*[\d\s\-\+\(\)]+/gi, 'phone: [REDACTED]')
      .replace(/ssn:\s*[\d\-]+/gi, 'ssn: [REDACTED]')
      .replace(/password:\s*\S+/gi, 'password: [REDACTED]')
  }

  private sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!metadata) return undefined

    const sanitized = { ...metadata }
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth']
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]'
      }
    }

    return sanitized
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let sessionId = sessionStorage.getItem('paroflow-session-id')
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('paroflow-session-id', sessionId)
    }
    return sessionId
  }

  private getConsoleMethod(level: LogLevel): (...args: unknown[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug
      case LogLevel.INFO:
        return console.info
      case LogLevel.WARN:
        return console.warn
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error
      default:
        return console.log
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.addLog(LogLevel.DEBUG, message, context, metadata)
  }

  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.addLog(LogLevel.INFO, message, context, metadata)
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.addLog(LogLevel.WARN, message, context, metadata)
  }

  error(message: string, context?: string, metadata?: Record<string, unknown>, error?: Error): void {
    const entry = {
      ...metadata,
      stackTrace: error?.stack
    }
    this.addLog(LogLevel.ERROR, message, context, entry)
  }

  fatal(message: string, context?: string, metadata?: Record<string, unknown>, error?: Error): void {
    const entry = {
      ...metadata,
      stackTrace: error?.stack
    }
    this.addLog(LogLevel.FATAL, message, context, entry)
  }

  // Performance monitoring
  startTimer(operation: string): () => void {
    const startTime = performance.now()
    
    return (success = true, metadata?: Record<string, unknown>) => {
      const duration = performance.now() - startTime
      
      const metric: PerformanceMetric = {
        operation,
        duration,
        timestamp: new Date(),
        success,
        metadata
      }

      this.performanceMetrics.push(metric)

      // Keep only recent metrics
      if (this.performanceMetrics.length > this.maxLogEntries) {
        this.performanceMetrics = this.performanceMetrics.slice(-this.maxLogEntries)
      }

      this.saveToStorage()

      if (duration > 1000) {
        this.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`, 'performance', { duration, operation })
      }
    }
  }

  // Analytics and reporting
  getErrorRate(timeframe = 3600000): number { // 1 hour default
    const since = new Date(Date.now() - timeframe)
    const recentLogs = this.logs.filter(log => log.timestamp >= since)
    const errorLogs = recentLogs.filter(log => log.level >= LogLevel.ERROR)
    
    return recentLogs.length > 0 ? errorLogs.length / recentLogs.length : 0
  }

  getAverageResponseTime(operation?: string, timeframe = 3600000): number {
    const since = new Date(Date.now() - timeframe)
    let metrics = this.performanceMetrics.filter(metric => metric.timestamp >= since)
    
    if (operation) {
      metrics = metrics.filter(metric => metric.operation === operation)
    }
    
    if (metrics.length === 0) return 0
    
    const totalDuration = metrics.reduce((sum, metric) => sum + metric.duration, 0)
    return totalDuration / metrics.length
  }

  getSlowestOperations(limit = 10): PerformanceMetric[] {
    return [...this.performanceMetrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit)
  }

  getRecentErrors(limit = 50): LogEntry[] {
    return this.logs
      .filter(log => log.level >= LogLevel.ERROR)
      .slice(-limit)
      .reverse()
  }

  getAllLogs(): LogEntry[] {
    return [...this.logs]
  }

  getAllMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics]
  }

  clearLogs(): void {
    this.logs = []
    this.performanceMetrics = []
    this.saveToStorage()
  }

  exportLogs(): string {
    const data = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      logs: this.logs,
      metrics: this.performanceMetrics,
      summary: {
        totalLogs: this.logs.length,
        totalMetrics: this.performanceMetrics.length,
        errorRate: this.getErrorRate(),
        averageResponseTime: this.getAverageResponseTime()
      }
    }

    return JSON.stringify(data, null, 2)
  }
}

// Singleton instance
export const logger = new Logger()

// Health check utilities
export class HealthChecker {
  static async checkDatabase(): Promise<{ status: 'healthy' | 'unhealthy', latency?: number, error?: string }> {
    const timer = logger.startTimer('health-check-database')
    
    try {
      const start = performance.now()
      // Simple DB query to check connectivity
      const response = await fetch('/api/patients?limit=1')
      const latency = performance.now() - start
      
      if (response.ok) {
        timer(true, { latency })
        return { status: 'healthy', latency }
      } else {
        timer(false, { status: response.status })
        return { status: 'unhealthy', error: `HTTP ${response.status}` }
      }
    } catch (error) {
      timer(false, { error: error instanceof Error ? error.message : 'Unknown error' })
      return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async checkOllama(): Promise<{ status: 'healthy' | 'unhealthy', models?: string[], error?: string }> {
    const timer = logger.startTimer('health-check-ollama')
    
    try {
      const response = await fetch('/api/ai/classify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'test', expectedType: 'unknown' })
      })
      
      if (response.ok) {
        timer(true)
        return { status: 'healthy' }
      } else {
        timer(false, { status: response.status })
        return { status: 'unhealthy', error: `HTTP ${response.status}` }
      }
    } catch (error) {
      timer(false, { error: error instanceof Error ? error.message : 'Unknown error' })
      return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async runHealthChecks(): Promise<{
    overall: 'healthy' | 'unhealthy',
    services: Record<string, { status: string, latency?: number, error?: string }>
  }> {
    const checks = await Promise.all([
      this.checkDatabase(),
      this.checkOllama()
    ])

    const services = {
      database: checks[0],
      ollama: checks[1]
    }

    const overall = Object.values(services).every(s => s.status === 'healthy') ? 'healthy' : 'unhealthy'

    return { overall, services }
  }
}