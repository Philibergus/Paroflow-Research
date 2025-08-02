import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  UserCheck, 
  Plus, 
  Search, 
  Calendar,
  FileText,
  Activity,
  CheckSquare,
  BarChart3,
  Circle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandBarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Command {
  id: string
  label: string
  description: string
  icon: React.ElementType
  action: () => void
  keywords?: string[]
}

export default function CommandBar({ open, onOpenChange }: CommandBarProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  const commands: Command[] = [
    {
      id: 'new-patient',
      label: 'Nouveau patient',
      description: 'Ajouter un nouveau patient au système',
      icon: Plus,
      action: () => {
        navigate('/patients?action=new')
        onOpenChange(false)
      },
      keywords: ['nouveau', 'patient', 'ajouter', 'créer']
    },
    {
      id: 'search-patients',
      label: 'Rechercher patients',
      description: 'Voir tous les patients ou rechercher',
      icon: Users,
      action: () => {
        navigate('/patients')
        onOpenChange(false)
      },
      keywords: ['patients', 'rechercher', 'voir', 'liste']
    },
    {
      id: 'new-correspondant',
      label: 'Nouveau correspondant',
      description: 'Ajouter un correspondant médical',
      icon: Plus,
      action: () => {
        navigate('/correspondants?action=new')
        onOpenChange(false)
      },
      keywords: ['nouveau', 'correspondant', 'médecin', 'spécialiste', 'ajouter']
    },
    {
      id: 'correspondants',
      label: 'Correspondants',
      description: 'Gérer les correspondants médicaux',
      icon: UserCheck,
      action: () => {
        navigate('/correspondants')
        onOpenChange(false)
      },
      keywords: ['correspondants', 'médecins', 'spécialistes']
    },
    {
      id: 'reports',
      label: 'Rapports et traitements',
      description: 'Voir les rapports et gérer les traitements',
      icon: FileText,
      action: () => {
        navigate('/reports')
        onOpenChange(false)
      },
      keywords: ['rapports', 'traitements', 'statistiques', 'analytics']
    },
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      description: 'Retour au tableau de bord principal',
      icon: Activity,
      action: () => {
        navigate('/')
        onOpenChange(false)
      },
      keywords: ['dashboard', 'accueil', 'tableau', 'bord']
    },
    {
      id: 'todo',
      label: 'Tâches et Todos',
      description: 'Gérer les tâches et pense-bêtes',
      icon: CheckSquare,
      action: () => {
        navigate('/todo')
        onOpenChange(false)
      },
      keywords: ['todo', 'tâches', 'rappel', 'pense-bête', 'notes']
    },
    {
      id: 'statistics',
      label: 'Statistiques équipe',
      description: 'Tracker le temps et la productivité',
      icon: BarChart3,
      action: () => {
        navigate('/statistics')
        onOpenChange(false)
      },
      keywords: ['statistiques', 'temps', 'productivité', 'équipe', 'analytics']
    },
    {
      id: 'dental-management',
      label: 'Gestion Dentaire',
      description: 'Module dentaire complet avec schéma et timeline',
      icon: Activity,
      action: () => {
        navigate('/dental')
        onOpenChange(false)
      },
      keywords: ['dentaire', 'dents', 'schéma', 'timeline', 'traitements', 'parodontie', 'implanto']
    }
  ]

  const filteredCommands = commands.filter(command => {
    const searchTerm = search.toLowerCase()
    return (
      command.label.toLowerCase().includes(searchTerm) ||
      command.description.toLowerCase().includes(searchTerm) ||
      command.keywords?.some(keyword => keyword.includes(searchTerm))
    )
  })

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    if (!open) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
      }
    }
  }

  const parseNaturalLanguage = (input: string) => {
    const lower = input.toLowerCase()
    
    // Patient creation patterns
    if (lower.match(/(nouveau|créer|ajouter).*(patient)/)) {
      return commands.find(c => c.id === 'new-patient')
    }
    
    // Correspondant patterns
    if (lower.match(/(nouveau|créer|ajouter).*(correspondant|médecin|spécialiste)/)) {
      return commands.find(c => c.id === 'new-correspondant')
    }
    
    // Search patterns
    if (lower.match(/(chercher|rechercher|trouver).*(patient)/)) {
      return commands.find(c => c.id === 'search-patients')
    }
    
    // Reports patterns
    if (lower.match(/(rapport|traitement|statistique)/)) {
      return commands.find(c => c.id === 'reports')
    }
    
    // Medical workflow patterns - Ce que vous vouliez !
    if (lower.match(/(implant|pose|chirurgie|extraction|détartrage|soin).*(posé|fait|terminé|fini)/)) {
      // Retourne une action spéciale pour traitement terminé
      return {
        id: 'treatment-completed',
        label: 'Traitement terminé',
        description: 'Enregistrer un traitement comme terminé et déclencher les actions automatiques',
        icon: Activity,
        action: () => {
          // Ici on pourrait ouvrir un modal pour saisir les détails
          alert('Fonctionnalité en développement : Workflow automatique post-traitement')
          onOpenChange(false)
        }
      }
    }
    
    // Todo/reminder patterns
    if (lower.match(/(todo|tâche|rappel|note|pense.?bête)/)) {
      return commands.find(c => c.id === 'todo')
    }
    
    // Statistics patterns
    if (lower.match(/(temps|statistique|productivité|équipe)/)) {
      return commands.find(c => c.id === 'statistics')
    }
    
    return null
  }

  const intelligentCommand = parseNaturalLanguage(search)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-left">Actions rapides</DialogTitle>
        </DialogHeader>
        
        <div className="px-4">
          <Input
            placeholder="Tapez une commande ou décrivez ce que vous voulez faire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 text-base"
            autoFocus
          />
        </div>

        <div className="max-h-96 overflow-y-auto border-t">
          {/* Intelligent suggestion */}
          {intelligentCommand && search.length > 3 && (
            <div className="p-2 bg-blue-50 border-b">
              <div className="text-xs text-blue-600 font-medium mb-1">
                Suggestion intelligente:
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start p-2 h-auto"
                onClick={intelligentCommand.action}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-md bg-blue-100">
                    <intelligentCommand.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-blue-900">
                      {intelligentCommand.label}
                    </div>
                    <div className="text-sm text-blue-600">
                      {intelligentCommand.description}
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          )}

          {/* Regular commands */}
          <div className="p-2 space-y-1">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((command, index) => {
                const Icon = command.icon
                return (
                  <Button
                    key={command.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start p-3 h-auto",
                      index === selectedIndex && "bg-accent"
                    )}
                    onClick={command.action}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{command.label}</div>
                        <div className="text-sm text-gray-500">
                          {command.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                )
              })
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune commande trouvée</p>
                <p className="text-sm">Essayez "nouveau patient" ou "rechercher"</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 border-t bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Utilisez ↑↓ pour naviguer, Entrée pour sélectionner</span>
            <span>ESC pour fermer</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}