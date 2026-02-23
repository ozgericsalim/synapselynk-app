import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/auth/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ManagerDashboard from './pages/manager/Dashboard'
import ExpertDashboard from './pages/expert/Dashboard'
import EmployeeDashboard from './pages/employee/Dashboard'

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-900"><div className="text-primary text-xl">Yukleniyor...</div></div>
  if (!user) return <Navigate to="/login" />
  if (roles && profile && !roles.includes(profile.role)) return <Navigate to="/" />
  return <>{children}</>
}

function RoleRouter() {
  const { profile, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-900"><div className="text-primary text-xl">Yukleniyor...</div></div>
  if (!profile) return <Navigate to="/login" />
  switch (profile.role) {
    case 'admin': return <Navigate to="/admin" />
    case 'manager': return <Navigate to="/manager" />
    case 'expert': return <Navigate to="/expert" />
    case 'employee': return <Navigate to="/employee" />
    default: return <Navigate to="/login" />
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><RoleRouter /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/manager/*" element={<ProtectedRoute roles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/expert/*" element={<ProtectedRoute roles={['expert']}><ExpertDashboard /></ProtectedRoute>} />
          <Route path="/employee/*" element={<ProtectedRoute roles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
