import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Companies from './pages/admin/Companies';
import ManagerDashboard from './pages/manager/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';
import ExpertDashboard from './pages/expert/Dashboard';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && profile && !roles.includes(profile.role)) return <Navigate to="/" />;
  return <>{children}</>;
}

function RoleRedirect() {
  const { profile, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full"></div></div>;
  if (!profile) return <Navigate to="/login" />;
  switch (profile.role) {
    case 'admin': return <Navigate to="/admin" />;
    case 'manager': return <Navigate to="/manager" />;
    case 'expert': return <Navigate to="/expert" />;
    default: return <Navigate to="/employee" />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Layout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="companies" element={<Companies />} />
          </Route>
          <Route path="/manager" element={<ProtectedRoute roles={['manager']}><Layout /></ProtectedRoute>}>
            <Route index element={<ManagerDashboard />} />
          </Route>
          <Route path="/employee" element={<ProtectedRoute roles={['employee']}><Layout /></ProtectedRoute>}>
            <Route index element={<EmployeeDashboard />} />
          </Route>
          <Route path="/expert" element={<ProtectedRoute roles={['expert']}><Layout /></ProtectedRoute>}>
            <Route index element={<ExpertDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
