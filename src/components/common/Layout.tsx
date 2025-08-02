import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Users, 
  UserCheck, 
  FileText, 
  LayoutDashboard, 
  Menu,
  Search,
  Bell,
  CheckSquare,
  BarChart3,
  Calendar,
  Heart,
  Package,
  Command
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import CommandBar from './CommandBar'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Gestion Dentaire', href: '/dental', icon: Heart },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Implants', href: '/implants', icon: Package },
  { name: 'Rendez-vous', href: '/rendez-vous', icon: Calendar },
  { name: 'Correspondants', href: '/correspondants', icon: UserCheck },
  { name: 'Tâches', href: '/todo', icon: CheckSquare },
  { name: 'Rapports', href: '/reports', icon: FileText },
  { name: 'Statistiques', href: '/statistics', icon: BarChart3 },
]

const settingsNavigation = [
  { name: 'Paramètres', href: '/settings', icon: Command },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [showCommandBar, setShowCommandBar] = useState(false)

  // Raccourci clavier global Ctrl+K pour ouvrir la recherche
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowCommandBar(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Paroflow</h1>
        </div>
        
        <nav className="mt-6 flex-1 flex flex-col">
          <div className="space-y-1 px-3">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
          
          {/* Settings section at bottom */}
          <div className="mt-auto px-3 pb-20">
            <div className="border-t pt-4">
              {settingsNavigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="text-xs text-gray-500">
            <p className="font-medium">Cabinet Dentaire</p>
            <p>Système de gestion v1.0</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="w-80 justify-start text-muted-foreground"
                onClick={() => setShowCommandBar(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                Rechercher un patient, traitement...
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">DR</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Dr. Martin</p>
                  <p className="text-gray-500">Dentiste</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Global Command Bar */}
      <CommandBar open={showCommandBar} onOpenChange={setShowCommandBar} />
    </div>
  )
}