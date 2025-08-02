// Clinical Scenario Templates for Dental Practice Management
// Defines the 5 predefined clinical pathways (scénariotypes)

export interface ScenarioStep {
  id: string
  titre: string
  description: string
  dureeEstimee: number // in days
  type: 'consultation' | 'surgery' | 'control' | 'waiting' | 'decision'
  isOptional?: boolean
  branches?: ScenarioBranch[]
  preconditions?: string[]
  actions?: string[]
}

export interface ScenarioBranch {
  id: string
  condition: string
  titre: string
  nextStepId: string
}

export interface ScenarioTemplate {
  id: string
  nom: string
  titre: string
  description: string
  dureeEstimeeTotal: number
  steps: ScenarioStep[]
  metadata: {
    complexity: 'simple' | 'moderate' | 'complex'
    specialization: string[]
    costRange: [number, number]
  }
}

// Scénariotype 1: Wisdom Tooth Extraction
export const wisdomToothExtractionScenario: ScenarioTemplate = {
  id: 'wisdom_extraction',
  nom: 'wisdom_extraction',
  titre: 'Extraction des dents de sagesse',
  description: 'Protocole standard pour l\'extraction des dents de sagesse en deux séances',
  dureeEstimeeTotal: 45,
  steps: [
    {
      id: 'preop_consultation',
      titre: 'Consultation pré-opératoire',
      description: 'Évaluation clinique, radiographie panoramique, planification chirurgicale',
      dureeEstimee: 0,
      type: 'consultation',
      actions: ['radiographie', 'evaluation_clinique', 'planification']
    },
    {
      id: 'surgery_first_side',
      titre: 'Chirurgie 1er côté (18-48)',
      description: 'Extraction des dents de sagesse supérieure et inférieure droites',
      dureeEstimee: 7,
      type: 'surgery',
      actions: ['extraction_18', 'extraction_48', 'sutures']
    },
    {
      id: 'surgery_second_side',
      titre: 'Chirurgie 2ème côté (28-38)',
      description: 'Extraction des dents de sagesse supérieure et inférieure gauches',
      dureeEstimee: 14,
      type: 'surgery',
      actions: ['extraction_28', 'extraction_38', 'sutures']
    },
    {
      id: 'postop_control',
      titre: 'Contrôle post-opératoire',
      description: 'Vérification de la cicatrisation, retrait des sutures si nécessaire',
      dureeEstimee: 35,
      type: 'control',
      isOptional: true,
      preconditions: ['sutures_non_resorbables']
    }
  ],
  metadata: {
    complexity: 'moderate',
    specialization: ['chirurgie_orale'],
    costRange: [800, 1500]
  }
}

// Scénariotype 2: Non-Surgical Periodontal Therapy
export const nonSurgicalPeriodontalScenario: ScenarioTemplate = {
  id: 'periodontal_nonsurgical',
  nom: 'periodontal_nonsurgical',
  titre: 'Thérapie parodontale non-chirurgicale',
  description: 'Traitement parodontal conservateur avec détartrage et surfaçage radiculaire',
  dureeEstimeeTotal: 70,
  steps: [
    {
      id: 'initial_assessment',
      titre: 'Bilan parodontal initial',
      description: 'Sondage parodontal, indices, classification EFP, radiographies',
      dureeEstimee: 0,
      type: 'consultation',
      actions: ['sondage_parodontal', 'indices_parodontaux', 'classification_efp']
    },
    {
      id: 'scaling_maxillary',
      titre: 'Détartrage maxillaire',
      description: 'Détartrage et surfaçage radiculaire de l\'arcade supérieure',
      dureeEstimee: 7,
      type: 'surgery',
      actions: ['detartrage_maxillaire', 'surfacage_radiculaire']
    },
    {
      id: 'scaling_mandibular',
      titre: 'Détartrage mandibulaire',
      description: 'Détartrage et surfaçage radiculaire de l\'arcade inférieure',
      dureeEstimee: 14,
      type: 'surgery',
      actions: ['detartrage_mandibulaire', 'surfacage_radiculaire']
    },
    {
      id: 'healing_period',
      titre: 'Période de cicatrisation',
      description: 'Attente de 6-8 semaines pour la cicatrisation tissulaire',
      dureeEstimee: 56,
      type: 'waiting'
    },
    {
      id: 'reevaluation',
      titre: 'Réévaluation',
      description: 'Évaluation de la réponse au traitement, nouveau sondage',
      dureeEstimee: 70,
      type: 'consultation',
      branches: [
        {
          id: 'maintenance',
          condition: 'improvement_good',
          titre: 'Maintenance parodontale',
          nextStepId: 'maintenance_program'
        },
        {
          id: 'localized_scaling',
          condition: 'localized_issues',
          titre: 'Détartrage localisé',
          nextStepId: 'additional_scaling'
        },
        {
          id: 'surgical_therapy',
          condition: 'insufficient_improvement',
          titre: 'Thérapie chirurgicale',
          nextStepId: 'surgical_evaluation'
        }
      ]
    }
  ],
  metadata: {
    complexity: 'moderate',
    specialization: ['parodontologie'],
    costRange: [600, 1200]
  }
}

