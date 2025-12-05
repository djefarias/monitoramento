'use client';

import { useAuth } from '@/contexts/AuthContext';
import { branding } from '@/lib/branding';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image 
            src={branding.logoUrl} 
            alt={branding.appName} 
            width={180} 
            height={50}
            className="h-10 w-auto"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="flex items-center space-x-2 text-gray-700">
                <User size={20} />
                <span className="hidden sm:inline font-medium">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
