import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, UserCog } from 'lucide-react';

export default function AdminExperts() {
  const [experts, setExperts] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('experts').select('*, profile:profiles(*)');
      if (data) setExperts(data);
    };
    fetch();
  }, []);

  const filtered = experts.filter(e => e.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) || e.branch?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Uzmanlar</h1>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Uzman Ekle</button>
      </div>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="Uzman ara..." />
      </div>
      <div className="grid gap-4">
        {filtered.length === 0 && <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center text-gray-400"><UserCog size={40} className="mx-auto mb-3 opacity-50" /><p>Henuz uzman kaydedilmemis</p><p className="text-sm mt-1">Kullanicilar sayfasindan uzman rolu ile kullanici olusturun</p></div>}
        {filtered.map(e => (
          <div key={e.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center"><UserCog className="text-purple-400" /></div>
              <div>
                <h3 className="font-semibold">{e.profile?.full_name}</h3>
                <p className="text-sm text-gray-400">{e.branch} - {e.title || 'Baslik yok'}</p>
              </div>
            </div>
            <span className={"px-3 py-1 rounded-full text-xs " + (e.is_available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400')}>{e.is_available ? 'Musait' : 'Mesgul'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
