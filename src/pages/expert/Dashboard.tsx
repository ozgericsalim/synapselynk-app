import { useAuth } from '../../contexts/AuthContext'
export default function ExpertDashboard() {
  const { profile, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Expert Panel</h1>
            <p className="text-slate-400">Hosgeldiniz, {profile?.full_name}</p>
          </div>
          <button onClick={signOut} className="btn-secondary">Cikis Yap</button>
        </div>
        <div className="card"><p className="text-slate-400">Bu panel yakin zamanda tamamlanacaktir.</p></div>
      </div>
    </div>
  )
}
