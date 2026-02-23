import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Settings() {
  const { profile } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Ayarlar</h1>
      <div className="grid gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Profil Bilgileri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ad Soyad</label>
              <p className="text-white">{profile?.full_name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <p className="text-white">{profile?.email || '-'}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Rol</label>
              <p className="text-white capitalize">{profile?.role || '-'}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Sistem Ayarlari</h2>
          <p className="text-gray-400">Sistem ayarlari yakin zamanda eklenecektir.</p>
        </div>
      </div>
    </div>
  );
}
