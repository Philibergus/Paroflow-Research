import { useState } from 'react';
import { Plus, Calendar, Clock, CheckCircle, Circle, Trash2, Edit, User, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TodoItem {
  id: number;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  category: 'general' | 'patient' | 'correspondant';
  linkedTo?: string;
  dueTime?: string;
}

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: 1,
      title: 'Ouvrir au livreur à 11h',
      description: 'Livraison matériel implantaire',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-07-25',
      dueTime: '11:00',
      createdAt: '2025-07-20',
      category: 'general',
    },
    {
      id: 2,
      title: 'Préparer courrier Dr Dubois',
      description: 'Implant 16 pour Mme Martin - compte-rendu',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-07-25',
      createdAt: '2025-07-22',
      category: 'correspondant',
      linkedTo: 'Dr Dubois',
    },
    {
      id: 3,
      title: 'Vérifier consentement éclairé',
      description: 'M. Leclerc - chirurgie parodontale',
      priority: 'high',
      status: 'completed',
      dueDate: '2025-07-23',
      createdAt: '2025-07-21',
      category: 'patient',
      linkedTo: 'M. Leclerc',
    },
    {
      id: 4,
      title: 'Ordonnance préopératoire',
      description: 'Mme Truc - implant 16',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-07-26',
      createdAt: '2025-07-23',
      category: 'patient',
      linkedTo: 'Mme Truc',
    },
  ]);

  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Math.max(...todos.map(t => t.id), 0) + 1,
        title: newTodo.trim(),
        priority: 'medium',
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        category: 'general',
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, status: todo.status === 'completed' ? 'pending' : 'completed' }
        : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const filterTodos = (status?: string) => {
    if (!status) return todos;
    return todos.filter(todo => todo.status === status);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'patient': return <User className="h-3 w-3" />;
      case 'correspondant': return <Stethoscope className="h-3 w-3" />;
      default: return <Circle className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-medical-text">Tâches</h1>
          <p className="text-muted-foreground">
            Gérez vos tâches quotidiennes et rappels
          </p>
        </div>
      </div>

      {/* Quick Add */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nouvelle tâche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Ajouter une nouvelle tâche..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            />
            <Button onClick={addTodo}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filterTodos('pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filterTodos('in-progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filterTodos('completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Todo List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des tâches</CardTitle>
          <CardDescription>
            Organisez et suivez vos tâches par statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="in-progress">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-2 mt-4">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    todo.status === 'completed' ? 'bg-accent/50' : 'bg-background'
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTodo(todo.id)}
                    className="p-0"
                  >
                    {todo.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </Button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3
                        className={`font-medium ${
                          todo.status === 'completed'
                            ? 'line-through text-muted-foreground'
                            : ''
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <Badge variant={getPriorityColor(todo.priority)}>
                        {todo.priority}
                      </Badge>
                    </div>
                    {todo.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      {todo.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(todo.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Créée le {new Date(todo.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-2 mt-4">
              {filterTodos('pending').map((todo) => (
                <div key={todo.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTodo(todo.id)}
                    className="p-0"
                  >
                    <Circle className="h-5 w-5" />
                  </Button>
                  <div className="flex-1">
                    <h3 className="font-medium">{todo.title}</h3>
                    {todo.description && (
                      <p className="text-sm text-muted-foreground">{todo.description}</p>
                    )}
                  </div>
                  <Badge variant={getPriorityColor(todo.priority)}>
                    {todo.priority}
                  </Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-2 mt-4">
              {filterTodos('in-progress').map((todo) => (
                <div key={todo.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTodo(todo.id)}
                    className="p-0"
                  >
                    <Circle className="h-5 w-5 text-blue-600" />
                  </Button>
                  <div className="flex-1">
                    <h3 className="font-medium">{todo.title}</h3>
                    {todo.description && (
                      <p className="text-sm text-muted-foreground">{todo.description}</p>
                    )}
                  </div>
                  <Badge variant={getPriorityColor(todo.priority)}>
                    {todo.priority}
                  </Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-2 mt-4">
              {filterTodos('completed').map((todo) => (
                <div key={todo.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-accent/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTodo(todo.id)}
                    className="p-0"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </Button>
                  <div className="flex-1">
                    <h3 className="font-medium line-through text-muted-foreground">
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-sm text-muted-foreground line-through">
                        {todo.description}
                      </p>
                    )}
                  </div>
                  <Badge variant={getPriorityColor(todo.priority)}>
                    {todo.priority}
                  </Badge>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Todo;