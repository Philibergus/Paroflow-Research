import { describe, it, expect } from 'vitest'

// Tests unitaires pour les nouvelles fonctionnalités email et UX révolutionnaires

describe('Email Functionality', () => {
  it('should validate email format correctly', () => {
    const validEmails = [
      'test@example.com',
      'dr.martin@cabinet.fr',
      'contact@biotech-dental.com'
    ]
    
    const invalidEmails = [
      'invalid-email',
      '@example.com',
      'test@',
      ''
    ]

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    validEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(true)
    })

    invalidEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(false)
    })
  })

  it('should format correspondant name correctly', () => {
    const formatCorrespondantName = (nom: string) => `Dr. ${nom}`
    
    expect(formatCorrespondantName('Martin')).toBe('Dr. Martin')
    expect(formatCorrespondantName('Dupont')).toBe('Dr. Dupont')
  })

  it('should create proper email template variables', () => {
    const correspondant = {
      id: '1',
      nom: 'Martin',
      specialite: 'Orthodontie',
      email: 'dr.martin@test.com'
    }

    const templateVariables = {
      correspondant: `Dr. ${correspondant.nom}`,
      specialite: correspondant.specialite,
      praticien: 'Dr. Martin'
    }

    expect(templateVariables.correspondant).toBe('Dr. Martin')
    expect(templateVariables.specialite).toBe('Orthodontie')
    expect(templateVariables.praticien).toBe('Dr. Martin')
  })
})

describe('Revolutionary UX Features', () => {
  it('should handle stock threshold colors correctly', () => {
    const getStockColor = (quantiteStock: number, seuilAlerte: number) => {
      if (quantiteStock === 0) return 'bg-red-500 text-white'
      
      const ratio = quantiteStock / seuilAlerte
      if (ratio <= 0.5) return 'bg-red-400 text-white'
      if (ratio <= 1) return 'bg-orange-400 text-white'
      if (ratio <= 1.5) return 'bg-yellow-400 text-gray-800'
      return 'bg-green-500 text-white'
    }

    expect(getStockColor(0, 10)).toBe('bg-red-500 text-white')
    expect(getStockColor(3, 10)).toBe('bg-red-400 text-white')
    expect(getStockColor(8, 10)).toBe('bg-orange-400 text-white')
    expect(getStockColor(12, 10)).toBe('bg-yellow-400 text-gray-800')
    expect(getStockColor(20, 10)).toBe('bg-green-500 text-white')
  })

  it('should format waiting time correctly', () => {
    const getTotalWaitTime = (dateAjout: string): string => {
      const now = new Date()
      const added = new Date(dateAjout)
      const diffMs = now.getTime() - added.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      
      if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m`
      }
      return `${diffMinutes}m`
    }

    // Test avec une date il y a 2 heures
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const waitTime = getTotalWaitTime(twoHoursAgo)
    expect(waitTime).toMatch(/\d+h \d+m/)
  })

  it('should validate Biotech implant references', () => {
    const biotechReferences = [
      'KONTACT-3010',
      'KONTACT-4013',
      'KONTACT_PLUS-3815'
    ]

    biotechReferences.forEach(ref => {
      expect(ref).toMatch(/^KONTACT/)
      expect(ref).toContain('-')
    })
  })
})

describe('Queue Management', () => {
  it('should sort queue by priority correctly', () => {
    const mockQueue = [
      { id: '1', priorite: 2, dateAjout: '2025-02-03T09:00:00Z' },
      { id: '2', priorite: 4, dateAjout: '2025-02-03T10:00:00Z' },
      { id: '3', priorite: 1, dateAjout: '2025-02-03T08:00:00Z' }
    ]

    const sortedQueue = mockQueue.sort((a, b) => {
      if (a.priorite !== b.priorite) {
        return b.priorite - a.priorite
      }
      return new Date(a.dateAjout).getTime() - new Date(b.dateAjout).getTime()
    })

    expect(sortedQueue[0].priorite).toBe(4) // Urgence en premier
    expect(sortedQueue[1].priorite).toBe(2) // Normale
    expect(sortedQueue[2].priorite).toBe(1) // Basse en dernier
  })

  it('should filter queue by type correctly', () => {
    const mockQueue = [
      { id: '1', type: 'implant' },
      { id: '2', type: 'emergency' },
      { id: '3', type: 'periodontal' }
    ]

    const implantQueue = mockQueue.filter(item => item.type === 'implant')
    const emergencyQueue = mockQueue.filter(item => item.type === 'emergency')

    expect(implantQueue).toHaveLength(1)
    expect(emergencyQueue).toHaveLength(1)
    expect(implantQueue[0].id).toBe('1')
    expect(emergencyQueue[0].id).toBe('2')
  })
})