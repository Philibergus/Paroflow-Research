// French medical and dental terminology for Paroflow

export const statusLabels = {
  // Treatment status
  'planifie': 'Planifié',
  'en_cours': 'En cours',
  'termine': 'Terminé',
  'suspendu': 'Suspendu',
  
  // Step status
  'reporte': 'Reporté',
} as const

export const specialities = [
  'Orthodontie',
  'Chirurgie orale et maxillo-faciale',
  'Parodontologie',
  'Endodontie',
  'Implantologie',
  'Prothèse dentaire',
  'Dentisterie pédiatrique',
  'Médecine buccale',
  'ORL (Oto-rhino-laryngologie)',
  'Stomatologie',
  'Médecine générale',
  'Rhumatologie',
  'Cardiologie',
  'Anesthésie',
  'Radiologie dentaire',
  'Autre spécialité'
] as const

export const treatmentTypes = [
  // Consultations et examens
  'Consultation initiale',
  'Consultation de contrôle',
  'Consultation d\'urgence',
  'Examen panoramique',
  'Examen radiologique',
  
  // Soins conservateurs
  'Détartrage et polissage',
  'Carie classe I',
  'Carie classe II',
  'Carie classe III',
  'Carie classe IV',
  'Carie classe V',
  'Composite antérieur',
  'Composite postérieur',
  'Amalgame',
  'Inlay/Onlay',
  
  // Endodontie
  'Traitement endodontique monoradiculé',
  'Traitement endodontique pluriradiculé',
  'Retraitement endodontique',
  'Apexification',
  
  // Prothèse
  'Couronne céramo-métallique',
  'Couronne tout céramique',
  'Couronne sur implant',
  'Bridge 3 éléments',
  'Bridge sur implants',
  'Prothèse amovible partielle',
  'Prothèse amovible complète',
  'Attachement prothétique',
  
  // Chirurgie
  'Extraction simple',
  'Extraction chirurgicale',
  'Extraction dent de sagesse',
  'Alvéolectomie',
  'Pose d\'implant',
  'Greffe osseuse',
  'Greffe gingivale',
  'Frénectomie',
  
  // Parodontologie
  'Surfaçage radiculaire',
  'Chirurgie parodontale',
  'Greffe de gencive',
  'Comblement osseux',
  
  // Orthodontie
  'Appareil dentaire fixe',
  'Appareil dentaire amovible',
  'Gouttières transparentes',
  'Contention orthodontique',
  
  // Esthétique
  'Blanchiment dentaire',
  'Facettes céramiques',
  'Facettes composites',
  
  // Autres
  'Gouttière occlusale',
  'Traitement TMD',
  'Urgence dentaire',
  'Autre traitement'
] as const

export const teethNotation = {
  // Notation FDI (Fédération Dentaire Internationale)
  permanent: {
    // Quadrant supérieur droit (1)
    '11': 'Incisive centrale supérieure droite',
    '12': 'Incisive latérale supérieure droite',
    '13': 'Canine supérieure droite',
    '14': 'Première prémolaire supérieure droite',
    '15': 'Deuxième prémolaire supérieure droite',
    '16': 'Première molaire supérieure droite',
    '17': 'Deuxième molaire supérieure droite',
    '18': 'Troisième molaire supérieure droite',
    
    // Quadrant supérieur gauche (2)
    '21': 'Incisive centrale supérieure gauche',
    '22': 'Incisive latérale supérieure gauche',
    '23': 'Canine supérieure gauche',
    '24': 'Première prémolaire supérieure gauche',
    '25': 'Deuxième prémolaire supérieure gauche',
    '26': 'Première molaire supérieure gauche',
    '27': 'Deuxième molaire supérieure gauche',
    '28': 'Troisième molaire supérieure gauche',
    
    // Quadrant inférieur gauche (3)
    '31': 'Incisive centrale inférieure gauche',
    '32': 'Incisive latérale inférieure gauche',
    '33': 'Canine inférieure gauche',
    '34': 'Première prémolaire inférieure gauche',
    '35': 'Deuxième prémolaire inférieure gauche',
    '36': 'Première molaire inférieure gauche',
    '37': 'Deuxième molaire inférieure gauche',
    '38': 'Troisième molaire inférieure gauche',
    
    // Quadrant inférieur droit (4)
    '41': 'Incisive centrale inférieure droite',
    '42': 'Incisive latérale inférieure droite',
    '43': 'Canine inférieure droite',
    '44': 'Première prémolaire inférieure droite',
    '45': 'Deuxième prémolaire inférieure droite',
    '46': 'Première molaire inférieure droite',
    '47': 'Deuxième molaire inférieure droite',
    '48': 'Troisième molaire inférieure droite',
  }
} as const

export const commonPhrases = {
  // Navigation and UI
  search: 'Rechercher',
  add: 'Ajouter',
  edit: 'Modifier',
  delete: 'Supprimer',
  save: 'Enregistrer',
  cancel: 'Annuler',
  close: 'Fermer',
  confirm: 'Confirmer',
  loading: 'Chargement...',
  
  // Patient management
  patient: 'Patient',
  patients: 'Patients',
  newPatient: 'Nouveau patient',
  patientDetails: 'Détails du patient',
  patientHistory: 'Historique du patient',
  
  // Treatment management
  treatment: 'Traitement',
  treatments: 'Traitements',
  newTreatment: 'Nouveau traitement',
  treatmentPlan: 'Plan de traitement',
  treatmentHistory: 'Historique des traitements',
  
  // Appointments
  appointment: 'Rendez-vous',
  appointments: 'Rendez-vous',
  nextAppointment: 'Prochain rendez-vous',
  
  // Medical terms
  diagnosis: 'Diagnostic',
  symptoms: 'Symptômes',
  allergies: 'Allergies',
  medications: 'Médicaments',
  notes: 'Notes',
  
  // Time and dates
  today: 'Aujourd\'hui',
  yesterday: 'Hier',
  tomorrow: 'Demain',
  thisWeek: 'Cette semaine',
  thisMonth: 'Ce mois',
  
  // Status messages
  success: 'Succès',
  error: 'Erreur',
  warning: 'Attention',
  info: 'Information',
  
  // Confirmation messages
  deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
  unsavedChanges: 'Vous avez des modifications non sauvegardées.',
  
} as const

// Helper functions for French formatting
export const formatters = {
  // Format patient name properly
  formatPatientName: (prenom: string, nom: string): string => {
    return `${prenom} ${nom.toUpperCase()}`
  },
  
  // Format dental notation
  formatTeethNotation: (teeth: string): string => {
    return teeth.split(',').map(tooth => tooth.trim()).join(', ')
  },
  
  // Format treatment duration
  formatDuration: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours}h`
    }
    return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`
  },
  
  // Format age from birth date
  formatAge: (birthDate: string | Date): string => {
    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return `${age - 1} ans`
    }
    return `${age} ans`
  }
}

export default {
  statusLabels,
  specialities,
  treatmentTypes,
  teethNotation,
  commonPhrases,
  formatters
}