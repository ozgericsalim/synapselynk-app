import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Building2, Users, UserCog, ClipboardList } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ companies: 0, employees: 0, experts: 0, tests: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [c, e, ex, t] = await Promise.all([
        supabase.from('companies').select('id', { count: 'exact', head: true }),
        supabase.from('employees').select('id', { count: 'exact', head: true }),
        supabase.from('experts').select('id', { count: 'exact', head: true }),
        supabase.from('tests').select('id', { count: 'exact', head: true }),
      ]);
      setStats({ companies: c.count || 0, employees: e.count || 0, experts: ex.count || 0, tests: t.count || 0 });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Kurumlar', value: stats.companies, icon: Building2, color: 'emerald' },
    { label: 'Calisanlar', value: stats.employees, icon: Users, color: 'blue' },
    { label: 'Uzmanlar', value: stats.experts, icon: UserCog, color: 'purple' },
    { label: 'Testler', value: stats.tests, icon: ClipboardList, color: 'amber' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{label}</span>
              <Icon size={20} className={`text-${color}-400`} />
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Hizli Islemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a href="/admin/companies" className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 transition-colors">
            <Building2 size={24} className="text-emerald-400 mb-2" />
            <p className="font-medium">Kurum Ekle</p>
            <p className="text-sm text-gray-400">Yeni anlasmali kurum olustur</p>
          </a>
          <a href="/admin/experts" className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 transition-colors">
            <UserCog size={24} className="text-purple-400 mb-2" />
            <p className="font-medium">Uzman Ekle</p>
            <p className="text-sm text-gray-400">Yeni uzman kaydi olustur</p>
          </a>
          <a href="/admin/tests" className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 transition-colors">
            <ClipboardList size={24} className="text-amber-400 mb-2" />
            <p className="font-medium">Test Olustur</p>
            <p className="text-sm text-gray-400">Yeni test ve sorular ekle</p>
          </a>
        </div>
      </div>
    </div>
  );
}
