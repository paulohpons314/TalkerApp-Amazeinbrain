'use client';

import { useState, useEffect } from 'react';
import RecordButton, { RecordButtonState } from '@/components/RecordButton/RecordButton';

export default function TestComponentsPage() {
  const [state, setState] = useState<RecordButtonState>('standby');
  const [audioLevel, setAudioLevel] = useState(0);

  // Simular audioLevel oscilante quando gravando
  useEffect(() => {
    if (state === 'recording') {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 80 + 20); // 20-100
      }, 200);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [state]);

  const handleClick = () => {
    if (state === 'standby') setState('recording');
    else if (state === 'recording') setState('paused');
    else setState('standby');
  };

  return (
    <div className="min-h-screen bg-[#eeece2] flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🎨 Laboratório Visual de Componentes</h1>
          <p className="text-gray-600">
            Teste e visualize componentes isoladamente antes de integrar no app principal
          </p>
        </div>

        {/* RecordButton - Teste Interativo */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">RecordButton - Interativo</h2>
          
          <div className="flex flex-col items-center gap-6">
            <RecordButton
              state={state}
              audioLevel={audioLevel}
              onClick={handleClick}
            />
            
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                Estado atual: <span className="text-[#B7410E]">{state}</span>
              </p>
              {state === 'recording' && (
                <p className="text-sm text-gray-600">
                  Audio Level: {Math.round(audioLevel)}%
                </p>
              )}
            </div>

            {/* Controles manuais */}
            <div className="flex gap-3">
              <button
                onClick={() => setState('standby')}
                className={`px-4 py-2 rounded ${
                  state === 'standby' ? 'bg-[#B7410E] text-white' : 'bg-gray-200'
                }`}
              >
                Standby
              </button>
              <button
                onClick={() => setState('recording')}
                className={`px-4 py-2 rounded ${
                  state === 'recording' ? 'bg-[#B7410E] text-white' : 'bg-gray-200'
                }`}
              >
                Recording
              </button>
              <button
                onClick={() => setState('paused')}
                className={`px-4 py-2 rounded ${
                  state === 'paused' ? 'bg-[#B7410E] text-white' : 'bg-gray-200'
                }`}
              >
                Paused
              </button>
            </div>
          </div>
        </section>

        {/* RecordButton - Todos os Estados (Visual Reference) */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">RecordButton - Todos os Estados</h2>
          
          <div className="grid grid-cols-3 gap-8">
            {/* Standby */}
            <div className="flex flex-col items-center gap-4">
              <RecordButton
                state="standby"
                onClick={() => {}}
              />
              <div className="text-center">
                <p className="font-medium">Standby</p>
                <p className="text-xs text-gray-500">Rotação lenta</p>
                <p className="text-xs text-gray-500">Ícone microfone</p>
              </div>
            </div>

            {/* Recording */}
            <div className="flex flex-col items-center gap-4">
              <RecordButton
                state="recording"
                audioLevel={60}
                onClick={() => {}}
              />
              <div className="text-center">
                <p className="font-medium">Recording</p>
                <p className="text-xs text-gray-500">Pulsação por áudio</p>
                <p className="text-xs text-gray-500">Quadrado branco</p>
              </div>
            </div>

            {/* Paused */}
            <div className="flex flex-col items-center gap-4">
              <RecordButton
                state="paused"
                onClick={() => {}}
              />
              <div className="text-center">
                <p className="font-medium">Paused</p>
                <p className="text-xs text-gray-500">Piscar (blink)</p>
                <p className="text-xs text-gray-500">Ícone pause</p>
              </div>
            </div>
          </div>
        </section>

        {/* Design Specs */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">📐 Especificações de Design</h2>
          
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Dimensões</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Botão interno: 60px</li>
                <li>• Anel externo: 70px (10px maior)</li>
                <li>• Stroke do anel: 5px</li>
                <li>• Gaps: 10° cada, distantes 60°</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Cores</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Primária: <span className="text-[#B7410E]">#B7410E</span> (Ferrugem)</li>
                <li>• Background: <span className="text-[#eeece2]">#eeece2</span> (Bege)</li>
                <li>• Ícones: Branco</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Animações</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Rotação standby: ~8s</li>
                <li>• Pulsação: baseada em audioLevel</li>
                <li>• Blink pausado: 1s</li>
                <li>• Hover scale: 1.05</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Estados</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• <strong>Standby:</strong> rotação + ícone mic</li>
                <li>• <strong>Recording:</strong> pulsa + quadrado</li>
                <li>• <strong>Paused:</strong> pisca + barras</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Instruções */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Como usar esta página:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Use a seção interativa para testar comportamentos dinâmicos</li>
            <li>Compare visualmente com seu mockup do Illustrator</li>
            <li>Ajuste valores no código e veja mudanças instantâneas (hot reload)</li>
            <li>Quando estiver perfeito, copie o componente para o app principal</li>
            <li>Esta página não afeta o app - é um sandbox seguro</li>
          </ol>
        </section>

        {/* Link de volta */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#B7410E] text-white rounded-lg hover:bg-[#9a3708] transition-colors"
          >
            ← Voltar para o TalkerApp
          </a>
        </div>

      </div>
    </div>
  );
}
