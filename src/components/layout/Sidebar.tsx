import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Users, Building2, UserCog, ClipboardList, GraduationCap, MessageSquare, Bell, Settings, LogOut, Calendar, BarChart3, Utensils, AlertTriangle } from 'lucide-react';

const adminLinks = [
  { to: '/admin', icon: Home, label: 'Dashboard' },
  { to: '/admin/companies', icon: Building2, label: 'Kurumlar' },
  { to: '/admin/experts', icon: UserCog, label: 'Uzmanlar' },
  { to: '/admin/users', icon: Users, label: 'Kullanicilar' },
  { to: '/admin/tests', icon: ClipboardList, label: 'Testler' },
  { to: '/admin/trainings', icon: GraduationCap, label: 'Egitimler' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Mesajlar' },
  { to: '/admin/settings', icon: Settings, label: 'Ayarlar' },
];

const managerLinks = [
  { to: '/manager', icon: Home, label: 'Dashboard' },
  { to: '/manager/employees', icon: Users, label: 'Calisanlar' },
  { to: '/manager/departments', icon: Building2, label: 'Departmanlar' },
  { to: '/manager/productivity', icon: BarChart3, label: 'Verimlilik' },
  { to: '/manager/sessions', icon: Calendar, label: 'Seanslar' },
  { to: '/manager/alerts', icon: AlertTriangle, label: 'Uyarilar' },
  { to: '/manager/messages', icon: MessageSquare, label: 'Mesajlar' },
];

const employeeLinks = [
  { to: '/employee', icon: Home, label: 'Dashboard' },
  { to: '/employee/sessions', icon: Calendar, label: 'Seanslarim' },
  { to: '/employee/tests', icon: ClipboardList, label: 'Testler' },
  { to: '/employee/trainings', icon: GraduationCap, label: 'Egitimler' },
  { to: '/employee/diet', icon: Utensils, label: 'Diyet' },
  { to: '/employee/productivity', icon: BarChart3, label: 'Verimlilik' },
  { to: '/employee/messages', icon: MessageSquare, label: 'Mesajlar' },
];

const expertLinks = [
  { to: '/expert', icon: Home, label: 'Dashboard' },
  { to: '/expert/sessions', icon: Calendar, label: 'Seanslar' },
  { to: '/expert/clients', icon: Users, label: 'Danisanlar' },
  { to: '/expert/diet-plans', icon: Utensils, label: 'Diyet Planlari' },
  { to: '/expert/messages', icon: MessageSquare, label: 'Mesajlar' },
];

export default function Sidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const role = profile?.role;

  const links = role === 'admin' ? adminLinks : role === 'manager' ? managerLinks : role === 'expert' ? expertLinks : employeeLinks;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50 transition-transform lg:translate-x-0">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">
          <span className="text-white">Synapse</span>
          <span className="text-emerald-400">Lynk</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Kurumsal Calisan Refahi</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${location.pathname === to ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{profile?.full_name}</p>
            <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
          </div>
        </div>
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 w-full transition-colors">
          <LogOut size={18} />
          <span>Cikis Yap</span>
        </button>
      </div>
    </aside>
  );
}
