import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Shield, UserCog, Users as UsersIcon, Briefcase } from 'lucide-react';

const roleLabels: Record<string, string> = { admin: 'Admin', manager: 'Yonetici', employee: 'Calisan', expert: 'Uzman' };
const roleColors: Record<string, string> = { admin: 'text-red-400 bg-red-500/20', manager: 'text-blue-400 bg-blue-500/20', employee: 'text-emerald-400 bg-emerald-500/20', expert: 'text-purple-400 bg-purple-500/20' };
const roleIcons: Record<string, any> = { admin: Shield, manager: Briefcase, employee: UsersIcon, expert: UserCog };

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'employee' });
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, role: form.role } }
    });
    if (error) { setMsg(error.message); return; }
    setShowModal(false);
    setForm({ email: '', password: '', full_name: '', role: 'employee' });
    setTimeout(fetchUsers, 2000);
  };

  const filtered = users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kullanicilar</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={18} /> Kullanici Ekle
        </button>
      </div>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" placeholder="Kullanici ara..." />
      </div>
      <div className="grid gap-3">
        {filtered.map(u => {
          const Icon = roleIcons[u.role] || UsersIcon;
          return (
            <div key={u.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-emerald-400 font-bold">{u.full_name?.charAt(0) || '?'}</div>
                <div>
                  <p className="font-medium">{u.full_name}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>
                </div>
              </div>
              <span className={"px-3 py-1 rounded-full text-xs flex items-center gap-1 " + (roleColors[u.role] || '')}>
                <Icon size={14} /> {roleLabels[u.role] || u.role}
              </span>
            </div>
          );
        })}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Yeni Kullanici</h2>
            {msg && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-3 text-sm">{msg}</div>}
            <form onSubmit={handleCreate} className="space-y-3">
              <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white" placeholder="Ad Soyad" required />
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white" placeholder="E-posta" required />
              <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} type="password" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white" placeholder="Sifre (min 6 karakter)" required />
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white">
                <option value="employee">Calisan</option>
                <option value="manager">Yonetici</option>
                <option value="expert">Uzman</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 text-white py-2.5 rounded-lg">Iptal</button>
                <button type="submit" className="flex-1 bg-emerald-500 text-white py-2.5 rounded-lg">Olustur</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
