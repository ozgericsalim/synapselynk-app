import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Users } from 'lucide-react';

export default function ExpertClients() {
  const { profile } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!profile) return;
      const { data: expert } = await supabase.from('experts').select('id').eq('profile_id', profile.id).single();
      if (expert) {
        const { data } = await supabase.from('sessions').select('client_id, client:profiles!sessions_client_id_fkey(id, full_name, email)').eq('expert_id', expert.id);
        if (data) {
          const unique = new Map();
          data.forEach((s: any) => { if (s.client) unique.set(s.client.id, s.client); });
          setClients(Array.from(unique.values()));
        }
      }
      setLoading(false);
    };
    fetch();
  }, [profile]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danisanlarim</h1>
      <div className="grid gap-4">
        {clients.length === 0 && (
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-50" />
            <p>Henuz danisan bulunmuyor</p>
            <p className="text-sm mt-1">Seans atandiginda danisanlariniz burada gorunecektir</p>
          </div>
        )}
        {clients.map(c => (
          <div key={c.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center"><Users className="text-blue-400" /></div>
            <div>
              <h3 className="font-semibold">{c.full_name}</h3>
              <p className="text-sm text-gray-400">{c.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
