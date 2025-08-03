import { useState, useEffect, useRef } from 'react'
import { usePatients } from '@/hooks/usePatients'
import { useCorrespondants } from '@/hooks/useCorrespondants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Plus, 
  Check, 
  Clock, 
  AlertCircle,
  Users,
  UserCheck,
  Stethoscope,
  Trash2,
  Calendar,
  CheckCircle2,
  Search
} from 'lucide-react'

interface TodoItem {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  dueDate?: string
  linkedTo?: {
    type: 'patient' | 'correspondant' | 'staff'
    id: string
    name: string
  }
  createdAt: Date
  completedAt?: Date
}

const priorityConfig = {
  low: {
    label: 'Faible',
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-gray-200'
  },
  medium: {
    label: 'Moyenne',
    color: 'bg-yellow-100 text-yellow-800',
    borderColor: 'border-yellow-200'
  },
  high: {
    label: 'Haute',
    color: 'bg-red-100 text-red-800',
    borderColor: 'border-red-200'
  }
}

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-gray-100 text-gray-800',
    icon: Clock
  },
  in_progress: {
    label: 'En cours',
    color: 'bg-blue-100 text-blue-800',
    icon: AlertCircle
  },
  completed: {
    label: 'Terminé',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle2
  }
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [dueDate, setDueDate] = useState('')
  const [linkedType, setLinkedType] = useState<'patient' | 'correspondant' | 'staff' | ''>('')
  const [linkedId, setLinkedId] = useState('')

  // Ref pour auto-focus sur le champ titre
  const titleInputRef = useRef<HTMLInputElement>(null)

  const { data: patientsData } = usePatients({ limit: 100 })
  const { data: correspondantsData } = useCorrespondants({ limit: 100 })

  const patients = patientsData?.data || []
  const correspondants = correspondantsData?.data || []

  // Load saved todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('paroflow-todos')
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined
      }))
      setTodos(parsedTodos)
    }
  }, [])

  // Save to localStorage whenever todos changes
  useEffect(() => {
    localStorage.setItem('paroflow-todos', JSON.stringify(todos))
  }, [todos])

  // Auto-focus sur le champ titre quand le formulaire s'ouvre
  useEffect(() => {
    if (showForm && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [showForm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    let linkedTo = undefined
    if (linkedType && linkedId) {
      let name = ''
      if (linkedType === 'patient') {
        const patient = patients.find(p => p.id === linkedId)
        name = patient ? `${patient.prenom} ${patient.nom}` : ''
      } else if (linkedType === 'correspondant') {
        const correspondant = correspondants.find(c => c.id === linkedId)
        name = correspondant ? `${correspondant.prenom} ${correspondant.nom}` : ''
      } else if (linkedType === 'staff') {
        name = linkedId // For staff, we use the name directly
      }
      
      if (name) {
        linkedTo = { type: linkedType, id: linkedId, name }
      }
    }

    const todoData: TodoItem = {
      id: editingTodo?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: editingTodo?.status || 'pending',
      dueDate: dueDate || undefined,
      linkedTo,
      createdAt: editingTodo?.createdAt || new Date(),
      completedAt: editingTodo?.completedAt
    }

    if (editingTodo) {
      setTodos(prev => prev.map(todo => todo.id === editingTodo.id ? todoData : todo))
    } else {
      setTodos(prev => [...prev, todoData])
    }

    handleCloseForm()
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTodo(null)
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setLinkedType('')
    setLinkedId('')
  }

  const handleEdit = (todo: TodoItem) => {
    setEditingTodo(todo)
    setTitle(todo.title)
    setDescription(todo.description || '')
    setPriority(todo.priority)
    setDueDate(todo.dueDate || '')
    setLinkedType(todo.linkedTo?.type || '')
    setLinkedId(todo.linkedTo?.id || '')
    setShowForm(true)
  }

  const handleToggleStatus = (todoId: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        let newStatus: 'pending' | 'in_progress' | 'completed'
        let completedAt: Date | undefined

        if (todo.status === 'pending') {
          newStatus = 'in_progress'
        } else if (todo.status === 'in_progress') {
          newStatus = 'completed'
          completedAt = new Date()
        } else {
          newStatus = 'pending'
          completedAt = undefined
        }

        return { ...todo, status: newStatus, completedAt }
      }
      return todo
    }))
  }

  const handleDelete = (todoId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      setTodos(prev => prev.filter(todo => todo.id !== todoId))
    }
  }

  const getFilteredTodos = () => {
    return todos.filter(todo => {
      const matchesSearch = !search || 
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        todo.description?.toLowerCase().includes(search.toLowerCase()) ||
        todo.linkedTo?.name.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = !statusFilter || todo.status === statusFilter
      const matchesPriority = !priorityFilter || todo.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    }).sort((a, b) => {
      // Sort by priority first, then by creation date
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  const getStats = () => {
    return {
      total: todos.length,
      pending: todos.filter(t => t.status === 'pending').length,
      in_progress: todos.filter(t => t.status === 'in_progress').length,
      completed: todos.filter(t => t.status === 'completed').length,
      high_priority: todos.filter(t => t.priority === 'high' && t.status !== 'completed').length
    }
  }

  const stats = getStats()
  const filteredTodos = getFilteredTodos()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tâches et Rappels</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos tâches et rappels liés aux patients et à l'équipe
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouvelle tâche</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total tâches
            </CardTitle>
            <Check className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">Toutes les tâches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En attente
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">À commencer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En cours
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.in_progress}</div>
            <p className="text-xs text-gray-500 mt-1">En progression</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Terminées
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-gray-500 mt-1">Finalisées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Priorité haute
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.high_priority}</div>
            <p className="text-xs text-gray-500 mt-1">Urgent</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Recherchez et filtrez vos tâches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher une tâche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="">Toutes les priorités</option>
              {Object.entries(priorityConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Todo List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des tâches</CardTitle>
          <CardDescription>
            {filteredTodos.length} tâche{filteredTodos.length > 1 ? 's' : ''} 
            {search && ` correspondant à "${search}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTodos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tâche</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Lié à</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTodos.map((todo) => {
                  const statusInfo = statusConfig[todo.status]
                  const priorityInfo = priorityConfig[todo.priority]
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <TableRow key={todo.id} className={todo.status === 'completed' ? 'opacity-60' : ''}>
                      <TableCell>
                        <div>
                          <div className={`font-medium ${todo.status === 'completed' ? 'line-through' : ''}`}>
                            {todo.title}
                          </div>
                          {todo.description && (
                            <div className="text-sm text-gray-500 mt-1 max-w-md">
                              {todo.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityInfo.color}>
                          {priorityInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-4 w-4" />
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {todo.linkedTo ? (
                          <div className="flex items-center space-x-2">
                            {todo.linkedTo.type === 'patient' && <Users className="h-4 w-4 text-blue-500" />}
                            {todo.linkedTo.type === 'correspondant' && <UserCheck className="h-4 w-4 text-green-500" />}
                            {todo.linkedTo.type === 'staff' && <Stethoscope className="h-4 w-4 text-purple-500" />}
                            <span className="text-sm">{todo.linkedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {todo.dueDate ? (
                          <div className="text-sm">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(todo.dueDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(todo.id)}
                            title={todo.status === 'completed' ? 'Rouvrir' : 'Marquer comme suivant'}
                          >
                            {todo.status === 'completed' ? (
                              <Clock className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(todo)}
                            title="Modifier"
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(todo.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune tâche trouvée
              </h3>
              <p className="text-gray-500 mb-4">
                {search || statusFilter || priorityFilter
                  ? "Aucune tâche ne correspond aux filtres sélectionnés"
                  : "Commencez par ajouter votre première tâche"
                }
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une tâche
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Todo Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingTodo ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </CardTitle>
              <CardDescription>
                Créez ou modifiez une tâche ou un rappel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de la tâche *
                  </label>
                  <Input
                    ref={titleInputRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre de la tâche"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optionnel)
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description détaillée de la tâche"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priorité
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Échéance (optionnel)
                    </label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lier à (optionnel)
                    </label>
                    <select
                      value={linkedType}
                      onChange={(e) => {
                        setLinkedType(e.target.value as any)
                        setLinkedId('')
                      }}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="">Aucun lien</option>
                      <option value="patient">Patient</option>
                      <option value="correspondant">Correspondant</option>
                      <option value="staff">Membre de l'équipe</option>
                    </select>
                  </div>

                  {linkedType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {linkedType === 'patient' && 'Patient'}
                        {linkedType === 'correspondant' && 'Correspondant'}
                        {linkedType === 'staff' && 'Nom du staff'}
                      </label>
                      {linkedType === 'staff' ? (
                        <Input
                          value={linkedId}
                          onChange={(e) => setLinkedId(e.target.value)}
                          placeholder="Nom du membre de l'équipe"
                        />
                      ) : (
                        <select
                          value={linkedId}
                          onChange={(e) => setLinkedId(e.target.value)}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        >
                          <option value="">Sélectionner</option>
                          {linkedType === 'patient' && patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                              {patient.prenom} {patient.nom}
                            </option>
                          ))}
                          {linkedType === 'correspondant' && correspondants.map((correspondant) => (
                            <option key={correspondant.id} value={correspondant.id}>
                              {correspondant.prenom} {correspondant.nom}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseForm}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingTodo ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}