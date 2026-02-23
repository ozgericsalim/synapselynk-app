import { Calendar, Users, BarChart3, AlertTriangle } from 'lucide-react';

export default function ManagerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Yonetici Paneli</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[{ label: 'Calisanlar', icon: Users, val: '0', color: 'blue' },
          { label: 'Aktif Seanslar', icon: Calendar, val: '0', color: 'emerald' },
          { label: 'Ort. Verimlilik', icon: BarChart3, val: '%0', color: 'purple' },
          { label: 'Uyarilar', icon: AlertTriangle, val: '0', color: 'amber' }].map(({ label, icon: Icon, val, color }) => (
          <div key={label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{label}</span>
              <Icon size={20} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">{val}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-2">Hos Geldiniz</h2>
        <p className="text-gray-400">Kurum yonetici paneliniz hazir. Sol menuden islemlerinizi yapabilirsiniz.</p>
      </div>
    </div>
  );
}
