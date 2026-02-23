import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Utensils } from 'lucide-react';

export default function ExpertDietPlans() {
  const { profile } = useAuth();
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!profile) return;
      const { data } = await supabase.from('diet_meals').select('*').order('day_of_week', { ascending: true });
      if (data) setMeals(data);
      setLoading(false);
    };
    fetch();
  }, [profile]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full"></div></div>;

  const days = ['Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi', 'Pazar'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Diyet Planlari</h1>
      <div className="grid gap-4">
        {meals.length === 0 && (
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center text-gray-400">
            <Utensils size={40} className="mx-auto mb-3 opacity-50" />
            <p>Henuz diyet plani bulunmuyor</p>
            <p className="text-sm mt-1">Diyet planlari eklendiginde burada gorunecektir</p>
          </div>
        )}
        {meals.map(m => (
          <div key={m.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{days[m.day_of_week - 1] || 'Gun ' + m.day_of_week} - {m.meal_type}</h3>
                <p className="text-sm text-gray-400 mt-1">{m.calories ? m.calories + ' kcal' : ''} {m.notes || ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
