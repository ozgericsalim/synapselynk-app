import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();

  if (user && profile) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const resp = await fetch(url + '/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': key },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      if (data.error || data.error_description) {
        throw new Error(data.error_description || data.msg || 'Auth error');
      }
      if (data.access_token) {
        const { error: setErr } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token
        });
        if (setErr) throw setErr;
      } else {
        throw new Error('No access token: ' + JSON.stringify(data).substring(0, 100));
      }
    } catch (err: any) {
      setError(err.message || 'Giris basarisiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold"><span className="text-white">Synapse</span><span className="text-emerald-400">Lynk</span></h1>
          <p className="text-gray-400 mt-2">Kurumsal Calisan Refahi Platformu</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Giris Yap</h2>
          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4 text-sm break-all">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">E-posta</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm mb-2">Sifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}