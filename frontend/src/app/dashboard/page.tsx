'use client';

import { useAuth } from '@/contexts/AuthContext';
import { branding } from '@/lib/branding';
import { Users, Bell, Shield } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">Gerencie seus clientes e envie alertas via WhatsApp.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/clientes">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Clientes</h3>
                <p className="mt-1 text-sm text-gray-600">Cadastre e gerencie seus clientes</p>
              </div>
              <Users size={40} className="text-primary" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/alertas">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Enviar Alertas</h3>
                <p className="mt-1 text-sm text-gray-600">Envie alertas para seus clientes</p>
              </div>
              <Bell size={40} className="text-primary" />
            </div>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sistema</h3>
              <p className="mt-1 text-sm text-gray-600">{branding.appName}</p>
            </div>
            <Shield size={40} className="text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Como usar o sistema</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Cadastre seus clientes</h3>
              <p className="text-gray-600 text-sm">
                Acesse a página de Clientes e cadastre os contatos que receberão os alertas.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Envie alertas</h3>
              <p className="text-gray-600 text-sm">
                Na página de Enviar Alertas, selecione os destinatários e digite sua mensagem.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Acompanhe os resultados</h3>
              <p className="text-gray-600 text-sm">
                Veja o status de cada envio e identifique possíveis problemas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
