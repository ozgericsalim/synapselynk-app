import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Users, Utensils, MessageSquare } from 'lucide-react';

export default function ExpertDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ sessions: 0, clients: 0, diets: 0, messages: 0 });

  useEffect(() => {
    const fetch = async () => {
      if (!profile) return;
      try {
        const { data: expert } = await supabase.from('experts').select('id').eq('profile_id', profile.id).single();
        if (expert) {
          const { count: sc } = await supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('expert_id', expert.id);
          const { data: sd } = await supabase.from('sessions').select('client_id').eq('expert_id', expert.id);
          const uniqueClients = sd ? new Set(sd.map((s: any) => s.client_id)).size : 0;
          setStats(prev => ({ ...prev, sessions: sc || 0, clients: uniqueClients }));
        }
        const { count: mc } = await supabase.from('messages').select('*', { count: 'exact', head: true }).or('sender_id.eq.' + profile.id + ',receiver_id.eq.' + profile.id);
        setStats(prev => ({ ...prev, messages: mc || 0 }));
      } catch (e) { /* ignore */ }
    };
    fetch();
  }, [profile]);

  const cards = [
    { label: 'Bugunun Seanslari', icon: Calendar, val: String(stats.sessions), color: 'emerald' },
    { label: 'Aktif Danisanlar', icon: Users, val: String(stats.clients), color: 'blue' },
    { label: 'Diyet Planlari', icon: Utensils, val: String(stats.diets), color: 'purple' },
    { label: 'Yeni Mesajlar', icon: MessageSquare, val: String(stats.messages), color: 'amber' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Uzman Paneli</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, icon: Icon, val, color }) => (
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
        <p className="text-gray-400">Uzman paneliniz hazir. Sol menuden seanslarinizi ve danisanlarinizi yonetebilirsiniz.</p>
      </div>
    </div>
  );
}
