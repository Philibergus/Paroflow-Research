import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

/**
 * Returns consistent Tailwind CSS classes for medical specialty badges
 * Provides good contrast and accessibility for all specialties
 */
export function getSpecialtyBadgeClasses(specialite: string): string {
  const normalizedSpecialty = specialite.toLowerCase().trim()
  
  const specialtyColors: Record<string, string> = {
    // Dental specialties - Blue family
    'orthodontie': 'bg-blue-100 text-blue-800 border-blue-200',
    'parodontologie': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'endodontie': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'implantologie': 'bg-sky-100 text-sky-800 border-sky-200',
    
    // Surgery specialties - Red family
    'chirurgie orale': 'bg-red-100 text-red-800 border-red-200',
    'chirurgie maxillo-faciale': 'bg-rose-100 text-rose-800 border-rose-200',
    
    // Medical specialties - Green family
    'médecine générale': 'bg-green-100 text-green-800 border-green-200',
    'cardiologie': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'rhumatologie': 'bg-teal-100 text-teal-800 border-teal-200',
    
    // ENT and other - Purple/Orange family
    'orl': 'bg-purple-100 text-purple-800 border-purple-200',
    'autre': 'bg-gray-100 text-gray-800 border-gray-200',
    
    // Fallback colors for variations
    'chirurgie': 'bg-red-100 text-red-800 border-red-200',
    'dentiste': 'bg-blue-100 text-blue-800 border-blue-200',
    'médecin': 'bg-green-100 text-green-800 border-green-200',
  }

  // Return matched color or default
  return specialtyColors[normalizedSpecialty] || 'bg-gray-100 text-gray-800 border-gray-200'
}