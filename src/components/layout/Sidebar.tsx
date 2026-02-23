import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Building2, UserCog, Users, ClipboardList, GraduationCap, MessageSquare, Settings, Calendar, BarChart3, AlertTriangle, Utensils, LogOut } from 'lucide-react';

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
  const pathname = location.pathname;

  // Determine links based on URL path (primary) or profile role (fallback)
  const getLinks = () => {
    if (pathname.startsWith('/admin')) return adminLinks;
    if (pathname.startsWith('/manager')) return managerLinks;
    if (pathname.startsWith('/expert')) return expertLinks;
    if (pathname.startsWith('/employee')) return employeeLinks;
    // fallback to profile role
    const role = profile?.role;
    if (role === 'admin') return adminLinks;
    if (role === 'manager') return managerLinks;
    if (role === 'expert') return expertLinks;
    return employeeLinks;
  };

  const links = getLinks();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col z-50 ">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">
          <span className="text-white">Synapse</span>
          <span className="text-emerald-400">Lynk</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Kurumsal Calisan Refahi</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.to || (link.to !== '/' && link.to !== '/admin' && link.to !== '/manager' && link.to !== '/employee' && link.to !== '/expert' && pathname.startsWith(link.to));
          return (
            <Link
              key={link.to}
              to={link.to}
              className={"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors " + (isActive ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white')}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || 'Kullanici'}</p>
            <p className="text-xs text-gray-400 truncate">{profile?.role || ''}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <LogOut size={16} />
          Cikis Yap
        </button>
      </div>
    </aside>
  );
}
