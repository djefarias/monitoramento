'use client';

import AlertForm from '@/components/AlertForm';

export default function AlertasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Enviar Alertas</h1>
        <p className="mt-2 text-gray-600">Selecione os clientes e envie alertas via WhatsApp.</p>
      </div>

      <AlertForm />
    </div>
  );
}
