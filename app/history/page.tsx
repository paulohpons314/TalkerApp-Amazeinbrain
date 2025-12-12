'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import InsightsPanel from '@/components/InsightsPanel';

interface Session {
  id: number;
  created_at: string;
  transcription: string;
  processed_text: string;
  analysis?: string;
  user_notes?: string;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setError(null);
      const response = await fetch('/api/history?limit=50');

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSessions(result.data);
        console.log(`[History] ${result.data.length} sessões carregadas com sucesso`);
      } else {
        throw new Error(result.error || 'Erro desconhecido ao carregar sessões');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro ao carregar histórico:', errorMessage);
      setError(`Falha ao carregar histórico: ${errorMessage}`);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadSessions();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/history?search=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSessions(result.data);
        console.log(`[History] Busca encontrou ${result.data.length} resultado(s)`);
      } else {
        throw new Error(result.error || 'Erro ao buscar');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro ao buscar:', errorMessage);
      setError(`Falha na busca: ${errorMessage}`);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta sessão?')) return;

    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== id));
        if (selectedSession?.id === id) {
          setSelectedSession(null);
        }
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                📚 Histórico de Reflexões
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore suas sessões passadas e padrões de pensamento
              </p>
            </div>
            <Link 
              href="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all hover:scale-105"
            >
              ← Voltar
            </Link>
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar por palavras-chave nas suas reflexões..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
            >
              🔍 Buscar
            </button>
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
            >
              📊 Insights
            </button>
          </div>
        </div>

        {/* Insights Panel */}
        {showInsights && (
          <div className="mb-8">
            <InsightsPanel />
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                  Erro ao carregar histórico
                </h3>
                <p className="text-red-700 dark:text-red-400 mb-3">
                  {error}
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    loadSessions();
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                >
                  🔄 Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Session List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de sessões */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sessões ({sessions.length})
            </h2>
            
            {sessions.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Nenhuma sessão encontrada. Comece gravando suas reflexões!
                </p>
              </div>
            ) : (
              sessions.map(session => (
                <div
                  key={session.id}
                  className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 cursor-pointer transition-all hover:shadow-2xl
                    ${selectedSession?.id === session.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(session.created_at)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(session.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-2">
                    {session.transcription}
                  </p>
                  
                  {session.user_notes && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        📝 {session.user_notes}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Detalhes da sessão selecionada */}
          <div className="sticky top-8 h-fit">
            {selectedSession ? (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Detalhes da Sessão
                  </h2>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Data */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Data
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(selectedSession.created_at)}
                    </p>
                  </div>

                  {/* Transcrição Original */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Transcrição Original
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedSession.transcription}
                      </p>
                    </div>
                  </div>

                  {/* Texto Processado */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Texto Processado
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                        {selectedSession.processed_text}
                      </p>
                    </div>
                  </div>

                  {/* Análise */}
                  {selectedSession.analysis && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                        Análise Psicológica
                      </h3>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm">
                          {selectedSession.analysis}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notas do Usuário */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Notas Pessoais
                    </h3>
                    <textarea
                      value={selectedSession.user_notes || ''}
                      onChange={(e) => {
                        setSelectedSession({
                          ...selectedSession,
                          user_notes: e.target.value
                        });
                      }}
                      placeholder="Adicione suas reflexões sobre esta sessão..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                    <button
                      onClick={async () => {
                        try {
                          await fetch('/api/history', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              id: selectedSession.id,
                              user_notes: selectedSession.user_notes
                            })
                          });
                          alert('Notas salvas com sucesso!');
                        } catch (error) {
                          alert('Erro ao salvar notas');
                        }
                      }}
                      className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                    >
                      💾 Salvar Notas
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Selecione uma sessão para ver os detalhes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
