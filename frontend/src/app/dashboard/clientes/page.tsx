'use client';

import { useState } from 'react';
import ClientForm from '@/components/ClientForm';
import ClientList from '@/components/ClientList';

export default function ClientesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Clientes</h1>
        <p className="mt-2 text-gray-600">Cadastre e visualize seus clientes.</p>
      </div>

      <ClientForm onSuccess={handleSuccess} />
      <ClientList refresh={refreshKey} />
    </div>
  );
}
