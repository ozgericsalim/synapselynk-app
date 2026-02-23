import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState('');
  const { user, profile } = useAuth();

  if (user && profile) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDebug('');
    setLoading(true);
    try {
      setDebug('Calling signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setDebug(prev => prev + '\nResponse received');
      if (error) {
        setDebug(prev => prev + '\nError: ' + error.message);
        throw error;
      }
      setDebug(prev => prev + '\nLogin successful, waiting for redirect...');
    } catch (err: any) {
      setError(err.message || 'Giris basarisiz');
      setDebug(prev => prev + '\nCatch: ' + (err.message || 'unknown'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-white mb-1">Synapse<span className="text-emerald-400">Lynk</span></h1>
        <p className="text-gray-400 text-center mb-8">Kurumsal Calisan Refahi Platformu</p>
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Giris Yap</h2>
          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4 text-sm break-all">{error}</div>}
          {debug && <div className="bg-blue-500/20 border border-blue-500 text-blue-300 px-4 py-2 rounded mb-4 text-xs whitespace-pre-wrap break-all">{debug}</div>}
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
