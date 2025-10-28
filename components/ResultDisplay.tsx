'use client';

import React, { useState } from 'react';

interface ProcessedResult {
  processedText: string;
  analysis: string;
  explanation: string;
}

interface ResultDisplayProps {
  result: ProcessedResult;
  originalTranscript: string;
  onCopyToClipboard: (text: string) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  originalTranscript,
  onCopyToClipboard
}) => {
  const [activeTab, setActiveTab] = useState<'processed' | 'analysis' | 'original'>('processed');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    onCopyToClipboard(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold p-4">✨ Resultado processado</h2>
          <div className="flex gap-2 px-4 pb-2">
            <button
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'processed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('processed')}
            >
              📝 Texto Processado
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'analysis'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('analysis')}
            >
              🧠 Análise
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'original'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('original')}
            >
              🎤 Transcrição Original
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'processed' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Texto processado pelo Claude</h3>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    copied === 'Texto processado'
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  onClick={() => handleCopy(result.processedText, 'Texto processado')}
                >
                  {copied === 'Texto processado' ? '✅ Copiado!' : '📋 Copiar'}
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                {result.processedText.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Análise e insights</h3>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    copied === 'Análise'
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  onClick={() => handleCopy(result.analysis, 'Análise')}
                >
                  {copied === 'Análise' ? '✅ Copiado!' : '📋 Copiar'}
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                {result.analysis.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
              </div>
              
              {result.explanation && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-3">Explicação das mudanças:</h4>
                  <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    {result.explanation.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'original' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Transcrição original (Whisper)</h3>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    copied === 'Transcrição original'
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  onClick={() => handleCopy(originalTranscript, 'Transcrição original')}
                >
                  {copied === 'Transcrição original' ? '✅ Copiado!' : '📋 Copiar'}
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p>{originalTranscript}</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
          <button
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              copied === 'Texto processado'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            onClick={() => handleCopy(result.processedText, 'Texto processado')}
          >
            📋 Copiar Texto Principal
          </button>
          <button
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              copied === 'Conteúdo completo'
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
            onClick={() => {
              const fullContent = `TEXTO PROCESSADO:\n${result.processedText}\n\nANÁLISE:\n${result.analysis}\n\nTRANSCRIÇÃO ORIGINAL:\n${originalTranscript}`;
              handleCopy(fullContent, 'Conteúdo completo');
            }}
          >
            📑 Copiar Tudo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