// Scénariotype 3: Surgical Periodontal Therapy
export const surgicalPeriodontalScenario: ScenarioTemplate = {
  id: 'periodontal_surgical',
  nom: 'periodontal_surgical',
  titre: 'Thérapie parodontale chirurgicale',
  description: 'Traitement chirurgical des défauts parodontaux avec régénération',
  dureeEstimeeTotal: 120,
  steps: [
    {
      id: 'initial_assessment',
      titre: 'Bilan parodontal initial',
      description: 'Évaluation complète avec CBCT si nécessaire',
      dureeEstimee: 0,
      type: 'consultation'
    },
    {
      id: 'scaling_phase',
      titre: 'Phase de détartrage',
      description: 'Détartrage complet maxillaire et mandibulaire',
      dureeEstimee: 14,
      type: 'surgery'
    },
    {
      id: 'reevaluation_presurg',
      titre: 'Réévaluation pré-chirurgicale',
      description: 'Évaluation à 6-8 semaines, planification chirurgicale',
      dureeEstimee: 56,
      type: 'consultation'
    },
    {
      id: 'periodontal_surgery',
      titre: 'Chirurgie parodontale',
      description: 'Chirurgie d\'accès, régénération tissulaire guidée',
      dureeEstimee: 70,
      type: 'surgery',
      actions: ['chirurgie_acces', 'regeneration_osseuse', 'membrane_gtg']
    },
    {
      id: 'postop_reevaluation',
      titre: 'Réévaluation post-chirurgicale',
      description: 'Contrôle à 2 mois, évaluation de la cicatrisation',
      dureeEstimee: 130,
      type: 'consultation'
    },
    {
      id: 'maintenance_program',
      titre: 'Maintenance parodontale',
      description: 'Programme de maintenance personnalisé',
      dureeEstimee: 150,
      type: 'consultation'
    }
  ],
  metadata: {
    complexity: 'complex',
    specialization: ['parodontologie', 'chirurgie_parodontale'],
    costRange: [1500, 3000]
  }
}

// Scénariotype 4: Peri-implantitis Treatment
export const periImplantitisScenario: ScenarioTemplate = {
  id: 'periimplantitis_treatment',
  nom: 'periimplantitis_treatment',
  titre: 'Traitement de la péri-implantite',
  description: 'Protocole de traitement de l\'inflammation péri-implantaire',
  dureeEstimeeTotal: 120,
  steps: [
    {
      id: 'implant_assessment',
      titre: 'Bilan implantaire/parodontal',
      description: 'Évaluation clinique et radiographique des implants',
      dureeEstimee: 0,
      type: 'consultation',
      actions: ['sondage_perimplantaire', 'radiographie_implants']
    },
    {
      id: 'scaling_implants',
      titre: 'Détartrage péri-implantaire',
      description: 'Nettoyage non-chirurgical des surfaces implantaires',
      dureeEstimee: 7,
      type: 'surgery',
      actions: ['detartrage_implants', 'irrigation_antiseptique']
    },
    {
      id: 'healing_period',
      titre: 'Période d\'attente',
      description: 'Cicatrisation de 6-8 semaines',
      dureeEstimee: 56,
      type: 'waiting'
    },
    {
      id: 'debridement_surgery',
      titre: 'Chirurgie de débridement',
      description: 'Débridement chirurgical des surfaces implantaires',
      dureeEstimee: 70,
      type: 'surgery',
      actions: ['lambeau_acces', 'debridement_implant', 'decontamination']
    },
    {
      id: 'reevaluation_2m',
      titre: 'Réévaluation à 2 mois',
      description: 'Contrôle de la cicatrisation et de l\'inflammation',
      dureeEstimee: 130,
      type: 'consultation'
    },
    {
      id: 'maintenance_quarterly',
      titre: 'Maintenance trimestrielle',
      description: 'Suivi personnalisé souvent trimestriel',
      dureeEstimee: 220,
      type: 'consultation'
    }
  ],
  metadata: {
    complexity: 'complex',
    specialization: ['implantologie', 'parodontologie'],
    costRange: [1200, 2500]
  }
}

