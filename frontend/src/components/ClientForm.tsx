'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient, { handleApiError } from '@/lib/api';
import { Contact } from '@/types';
import { Save, Loader2 } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  alias: z.string().optional(),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').regex(/^[0-9+\s-]+$/, 'Formato de telefone inválido'),
  notes: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ClientFormProps {
  onSuccess: () => void;
}

export default function ClientForm({ onSuccess }: ClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setMessage(null);

    try {
      await apiClient.post('/api/contacts', data);
      setMessage({ type: 'success', text: 'Cliente cadastrado com sucesso!' });
      reset();
      onSuccess();
    } catch (error) {
      setMessage({ type: 'error', text: handleApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastrar Novo Cliente</h2>
      
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Nome completo do cliente"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="alias" className="block text-sm font-medium text-gray-700 mb-1">
            Apelido
          </label>
          <input
            {...register('alias')}
            type="text"
            id="alias"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Apelido (opcional)"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone <span className="text-red-500">*</span>
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="5511999999999"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Observações adicionais (opcional)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Salvar Cliente</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
