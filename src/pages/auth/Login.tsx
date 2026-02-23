import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) toast.error('Giris basarisiz: ' + error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Synapse<span className="text-primary">Lynk</span></h1>
          <p className="text-slate-400 mt-2">Kurumsal Calisan Refahi Platformu</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Giris Yap</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">E-posta</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input w-full" placeholder="ornek@email.com" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Sifre</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input w-full" placeholder="******" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
