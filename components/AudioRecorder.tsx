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
  mode,
  onModeChange
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

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

    if (audioContextRef.current) {
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
    setAudioLevel(0);
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

  const updateAudioLevel = () => {
    if (!analyserRef.current || !isRecording) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / bufferLength;
    const normalizedLevel = Math.min((average / 255) * 100, 100);
    setAudioLevel(normalizedLevel);
    animationRef.current = requestAnimationFrame(updateAudioLevel);
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
    
    if (audioContextRef.current) {
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
    setAudioLevel(0);
    setRecordedAudio(null);
    onRecordingStateChange(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isTranscribing}
            className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 
                     text-4xl flex items-center justify-center transition-all shadow-lg
                     hover:scale-110 active:scale-95"
            title="Iniciar gravação"
          >
            🎤
          </button>
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
          <div className="w-full max-w-md h-20 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 
                         flex items-center justify-center overflow-hidden">
            <div className="flex items-center gap-1 h-full">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="w-1 bg-blue-500 rounded-full transition-all duration-100"
                  style={{
                    height: `${Math.max(
                      10 + (Math.sin((audioLevel + i * 10) * 0.1) * audioLevel * 0.3),
                      5
                    )}%`,
                    opacity: isPaused ? 0.3 : 1
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Processando áudio...</p>
        </div>
      )}

      {recordedAudio && !isTranscribing && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <audio controls src={URL.createObjectURL(recordedAudio)} className="w-full" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            Tamanho: {Math.round(recordedAudio.size / 1024)}KB
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
