import { useAuth } from '../../contexts/AuthContext'
export default function AdminDashboard() {
  const { profile, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400">Hosgeldiniz, {profile?.full_name}</p>
          </div>
          <button onClick={signOut} className="btn-secondary">Cikis Yap</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card"><p className="text-slate-400 text-sm">Toplam Kurum</p><p className="text-3xl font-bold text-white mt-1">0</p></div>
          <div className="card"><p className="text-slate-400 text-sm">Toplam Uzman</p><p className="text-3xl font-bold text-white mt-1">0</p></div>
          <div className="card"><p className="text-slate-400 text-sm">Toplam Calisan</p><p className="text-3xl font-bold text-white mt-1">0</p></div>
          <div className="card"><p className="text-slate-400 text-sm">Aktif Seanslar</p><p className="text-3xl font-bold text-primary mt-1">0</p></div>
        </div>
        <div className="card"><p className="text-slate-400">Detayli admin modulleri yakin zamanda eklenecektir.</p></div>
      </div>
    </div>
  )
}
