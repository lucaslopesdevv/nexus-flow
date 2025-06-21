import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
  LayoutGrid, 
  Clock, 
  Package, 
  Wallet,
  Search,
  Sun,
  Moon,
  User,
  Boxes,
  ListTodo
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useTheme } from './theme-provider'
import { useSearchStore } from '../store/useSearchStore'
import { useTaskStore } from '../store/useTaskStore'
import { useInventoryStore } from '../store/useInventoryStore'
import { useFinanceStore } from '../store/useFinanceStore'
import NotificationCenter from './NotificationCenter'
import { useEffect } from 'react'
import { FocusTimer } from './FocusTimer'

export default function Layout() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const { setSearchQuery: setTaskSearch } = useTaskStore()
  const { setSearchQuery: setInventorySearch } = useInventoryStore()
  const { setSearchQuery: setFinanceSearch } = useFinanceStore()
  const { searchQuery, setSearchQuery } = useSearchStore()

  useEffect(() => {
    // Request notification permission when the app loads
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  }, [])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    const path = location.pathname
    
    // Route the search to the appropriate store based on the current page
    if (path.includes('/tasks') || path.includes('/kanban')) {
      setTaskSearch(value)
    } else if (path.includes('/inventory')) {
      setInventorySearch(value)
    } else if (path.includes('/finance')) {
      setFinanceSearch(value)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NotificationCenter />
      <FocusTimer />
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 w-60 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative transition-transform duration-300 group-hover:scale-110">
              <Boxes className="h-7 w-7 text-primary rotate-180" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              NexusFlow
            </span>
          </Link>
        </div>
        <nav className="space-y-1 p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/tasks"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ListTodo className="h-5 w-5" />
            <span className="font-medium">Tasks</span>
          </Link>
          <Link
            to="/focus"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Clock className="h-5 w-5" />
            <span className="font-medium">Focus Time</span>
          </Link>
          <Link
            to="/inventory"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Package className="h-5 w-5" />
            <span className="font-medium">Inventory</span>
          </Link>
          <Link
            to="/finance"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Wallet className="h-5 w-5" />
            <span className="font-medium">Finance</span>
          </Link>
        </nav>
      </aside>

      {/* Header */}
      <header className="fixed top-0 left-60 right-0 z-10 h-16 border-b bg-background">
        <div className="flex h-full items-center px-6">
          <div className="relative w-[480px]">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="h-9 w-full pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <NotificationCenter />
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pl-60 pt-16">
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
} 