// Données de test pour Paroflow
export const testData = {
  patients: [
    {
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@email.com',
      telephone: '01 23 45 67 89',
      dateNaissance: '1980-05-15'
    },
    {
      nom: 'Dubois',
      prenom: 'Marie',
      email: 'marie.dubois@email.com',
      telephone: '01 98 76 54 32',
      dateNaissance: '1975-08-22'
    }
  ],
  correspondants: [
    {
      nom: 'Dr. Lefebvre',
      specialite: 'Chirurgien Dentiste',
      telephone: '01 55 44 33 22',
      email: 'dr.lefebvre@cabinet.fr',
      adresse: '123 Rue de la Santé, 75014 Paris'
    }
  ],
  traitements: [
    {
      type: 'Implant unitaire',
      dents: '16',
      statut: 'planifie',
      description: 'Pose implant molaire supérieure droite'
    },
    {
      type: 'Maintenance parodontale',
      dents: '11,12,13,21,22,23',
      statut: 'en_cours',
      description: 'Suivi parodontal secteur antérieur'
    }
  ]
};

export const selectors = {
  // Navigation
  sidebarItem: (text: string) => `text=${text}`,
  
  // Command Bar
  commandBarTrigger: 'button:has-text("Recherche globale")',
  commandBarInput: 'input[placeholder*="commande"]',
  commandBarOption: (text: string) => `button:has-text("${text}")`,
  
  // Dental Management
  patientSearchInput: 'input[placeholder*="Rechercher"]',
  patientSearchResult: (name: string) => `button:has-text("${name}")`,
  dentalChart: '[data-testid="dental-chart"]',
  tooth: (number: string) => `[data-tooth="${number}"]`,
  timelineTab: 'button:has-text("Timeline")',
  dentalChartTab: 'button:has-text("Schéma dentaire")',
  
  // Patient forms
  patientForm: '[data-testid="patient-form"]',
  nomInput: 'input[name="nom"]',
  prenomInput: 'input[name="prenom"]',
  emailInput: 'input[name="email"]',
  telephoneInput: 'input[name="telephone"]',
  submitButton: 'button[type="submit"]',
  
  // Common elements
  loadingSpinner: '.animate-spin',
  errorMessage: '[role="alert"]',
  successMessage: '.bg-green-50',
  modal: '[role="dialog"]',
  closeButton: 'button[aria-label="Close"]'
};

export const urls = {
  home: '/',
  dental: '/dental',
  patients: '/patients',
  correspondants: '/correspondants',
  reports: '/reports',
  todo: '/todo',
  statistics: '/statistics'
};