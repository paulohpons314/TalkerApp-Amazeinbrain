'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (transcript: string) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
  onError: (error: string) => void;
  mode: 'new' | 'append';
  onModeChange: (mode: 'new' | 'append') => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onRecordingStateChange,
  onError,
  mode: _mode, // eslint-disable-line @typescript-eslint/no-unused-vars
  onModeChange
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(20).fill(0));
  const smoothingFactorRef = useRef<number[]>(new Array(20).fill(0));
  const lastUpdateTimeRef = useRef<number>(0);
  const audioUrlRef = useRef<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      // Cleanup ObjectURL on unmount
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup ObjectURL when recordedAudio changes
  useEffect(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }
    if (recordedAudio) {
      audioUrlRef.current = URL.createObjectURL(recordedAudio);
    } else {
      audioUrlRef.current = null;
    }
  }, [recordedAudio]);

  const startRecording = async () => {
    try {
      onModeChange('append');
      
      console.log('🎙️ Verificando dispositivos de áudio...');
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      console.log('🎤 Microfones detectados:', audioInputs.map(d => ({ 
        label: d.label || 'Desconhecido', 
        deviceId: d.deviceId 
      })));
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });

      const audioTrack = stream.getAudioTracks()[0];
      console.log('🔊 Microfone em uso:', {
        label: audioTrack.label,
        settings: audioTrack.getSettings()
      });

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512; // Menor = mais responsivo, menos preciso
      analyserRef.current.smoothingTimeConstant = 0.6; // Suavização nativa do analyser
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      };

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        transcribeWithWhisper(audioBlob);
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      onRecordingStateChange(true);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      updateAudioLevel();

    } catch (err) {
      onError('Erro ao acessar o microfone. Verifique as permissões.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsRecording(false);
    setIsPaused(false);
    setFrequencyData(new Array(20).fill(0));
    smoothingFactorRef.current = new Array(20).fill(0);
    lastUpdateTimeRef.current = 0;
    onRecordingStateChange(false);
  };

  const transcribeWithWhisper = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    onError('');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success && result.transcript) {
        onRecordingComplete(result.transcript);
      } else {
        onError(result.error || 'Erro na transcrição com Whisper');
      }
    } catch (err) {
      onError('Erro ao processar áudio com Whisper API');
      console.error(err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Validar tipo de arquivo
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/webm', 'audio/ogg'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|m4a|webm|ogg)$/i)) {
      onError('Formato de arquivo não suportado. Use: WAV, MP3, M4A, WEBM ou OGG');
      return;
    }
    
    // Validar tamanho (max 25MB - limite do Whisper)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      onError('Arquivo muito grande. Tamanho máximo: 25MB');
      return;
    }
    
    onModeChange('append');
    setRecordedAudio(file);
    transcribeWithWhisper(file);
    
    // Limpar input para permitir upload do mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    // Throttle para 30fps em vez de 60fps
    const now = performance.now();
    if (now - lastUpdateTimeRef.current < 33) { // ~30fps
      animationRef.current = requestAnimationFrame(updateAudioLevel);
      return;
    }
    lastUpdateTimeRef.current = now;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // getByteTimeDomainData = amplitude real (melhor para voz)
    analyserRef.current.getByteTimeDomainData(dataArray);

    // Extrai 20 barras com foco em frequências de voz humana (85-255 Hz típico)
    const bars = 20;
    // Ignora primeiros 20% (frequências muito baixas/ruído) e últimos 30% (muito altas)
    const startBin = Math.floor(bufferLength * 0.2);
    const endBin = Math.floor(bufferLength * 0.7);
    const usableRange = endBin - startBin;
    const samplesPerBar = Math.floor(usableRange / bars);
    
    const newFrequencyData = Array.from({ length: bars }, (_, i) => {
      const start = startBin + (i * samplesPerBar);
      const end = start + samplesPerBar;
      
      // Calcula RMS para cada barra
      let barSumSquares = 0;
      for (let j = start; j < end && j < bufferLength; j++) {
        const normalized = (dataArray[j] - 128) / 128;
        barSumSquares += normalized * normalized;
      }
      const barRms = Math.sqrt(barSumSquares / samplesPerBar);
      const barHeight = Math.min(barRms * 250, 100); // Amplificado
      
      // Suavização exponencial (evita jitter)
      const smoothingFactor = 0.3;
      const smoothed = (smoothingFactorRef.current[i] * (1 - smoothingFactor)) + 
                       (barHeight * smoothingFactor);
      smoothingFactorRef.current[i] = smoothed;
      
      return Math.max(8, Math.min(smoothed, 100)); // Min 8% para visibilidade
    });

    setFrequencyData(newFrequencyData);

    if (analyserRef.current) {
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setFrequencyData(new Array(20).fill(0));
    smoothingFactorRef.current = new Array(20).fill(0);
    lastUpdateTimeRef.current = 0;
    setRecordedAudio(null);
    onRecordingStateChange(false);
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.wav,.mp3,.m4a,.webm,.ogg"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload de arquivo de áudio"
      />
      
      <div className="flex justify-center items-center gap-4 mb-4">
        {!isRecording ? (
          <>
            <button
              onClick={startRecording}
              disabled={isTranscribing}
              className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 
                       text-4xl flex items-center justify-center transition-all shadow-lg
                       hover:scale-110 active:scale-95"
              title="Iniciar gravação"
              aria-label="Iniciar gravação de áudio"
            >
              🎤
            </button>
            
            <button
              onClick={triggerFileUpload}
              disabled={isTranscribing}
              className="w-16 h-16 rounded-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 
                       text-3xl flex items-center justify-center transition-all shadow-lg
                       hover:scale-110 active:scale-95"
              title="Fazer upload de arquivo de áudio"
              aria-label="Upload de arquivo de áudio"
            >
              📁
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600 
                       text-2xl flex items-center justify-center transition-all shadow-lg"
              title={isPaused ? "Retomar" : "Pausar"}
            >
              {isPaused ? '▶️' : '⏸️'}
            </button>
            <button
              onClick={stopRecording}
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 
                       text-2xl flex items-center justify-center transition-all shadow-lg"
              title="Concluir"
            >
              ✓
            </button>
            <button
              onClick={cancelRecording}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 
                       text-2xl flex items-center justify-center transition-all shadow-lg"
              title="Cancelar"
            >
              ✖
            </button>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-md h-24 bg-gradient-to-br from-gray-50 to-gray-100 
                         dark:from-gray-900 dark:to-gray-800 rounded-lg p-4
                         flex items-center justify-center overflow-hidden shadow-inner">
            <div className="flex items-end justify-center gap-1 h-full w-full">
              {frequencyData.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg 
                            transition-all duration-75 ease-out"
                  style={{
                    height: `${Math.max(height, 8)}%`,
                    minHeight: '6px',
                    opacity: isPaused ? 0.3 : 0.85,
                    transform: isPaused ? 'scaleY(0.5)' : 'scaleY(1)',
                    boxShadow: height > 30 ? '0 0 8px rgba(59, 130, 246, 0.6)' : 'none',
                    filter: height > 50 ? 'brightness(1.2)' : 'brightness(1)'
                  }}
                />
              ))}
            </div>
          </div>
          <div className="text-2xl font-mono font-bold">{formatTime(recordingTime)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {isPaused ? 'Gravação pausada' : 'Gravação em andamento...'}
          </div>
        </div>
      )}

      {isTranscribing && (
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Transcrevendo áudio com Whisper...
          </p>
        </div>
      )}

      {recordedAudio && !isTranscribing && audioUrlRef.current && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
            {recordedAudio instanceof File ? `📁 ${recordedAudio.name}` : '🎤 Gravação'}
          </p>
          <audio controls src={audioUrlRef.current} className="w-full" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            Tamanho: {Math.round(recordedAudio.size / 1024)}KB
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
