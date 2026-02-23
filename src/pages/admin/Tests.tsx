import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, ClipboardList } from 'lucide-react';

export default function AdminTests() {
  const [tests, setTests] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
      if (data) setTests(data);
    };
    fetch();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testler</h1>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Test Olustur</button>
      </div>
      <div className="grid gap-4">
        {tests.length === 0 && <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center text-gray-400"><ClipboardList size={40} className="mx-auto mb-3 opacity-50" /><p>Henuz test olusturulmamis</p></div>}
        {tests.map(t => (
          <div key={t.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{t.description || 'Aciklama yok'}</p>
              </div>
              <span className="text-sm text-gray-400">{t.duration_minutes} dk</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
