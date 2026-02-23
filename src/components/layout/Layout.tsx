import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout() {
  const { profile } = useAuth();
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <div className="lg:ml-64">
        <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Hos geldiniz, {profile?.full_name}</h2>
          <button className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
          </button>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
