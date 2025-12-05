'use client';

import { useState, useEffect } from 'react';
import apiClient, { handleApiError } from '@/lib/api';
import { Contact } from '@/types';
import { Search, Loader2, Users } from 'lucide-react';

interface ClientListProps {
  refresh: number;
}

export default function ClientList({ refresh }: ClientListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/api/contacts');
      const contactsData = response.data || [];
      setContacts(contactsData);
      setFilteredContacts(contactsData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [refresh]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(term) ||
          contact.alias?.toLowerCase().includes(term) ||
          contact.phone.includes(term)
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          <p className="font-medium">Erro ao carregar clientes:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <Users className="mr-2" size={28} />
        Clientes Cadastrados
      </h2>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, apelido ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">
            {searchTerm ? 'Nenhum cliente encontrado com esse termo.' : 'Nenhum cliente cadastrado ainda.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Apelido</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Telefone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Observações</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact, index) => (
                <tr key={contact.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{contact.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contact.alias || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">{contact.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contact.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Total: {filteredContacts.length} cliente{filteredContacts.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
