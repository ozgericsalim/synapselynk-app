import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, UserCog, X } from 'lucide-react';

export default function AdminExperts() {
  const [experts, setExperts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [form, setForm] = useState({ branch: '', title: '', bio: '', session_fee: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchExperts = async () => {
    const { data } = await supabase.from('experts').select('*, profile:profiles(*)');
    if (data) setExperts(data);
  };

  const fetchUsers = async () => {
    const { data: allProfiles } = await supabase.from('profiles').select('id, full_name, email, role');
    const { data: existingExperts } = await supabase.from('experts').select('profile_id');
    const expertIds = new Set((existingExperts || []).map((e: any) => e.profile_id));
    if (allProfiles) setUsers(allProfiles.filter((p: any) => !expertIds.has(p.id) && p.role !== 'admin'));
  };

  useEffect(() => { fetchExperts(); }, []);

  const openModal = () => {
    fetchUsers();
    setShowModal(true);
    setError('');
  };

  const handleAdd = async () => {
    if (!selectedUser || !form.branch) { setError('Kullanici ve brans secimi zorunlu'); return; }
    setSaving(true); setError('');
    try {
      const { error: updateErr } = await supabase.from('profiles').update({ role: 'expert' }).eq('id', selectedUser);
      if (updateErr) throw updateErr;
      const { error: insertErr } = await supabase.from('experts').insert({ profile_id: selectedUser, branch: form.branch, title: form.title, bio: form.bio, session_fee: form.session_fee });
      if (insertErr) throw insertErr;
      setShowModal(false); setSelectedUser(''); setForm({ branch: '', title: '', bio: '', session_fee: 0 });
      fetchExperts();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  const filtered = experts.filter(e => e.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) || e.branch?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Uzmanlar</h1>
        <button onClick={openModal} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Uzman Ekle</button>
      </div>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="Uzman ara..." />
      </div>
      <div className="grid gap-4">
        {filtered.length === 0 && <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center text-gray-400"><UserCog size={40} className="mx-auto mb-3 opacity-50" /><p>Henuz uzman kaydedilmemis</p><p className="text-sm mt-1">Kullanicilar sayfasindan kullanici olusturup uzman olarak atayabilirsiniz</p></div>}
        {filtered.map(e => (
          <div key={e.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center"><UserCog className="text-purple-400" /></div>
              <div><h3 className="font-semibold">{e.profile?.full_name}</h3><p className="text-sm text-gray-400">{e.branch} - {e.title || 'Baslik yok'}</p></div>
            </div>
            <span className={"px-3 py-1 rounded-full text-xs " + (e.is_available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400')}>{e.is_available ? 'Musait' : 'Mesgul'}</span>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Yeni Uzman Ekle</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            {error && <div className="bg-red-500/20 text-red-400 p-2 rounded mb-3 text-sm">{error}</div>}
            <div className="space-y-3">
              <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
                <option value="">Kullanici Secin...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
              </select>
              <input placeholder="Brans (orn: Psikoloji)" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
              <input placeholder="Unvan" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
              <textarea placeholder="Biyografi" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" rows={3} />
              <input type="number" placeholder="Seans Ucreti" value={form.session_fee} onChange={e => setForm({...form, session_fee: Number(e.target.value)})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
            </div>
            <button onClick={handleAdd} disabled={saving} className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg disabled:opacity-50">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
