import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, GraduationCap, X } from 'lucide-react';

export default function AdminTrainings() {
  const { profile } = useAuth();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', training_type: 'video', duration_minutes: 30, is_mandatory: false });
  const [saving, setSaving] = useState(false);

  const fetchTrainings = async () => {
    const { data } = await supabase.from('trainings').select('*').order('created_at', { ascending: false });
    if (data) setTrainings(data);
  };

  useEffect(() => { fetchTrainings(); }, []);

  const handleAdd = async () => {
    setSaving(true);
    await supabase.from('trainings').insert({ title: form.title, description: form.description, training_type: form.training_type, duration_minutes: form.duration_minutes, is_mandatory: form.is_mandatory, created_by: profile?.id, is_active: true });
    setShowModal(false); setForm({ title: '', description: '', training_type: 'video', duration_minutes: 30, is_mandatory: false });
    fetchTrainings(); setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Egitimler</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Egitim Ekle</button>
      </div>
      <div className="grid gap-4">
        {trainings.length === 0 && <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center text-gray-400"><GraduationCap size={40} className="mx-auto mb-3 opacity-50" /><p>Henuz egitim eklenmemis</p></div>}
        {trainings.map(t => (
          <div key={t.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between">
              <div><h3 className="font-semibold">{t.title}</h3><p className="text-sm text-gray-400 mt-1">{t.training_type} - {t.is_mandatory ? 'Zorunlu' : 'Istege bagli'}</p></div>
              <span className={"px-3 py-1 rounded-full text-xs " + (t.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400')}>{t.is_active ? 'Aktif' : 'Pasif'}</span>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Yeni Egitim Ekle</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Egitim Adi" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
              <textarea placeholder="Aciklama" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" rows={3} />
              <select value={form.training_type} onChange={e => setForm({...form, training_type: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
                <option value="video">Video</option><option value="document">Dokuman</option><option value="interactive">Interaktif</option>
              </select>
              <input type="number" placeholder="Sure (dk)" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: Number(e.target.value)})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_mandatory} onChange={e => setForm({...form, is_mandatory: e.target.checked})} /> Zorunlu Egitim</label>
            </div>
            <button onClick={handleAdd} disabled={saving} className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg disabled:opacity-50">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
