import { NextResponse } from 'next/server'
import { HealthChecker, logger } from '@/lib/monitoring/logger'

export async function GET() {
  try {
    const healthResults = await HealthChecker.runHealthChecks()
    
    logger.info('Health check performed', 'api', {
      overall: healthResults.overall,
      services: Object.keys(healthResults.services)
    })

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: healthResults.overall,
      services: healthResults.services,
      version: '1.0.0'
    })
  } catch (error) {
    logger.error('Health check failed', 'api', {}, error instanceof Error ? error : undefined)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: 'Health check failed'
    }, { status: 500 })
  }
}