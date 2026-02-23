import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [debug, setDebug] = useState('')

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setDebug('')
    setLoading(true)
    try {
      setDebug('Fetching: ' + supabaseUrl.substring(0, 30))
      const res = await fetch(supabaseUrl + '/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      setDebug(JSON.stringify(data).substring(0, 100))
      if (data.error || data.error_description) {
        setError(data.error_description || data.error || 'Giris basarisiz')
        setLoading(false)
        return
      }
      if (data.access_token) {
        window.location.href = '/'
      } else {
        setError('Beklenmedik yanit: ' + JSON.stringify(data).substring(0, 50))
        setLoading(false)
      }
    } catch (err: any) {
      setError('Hata: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-white mb-1">
          Synapse<span className="text-emerald-400">Lynk</span>
        </h1>
        <p className="text-gray-400 text-center mb-8">Kurumsal Calisan Refahi Platformu</p>
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Giris Yap</h2>
          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
          {debug && <div className="bg-blue-500/20 border border-blue-500 text-blue-300 px-4 py-2 rounded mb-4 text-sm">{debug}</div>}
          <div className="text-gray-500 text-xs mb-4">URL: {supabaseUrl ? supabaseUrl.substring(0,30) : 'EMPTY'}</div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm mb-2">Sifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
