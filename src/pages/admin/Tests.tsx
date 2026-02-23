import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, ClipboardList, X } from 'lucide-react';

export default function AdminTests() {
  const { profile } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', duration_minutes: 30, passing_score: 70 });
  const [saving, setSaving] = useState(false);

  const fetchTests = async () => {
    const { data } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
    if (data) setTests(data);
  };

  useEffect(() => { fetchTests(); }, []);

  const handleAdd = async () => {
    setSaving(true);
    await supabase.from('tests').insert({ title: form.title, description: form.description, duration_minutes: form.duration_minutes, passing_score: form.passing_score, created_by: profile?.id, is_active: true });
    setShowModal(false); setForm({ title: '', description: '', duration_minutes: 30, passing_score: 70 });
    fetchTests(); setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testler</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Test Olustur</button>
      </div>
      <div className="grid gap-4">
        {tests.length === 0 && <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center text-gray-400"><ClipboardList size={40} className="mx-auto mb-3 opacity-50" /><p>Henuz test olusturulmamis</p></div>}
        {tests.map(t => (
          <div key={t.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between">
              <div><h3 className="font-semibold">{t.title}</h3><p className="text-sm text-gray-400 mt-1">{t.description || 'Aciklama yok'}</p></div>
              <div className="text-right"><span className="text-sm text-gray-400">{t.duration_minutes} dk</span><br/><span className={"px-3 py-1 rounded-full text-xs " + (t.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400')}>{t.is_active ? 'Aktif' : 'Pasif'}</span></div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Yeni Test Olustur</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Test Adi" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
              <textarea placeholder="Aciklama" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" rows={3} />
              <input type="number" placeholder="Sure (dk)" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: Number(e.target.value)})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
              <input type="number" placeholder="Gecme Puani" value={form.passing_score} onChange={e => setForm({...form, passing_score: Number(e.target.value)})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
            </div>
            <button onClick={handleAdd} disabled={saving} className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg disabled:opacity-50">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
