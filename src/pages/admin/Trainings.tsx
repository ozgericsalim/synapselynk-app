import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, GraduationCap, X, ChevronDown, ChevronUp, Clock } from 'lucide-react';

const MODULE_GROUPS = [
  { label: 'Modül 1 — Online Terapi Teknikleri ve Etik Kurallar', days: [1,2,3,4,5,6,7,8], color: 'emerald' },
  { label: 'Modül 2 — Platform Kullanımı ve Dijital Araçlar', days: [9,10,11,12,13], color: 'blue' },
  { label: 'Modül 3 — Kriz Yönetimi ve Acil Durum Protokolleri', days: [14,15,16,17,18], color: 'red' },
  { label: 'Modül 4 — Danışan İletişimi ve Bağ Kurma Stratejileri', days: [19,20,21,22], color: 'purple' },
  { label: 'Modül 5 — Süpervizyon ve Vaka İncelemesi', days: [23,24,25,26,27], color: 'yellow' },
  { label: 'Modül 6 — Profesyonel Gelişim ve Öz-Bakım', days: [28,29,30], color: 'pink' },
];

const BORDER_COLOR: Record<string, string> = {
  emerald: 'border-emerald-500/40',
  blue: 'border-blue-500/40',
  red: 'border-red-500/40',
  purple: 'border-purple-500/40',
  yellow: 'border-yellow-500/40',
  pink: 'border-pink-500/40',
};

const TEXT_COLOR: Record<string, string> = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
  yellow: 'text-yellow-400',
  pink: 'text-pink-400',
};

const BG_COLOR: Record<string, string> = {
  emerald: 'bg-emerald-500/5',
  blue: 'bg-blue-500/5',
  red: 'bg-red-500/5',
  purple: 'bg-purple-500/5',
  yellow: 'bg-yellow-500/5',
  pink: 'bg-pink-500/5',
};

export default function AdminTrainings() {
  const { profile } = useAuth();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [form, setForm] = useState({ title: '', description: '', module_name: '', total_duration_seconds: 3600, is_published: true });
  const [saving, setSaving] = useState(false);

  const fetchTrainings = async () => {
    const { data } = await supabase.from('trainings').select('*').order('title', { ascending: true });
    if (data) setTrainings(data);
  };

  useEffect(() => { fetchTrainings(); }, []);

  const handleAdd = async () => {
    setSaving(true);
    await supabase.from('trainings').insert({
      title: form.title,
      description: form.description,
      module_name: form.module_name,
      total_duration_seconds: form.total_duration_seconds,
      is_published: form.is_published,
      created_by: profile?.id,
    });
    setShowModal(false);
    setForm({ title: '', description: '', module_name: '', total_duration_seconds: 3600, is_published: true });
    fetchTrainings();
    setSaving(false);
  };

  const toggleModule = (idx: number) => {
    setExpandedModules(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const getTrainingsForModule = (days: number[]) => {
    return trainings.filter(t => {
      const match = t.title.match(/Gün (\d+)/);
      if (!match) return false;
      return days.includes(Number(match[1]));
    }).sort((a, b) => {
      const aDay = Number(a.title.match(/Gün (\d+)/)?.[1] || 0);
      const bDay = Number(b.title.match(/Gün (\d+)/)?.[1] || 0);
      return aDay - bDay;
    });
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h} sa ${m > 0 ? m + ' dk' : ''}` : `${m} dk`;
  };

  const totalHours = Math.round(trainings.reduce((acc, t) => acc + (t.total_duration_seconds || 0), 0) / 3600);

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Eğitimler</h1>
          <p className="text-gray-400 text-sm mt-1">30 İş Günü Eğitim Programı — Danışan Ağı</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg">
          <Plus size={18} /> Eğitim Ekle
        </button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{trainings.length}</p>
          <p className="text-xs text-gray-400 mt-1">Toplam Eğitim</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">6</p>
          <p className="text-xs text-gray-400 mt-1">Modül</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{totalHours} sa</p>
          <p className="text-xs text-gray-400 mt-1">Toplam Süre</p>
        </div>
      </div>

      {/* Modül Grupları */}
      <div className="space-y-3">
        {MODULE_GROUPS.map((mod, idx) => {
          const modTrainings = getTrainingsForModule(mod.days);
          const isExpanded = expandedModules.includes(idx);
          const modTotalSec = modTrainings.reduce((acc, t) => acc + (t.total_duration_seconds || 0), 0);

          return (
            <div key={idx} className={`border rounded-xl overflow-hidden ${BORDER_COLOR[mod.color]} ${BG_COLOR[mod.color]}`}>
              <button onClick={() => toggleModule(idx)} className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center gap-3">
                  <GraduationCap size={18} className={TEXT_COLOR[mod.color]} />
                  <span className={`font-semibold text-sm ${TEXT_COLOR[mod.color]}`}>{mod.label}</span>
                  <span className="text-xs text-gray-500">{modTrainings.length} gün · {formatDuration(modTotalSec)}</span>
                </div>
                {isExpanded
                  ? <ChevronUp size={16} className="text-gray-400" />
                  : <ChevronDown size={16} className="text-gray-400" />}
              </button>

              {isExpanded && (
                <div className="border-t border-white/10">
                  {modTrainings.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-4">Bu modül için henüz eğitim yüklenmemiş</p>
                  ) : (
                    modTrainings.map(t => (
                      <div key={t.id} className="flex items-start justify-between px-4 py-3 border-b border-white/5 last:border-0 bg-black/20 hover:bg-black/30 transition-colors">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{t.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{t.description}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <Clock size={11} />
                            <span>{formatDuration(t.total_duration_seconds)}</span>
                          </div>
                        </div>
                        <span className={`ml-4 mt-0.5 px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${t.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {t.is_published ? 'Yayında' : 'Taslak'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Yeni Eğitim Ekle</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Eğitim Adı (örn: Gün 31 - Başlık)"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
              <textarea
                placeholder="Açıklama"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                rows={3}
              />
              <select
                value={form.module_name}
                onChange={e => setForm({...form, module_name: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Modül Seç</option>
                {MODULE_GROUPS.map(m => <option key={m.label} value={m.label}>{m.label}</option>)}
              </select>
              <input
                type="number"
                placeholder="Süre (saniye)"
                value={form.total_duration_seconds}
                onChange={e => setForm({...form, total_duration_seconds: Number(e.target.value)})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} />
                Yayında
              </label>
            </div>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
