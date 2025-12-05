'use client';

import { useState, useEffect } from 'react';
import apiClient, { handleApiError } from '@/lib/api';
import { Contact, AlertResult } from '@/types';
import { Search, Send, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AlertForm() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [results, setResults] = useState<AlertResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

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

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const response = await apiClient.get('/api/contacts');
      // Backend retorna { success: true, contacts: [...] }
      const contactsData = response.data?.contacts || [];
      setContacts(contactsData);
      setFilteredContacts(contactsData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoadingContacts(false);
    }
  };

  const toggleContact = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContacts.map((c) => c.id!));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIds.length === 0) {
      setError('Selecione pelo menos um cliente');
      return;
    }

    if (!message.trim()) {
      setError('Digite uma mensagem');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await apiClient.post('/api/send-alert', {
        contactIds: selectedIds,
        message: message.trim(),
      });

      setResults(response.data.results || []);
      setMessage('');
      setSelectedIds([]);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loadingContacts) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Enviar Alerta</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search and Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Clientes <span className="text-red-500">*</span>
            </label>
            
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-2">
              <button
                type="button"
                onClick={toggleAll}
                className="text-sm text-primary hover:underline"
              >
                {selectedIds.length === filteredContacts.length ? 'Desselecionar Todos' : 'Selecionar Todos'}
              </button>
              <span className="ml-2 text-sm text-gray-600">
                ({selectedIds.length} selecionado{selectedIds.length !== 1 ? 's' : ''})
              </span>
            </div>

            <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <label
                      key={contact.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(contact.id!)}
                        onChange={() => toggleContact(contact.id!)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-600">
                          {contact.alias && <span className="mr-2">({contact.alias})</span>}
                          <span className="font-mono">{contact.phone}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Digite a mensagem do alerta..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || selectedIds.length === 0 || !message.trim()}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Enviar Alerta</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Resultado do Envio</h3>
          
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : result.status === 'pending_config'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start">
                  {result.status === 'success' ? (
                    <CheckCircle className="text-green-600 mr-2 flex-shrink-0" size={20} />
                  ) : result.status === 'pending_config' ? (
                    <AlertCircle className="text-yellow-600 mr-2 flex-shrink-0" size={20} />
                  ) : (
                    <XCircle className="text-red-600 mr-2 flex-shrink-0" size={20} />
                  )}
                  
                  <div className="flex-1">
                    <div className="font-medium">
                      {result.contactName} ({result.phone})
                    </div>
                    {result.errorMessage && (
                      <div className="text-sm mt-1">{result.errorMessage}</div>
                    )}
                    {result.status === 'pending_config' && (
                      <div className="text-sm mt-1">
                        WhatsApp ainda não configurado. Configure WHATSAPP_TOKEN e WHATSAPP_PHONE_ID.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.some((r) => r.status === 'pending_config') && (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              <p className="font-medium">⚠️ Sistema em modo de configuração</p>
              <p className="text-sm mt-1">
                O WhatsApp ainda não foi configurado. Entre em contato com o administrador para configurar
                o WHATSAPP_TOKEN e WHATSAPP_PHONE_ID.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
