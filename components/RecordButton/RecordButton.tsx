'use client';

import { useState, useEffect } from 'react';

export type RecordButtonState = 'standby' | 'recording' | 'paused';

interface RecordButtonProps {
  state: RecordButtonState;
  audioLevel?: number; // 0-100 para pulsação durante gravação
  onClick: () => void;
  size?: number; // Tamanho do botão interno (padrão: 60px)
}

export default function RecordButton({
  state,
  audioLevel = 0,
  onClick,
  size = 60
}: RecordButtonProps) {
  const [rotation, setRotation] = useState(0);
  const ringSize = size + 10; // Anel externo 10px maior
  const gapDegrees = 10; // Tamanho de cada gap

  // Rotação lenta em standby
  useEffect(() => {
    if (state === 'standby') {
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 1) % 360);
      }, 22); // ~8 segundos para rotação completa (360/22 ≈ 8000ms)
      return () => clearInterval(interval);
    }
  }, [state]);

  // Calcular escala de pulsação baseada no audioLevel
  const pulseScale = state === 'recording' ? 1 + (audioLevel / 100) * 0.15 : 1;

  // SVG do anel com 2 gaps
  const createRingPath = () => {
    const cx = ringSize / 2;
    const cy = ringSize / 2;
    const radius = ringSize / 2 - 2.5; // 5px de stroke/2
    
    // Gap 1: 0° (topo)
    const gap1Start = -90; // Topo do círculo
    const gap1End = gap1Start + gapDegrees;
    
    // Gap 2: 60° do primeiro gap
    const gap2Start = gap1End + 60;
    const gap2End = gap2Start + gapDegrees;
    
    // Resto do círculo
    const gap3Start = gap2End;
    const gap3End = gap1Start + 360;

    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const polarToCartesian = (angle: number) => ({
      x: cx + radius * Math.cos(toRadians(angle)),
      y: cy + radius * Math.sin(toRadians(angle))
    });

    // Criar 2 arcos (entre os gaps)
    const arc1Start = polarToCartesian(gap1End);
    const arc1End = polarToCartesian(gap2Start);
    const arc2Start = polarToCartesian(gap2End);
    const arc2End = polarToCartesian(gap3End);

    return `
      M ${arc1Start.x} ${arc1Start.y}
      A ${radius} ${radius} 0 0 1 ${arc1End.x} ${arc1End.y}
      M ${arc2Start.x} ${arc2Start.y}
      A ${radius} ${radius} 0 1 1 ${arc2End.x} ${arc2End.y}
    `;
  };

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
      style={{
        width: `${ringSize}px`,
        height: `${ringSize}px`,
      }}
      aria-label={`Record button - ${state}`}
    >
      {/* Anel externo com gaps */}
      <svg
        className="absolute"
        width={ringSize}
        height={ringSize}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: state === 'standby' ? 'none' : 'transform 0.3s ease',
        }}
      >
        <path
          d={createRingPath()}
          fill="none"
          stroke="#B7410E"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* Botão interno */}
      <div
        className="absolute rounded-full bg-[#B7410E] flex items-center justify-center shadow-lg transition-all duration-150"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `scale(${pulseScale})`,
          opacity: state === 'paused' ? 0.7 : 1,
          animation: state === 'paused' ? 'blink 1s infinite' : 'none',
        }}
      >
        {/* Ícone baseado no estado */}
        {state === 'standby' && (
          <svg
            width={size * 0.4}
            height={size * 0.4}
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
        {state === 'recording' && (
          <div className="w-3 h-3 bg-white rounded-sm" />
        )}
        {state === 'paused' && (
          <div className="flex gap-1">
            <div className="w-1.5 h-4 bg-white rounded-sm" />
            <div className="w-1.5 h-4 bg-white rounded-sm" />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </button>
  );
}