// Scénariotype 5: Standard Implant Placement
export const standardImplantScenario: ScenarioTemplate = {
  id: 'standard_implant',
  nom: 'standard_implant',
  titre: 'Pose d\'implant standard',
  description: 'Protocole complet de réhabilitation implantaire',
  dureeEstimeeTotal: 180,
  steps: [
    {
      id: 'consultation_assessment',
      titre: 'Consultation + bilan parodontal',
      description: 'Évaluation initiale et planification implantaire',
      dureeEstimee: 0,
      type: 'consultation',
      actions: ['evaluation_osseuse', 'planification_implant']
    },
    {
      id: 'periodontal_conditioning',
      titre: 'Conditionnement parodontal',
      description: 'Préparation parodontale si nécessaire',
      dureeEstimee: 42,
      type: 'surgery',
      isOptional: true,
      preconditions: ['inflammation_parodontale']
    },
    {
      id: 'tooth_extraction',
      titre: 'Extraction dentaire',
      description: 'Extraction de la dent à remplacer',
      dureeEstimee: 84,
      type: 'surgery',
      isOptional: true,
      preconditions: ['dent_a_extraire']
    },
    {
      id: 'cbct_scan',
      titre: 'CBCT/Scan 3D',
      description: 'Imagerie 3D pour planification précise',
      dureeEstimee: 90,
      type: 'consultation',
      branches: [
        {
          id: 'bone_regeneration',
          condition: 'insufficient_bone',
          titre: 'Régénération osseuse',
          nextStepId: 'bone_regeneration_step'
        },
        {
          id: 'tissue_augmentation',
          condition: 'insufficient_tissue',
          titre: 'Augmentation tissulaire',
          nextStepId: 'tissue_augmentation_step'
        },
        {
          id: 'immediate_implant',
          condition: 'adequate_bone_tissue',
          titre: 'Implant immédiat',
          nextStepId: 'implant_placement'
        }
      ]
    },
    {
      id: 'bone_regeneration_step',
      titre: 'Régénération osseuse',
      description: 'Greffe osseuse avec attente de 6 mois',
      dureeEstimee: 270,
      type: 'surgery',
      actions: ['greffe_osseuse', 'membrane_protection']
    },
    {
      id: 'tissue_augmentation_step',
      titre: 'Augmentation tissulaire',
      description: 'Greffe de tissu conjonctif',
      dureeEstimee: 132,
      type: 'surgery',
      actions: ['greffe_conjonctive']
    },
    {
      id: 'implant_placement',
      titre: 'Pose d\'implant',
      description: 'Chirurgie de pose implantaire',
      dureeEstimee: 90,
      type: 'surgery',
      actions: ['forage_implantaire', 'pose_implant', 'vis_cicatrisation']
    },
    {
      id: 'osseointegration',
      titre: 'Cicatrisation (3 mois)',
      description: 'Période d\'ostéointégration',
      dureeEstimee: 180,
      type: 'waiting'
    },
    {
      id: 'osseointegration_control',
      titre: 'Contrôle d\'ostéointégration',
      description: 'Vérification de l\'intégration implantaire',
      dureeEstimee: 180,
      type: 'consultation',
      actions: ['test_stabilite', 'radiographie_controle']
    },
    {
      id: 'supra_implant_prosthetics',
      titre: 'Prothèse supra-implantaire',
      description: 'Réalisation de la prothèse définitive',
      dureeEstimee: 200,
      type: 'consultation',
      actions: ['empreinte_implant', 'essayage_prothese', 'pose_prothese']
    }
  ],
  metadata: {
    complexity: 'complex',
    specialization: ['implantologie', 'chirurgie_orale', 'prothese'],
    costRange: [2000, 4000]
  }
}

// Collection of all scenario templates
export const CLINICAL_SCENARIOS: Record<string, ScenarioTemplate> = {
  wisdom_extraction: wisdomToothExtractionScenario,
  periodontal_nonsurgical: nonSurgicalPeriodontalScenario,
  periodontal_surgical: surgicalPeriodontalScenario,
  periimplantitis_treatment: periImplantitisScenario,
  standard_implant: standardImplantScenario,
}

// Helper functions
export function getScenarioTemplate(scenarioId: string): ScenarioTemplate | null {
  return CLINICAL_SCENARIOS[scenarioId] || null
}

export function getAllScenarioTemplates(): ScenarioTemplate[] {
  return Object.values(CLINICAL_SCENARIOS)
}

export function getScenarioStep(scenarioId: string, stepId: string): ScenarioStep | null {
  const scenario = getScenarioTemplate(scenarioId)
  if (!scenario) return null
  return scenario.steps.find(step => step.id === stepId) || null
}

export function getNextSteps(scenarioId: string, currentStepId: string): ScenarioStep[] {
  const scenario = getScenarioTemplate(scenarioId)
  if (!scenario) return []
  
  const currentStepIndex = scenario.steps.findIndex(step => step.id === currentStepId)
  if (currentStepIndex === -1 || currentStepIndex === scenario.steps.length - 1) return []
  
  return [scenario.steps[currentStepIndex + 1]]
}

export function calculateTotalDuration(scenarioId: string, selectedBranches?: string[]): number {
  const scenario = getScenarioTemplate(scenarioId)
  if (!scenario) return 0
  
  // Simple calculation - can be enhanced with branch logic
  return scenario.dureeEstimeeTotal
}