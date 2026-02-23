import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Building2 } from 'lucide-react';

export default function Companies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', sector: '', email: '', phone: '', address: '', max_employees: 50 });
  const [search, setSearch] = useState('');

  const fetchCompanies = async () => {
    const { data } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (data) setCompanies(data);
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('companies').insert([form]);
    setShowModal(false);
    setForm({ name: '', sector: '', email: '', phone: '', address: '', max_employees: 50 });
    fetchCompanies();
  };

  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kurumlar</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={18} /> Kurum Ekle
        </button>
      </div>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="Kurum ara..." />
      </div>
      <div className="grid gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Building2 className="text-emerald-400" /></div>
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-400">{c.sector || 'Sektor belirtilmemis'}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs ${c.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{c.is_active ? 'Aktif' : 'Pasif'}</span>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Yeni Kurum</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white" placeholder="Kurum Adi" required />
              <input value={form.sector} onChange={e => setForm({...form, sector: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white" placeholder="Sektor" />
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white" placeholder="E-posta" />
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white" placeholder="Telefon" />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 text-white py-2.5 rounded-lg">Iptal</button>
                <button type="submit" className="flex-1 bg-emerald-500 text-white py-2.5 rounded-lg">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
