import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TaskManager from './pages/TaskManager'
import TaskKanban from './pages/TaskKanban'
import FocusTime from './pages/FocusTime'
import FinancialManagement from './pages/FinancialManagement'
import InventoryManagement from './pages/InventoryManagement'
import Login from './pages/Login'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<TaskManager />} />
            <Route path="kanban" element={<TaskKanban />} />
            <Route path="focus" element={<FocusTime />} />
            <Route path="finances" element={<FinancialManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
