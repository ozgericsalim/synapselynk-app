import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Companies from './pages/admin/Companies';
import AdminUsers from './pages/admin/Users';
import AdminExperts from './pages/admin/Experts';
import AdminTests from './pages/admin/Tests';
import AdminTrainings from './pages/admin/Trainings';
import AdminSettings from './pages/admin/Settings';
import ManagerDashboard from './pages/manager/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';
import ExpertDashboard from './pages/expert/Dashboard';
import ExpertSessions from './pages/expert/Sessions';
import ExpertClients from './pages/expert/Clients';
import ExpertDietPlans from './pages/expert/DietPlans';
import Messages from './pages/shared/Messages';

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
  if (!profile) return <Navigate to="/admin" />;
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
            <Route path="users" element={<AdminUsers />} />
            <Route path="experts" element={<AdminExperts />} />
            <Route path="tests" element={<AdminTests />} />
            <Route path="trainings" element={<AdminTrainings />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="/manager" element={<ProtectedRoute roles={['manager']}><Layout /></ProtectedRoute>}>
            <Route index element={<ManagerDashboard />} />
            <Route path="messages" element={<Messages />} />
          </Route>
          <Route path="/expert" element={<ProtectedRoute roles={['expert']}><Layout /></ProtectedRoute>}>
            <Route index element={<ExpertDashboard />} />
            <Route path="sessions" element={<ExpertSessions />} />
            <Route path="clients" element={<ExpertClients />} />
            <Route path="diet-plans" element={<ExpertDietPlans />} />
            <Route path="messages" element={<Messages />} />
          </Route>
          <Route path="/employee" element={<ProtectedRoute roles={['employee']}><Layout /></ProtectedRoute>}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
