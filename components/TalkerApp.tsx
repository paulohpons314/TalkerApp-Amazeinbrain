'use client';

import React, { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import ResultDisplay from '@/components/ResultDisplay';

interface ProcessedResult {
  processedText: string;
  analysis: string;
  explanation: string;
}

export default function TalkerApp() {
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingMode, setRecordingMode] = useState<'new' | 'append'>('new');
  const [recordingKey, setRecordingKey] = useState(0);

  const handleRecordingComplete = (audioTranscript: string) => {
    let finalTranscript = audioTranscript;
    
    if (recordingMode === 'append' && transcript) {
      finalTranscript = transcript + '\n\n' + audioTranscript;
    }
    
    setTranscript(finalTranscript);
    processTranscript(finalTranscript);
  };

  const finalizeSession = () => {
    setTranscript('');
    setProcessedResult(null);
    setError(null);
    setIsProcessing(false);
    setRecordingMode('new');
    setRecordingKey(prev => prev + 1);
  };

  const processTranscript = async (text: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const enhancedPrompt = `
      Sistema: Você é um assistente especializado em processamento de texto transcrito de voz.

      FUNÇÃO DUPLA - Tag-Talker:
      - Se encontrar "Tag-Talker" ou "tag-talker" seguido de instruções, trate como comandos específicos do usuário
      - Execute as instruções Tag-Talker no texto (ex: negrito, bullet points, exclusões, análises, etc.)
      - O restante do texto deve ser processado normalmente

      Texto transcrito: ${text}

      Forneça sua resposta no formato:
      <processed_text>
      [Texto processado e formatado]
      </processed_text>
      
      <analysis>
      [Análise do conteúdo se solicitada]
      </analysis>
      
      <explanation>
      [Explicação das transformações realizadas]
      </explanation>
      `;

      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: enhancedPrompt })
      });

      const result = await response.json();
      
      if (result.success && result.result) {
        const parsed = parseClaudeResponse(result.result);
        setProcessedResult(parsed);
      } else {
        setError(result.error || 'Erro ao processar o texto');
      }
    } catch (err) {
      setError('Erro na comunicação com a API do Claude');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseClaudeResponse = (response: string): ProcessedResult => {
    const processedTextMatch = response.match(/<processed_text>([\s\S]*?)<\/processed_text>/);
    const analysisMatch = response.match(/<analysis>([\s\S]*?)<\/analysis>/);
    const explanationMatch = response.match(/<explanation>([\s\S]*?)<\/explanation>/);

    return {
      processedText: processedTextMatch ? processedTextMatch[1].trim() : response,
      analysis: analysisMatch ? analysisMatch[1].trim() : '',
      explanation: explanationMatch ? explanationMatch[1].trim() : ''
    };
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError('Erro ao copiar texto');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TalkerApp
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Voice Recording and AI Processing
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="text-red-700 dark:text-red-300">❌ {error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="mb-6 p-6 bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-700 rounded-lg">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  Processando com Claude API...
                </p>
              </div>
            </div>
          )}

          {processedResult && (
            <div className="mb-8">
              <div className="mb-6 flex flex-col items-center gap-4">
                <button 
                  onClick={finalizeSession}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                           text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105 active:scale-95"
                  title="Clear - Finaliza sessão e limpa a página"
                >
                  🧹 CLEAR
                </button>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    💡 <strong>Dica:</strong> Clique no microfone para <em>adicionar conteúdo</em> ao texto existente!
                  </p>
                </div>
              </div>
              <ResultDisplay 
                result={processedResult}
                originalTranscript={transcript}
                onCopyToClipboard={handleCopyToClipboard}
              />
            </div>
          )}

          <div className="mt-8 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <AudioRecorder 
              key={recordingKey}
              onRecordingComplete={handleRecordingComplete}
              onRecordingStateChange={() => {}}
              onError={setError}
              mode={recordingMode}
              onModeChange={setRecordingMode}
            />
          </div>
        </main>

        <footer className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>TalkerApp - Powered by Whisper & Claude AI</p>
        </footer>
      </div>
    </div>
  );
}
