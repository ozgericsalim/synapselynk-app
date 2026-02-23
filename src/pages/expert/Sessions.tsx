import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar } from 'lucide-react';

export default function ExpertSessions() {
  const { profile } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!profile) return;
      const { data: expert } = await supabase.from('experts').select('id').eq('profile_id', profile.id).single();
      if (expert) {
        const { data } = await supabase.from('sessions').select('*, client:profiles!sessions_client_id_fkey(full_name, email)').eq('expert_id', expert.id).order('session_date', { ascending: false });
        if (data) setSessions(data);
      }
      setLoading(false);
    };
    fetch();
  }, [profile]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Seanslarim</h1>
      <div className="grid gap-4">
        {sessions.length === 0 && (
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-50" />
            <p>Henuz seans bulunmuyor</p>
            <p className="text-sm mt-1">Seanslar admin tarafindan atandiginda burada gorunecektir</p>
          </div>
        )}
        {sessions.map(s => (
          <div key={s.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{s.client?.full_name || 'Danisan'}</h3>
                <p className="text-sm text-gray-400 mt-1">{s.session_date ? new Date(s.session_date).toLocaleDateString('tr-TR') : 'Tarih belirtilmemis'} - {s.session_type || 'Genel'}</p>
                {s.notes && <p className="text-sm text-gray-500 mt-1">{s.notes}</p>}
              </div>
              <span className={"px-3 py-1 rounded-full text-xs " + (s.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : s.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400')}>
                {s.status === 'completed' ? 'Tamamlandi' : s.status === 'cancelled' ? 'Iptal' : 'Planli'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
