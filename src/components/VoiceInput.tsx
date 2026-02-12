'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onCommand?: (command: string) => void;
  placeholder?: string;
  language?: 'en-IN' | 'hi-IN' | 'ta-IN' | 'mr-IN' | 'bn-IN' | 'te-IN';
}

// Voice commands mapping for Indian business context
const VOICE_COMMANDS: Record<string, string> = {
  'show dashboard': 'navigate:dashboard',
  'show report': 'navigate:report',
  'generate report': 'action:generate-report',
  'export excel': 'action:export-excel',
  'export pdf': 'action:export-pdf',
  'show cash flow': 'navigate:cashflow',
  'show gst': 'navigate:gst',
  'check compliance': 'action:check-compliance',
  'add competitor': 'action:add-competitor',
  'market entry': 'navigate:market-entry',
  'funding score': 'navigate:funding',
  'workforce plan': 'navigate:workforce',
  'supplier risk': 'navigate:supplier',
  'compare states': 'action:compare-states',
  'share on whatsapp': 'action:whatsapp-share',
  // Hindi commands
  'रिपोर्ट दिखाओ': 'navigate:report',
  'एक्सेल निर्यात': 'action:export-excel',
  'जीएसटी जांचो': 'navigate:gst',
  'डैशबोर्ड': 'navigate:dashboard',
};

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'मराठी', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'te-IN', name: 'తెలుగు', flag: '🇮🇳' },
];

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onCommand,
  placeholder = 'Click mic or say "Hey NeoBI"...',
  language = 'en-IN',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isSupported, setIsSupported] = useState(true);
  const [showLanguages, setShowLanguages] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      startAudioVisualization();
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        const fullTranscript = transcript + ' ' + final;
        setTranscript(fullTranscript.trim());
        onTranscript(fullTranscript.trim());

        // Check for voice commands
        const lowerFinal = final.toLowerCase().trim();
        const command = VOICE_COMMANDS[lowerFinal];
        if (command && onCommand) {
          onCommand(command);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'network') {
        setError('Speech recognition requires an internet connection. Please check your network and try again.');
      } else if (event.error === 'audio-capture') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (event.error === 'aborted') {
        // Silently handle aborted - user stopped or recognition restarted
        setIsListening(false);
        stopAudioVisualization();
        return;
      } else {
        setError(`Speech recognition error: ${event.error}. Please try again.`);
      }
      setIsListening(false);
      stopAudioVisualization();
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      stopAudioVisualization();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopAudioVisualization();
    };
  }, [selectedLanguage, transcript, onTranscript, onCommand]);

  // Audio visualization
  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const updateVolume = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(average / 255);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (err) {
      console.error('Audio visualization error:', err);
    }
  };

  const stopAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setVolume(0);
  };

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setError(null);
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
    }
  }, [isListening, selectedLanguage]);

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
        <div className="flex items-center gap-2 text-red-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm">Voice input not supported. Please use Chrome or Edge browser.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-white/10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Voice Input</h3>
            <p className="text-xs text-gray-400">Speak to search or navigate</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="text-lg">{SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.flag}</span>
            <span className="text-sm text-gray-300">{selectedLanguage.split('-')[0].toUpperCase()}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {showLanguages && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 bg-gray-800 border border-white/10 rounded-lg overflow-hidden z-10 shadow-xl"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code as any);
                      setShowLanguages(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 transition-colors ${
                      selectedLanguage === lang.code ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Voice Button */}
      <div className="flex flex-col items-center py-6">
        <motion.button
          onClick={toggleListening}
          whileTap={{ scale: 0.95 }}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? 'bg-red-500 shadow-lg shadow-red-500/50'
              : 'bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
          }`}
        >
          {/* Volume ring animation */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-red-400"
              animate={{
                scale: [1, 1 + volume * 0.5],
                opacity: [0.8, 0.2],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
              }}
            />
          )}

          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isListening ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            )}
          </svg>
        </motion.button>

        <p className="mt-4 text-sm text-gray-400">
          {isListening ? '🎤 Listening...' : 'Tap to speak'}
        </p>
      </div>

      {/* Transcript Display */}
      <div className="min-h-[60px] p-3 bg-white/5 rounded-lg border border-white/10">
        {transcript || interimTranscript ? (
          <div className="relative">
            <p className="text-white text-sm">
              {transcript}
              {interimTranscript && (
                <span className="text-gray-400 italic"> {interimTranscript}</span>
              )}
            </p>
            {transcript && (
              <button
                onClick={clearTranscript}
                className="absolute right-0 top-0 p-1 hover:bg-white/10 rounded transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">{placeholder}</p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Voice Commands Help */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-400 mb-2">💡 Try saying:</p>
        <div className="flex flex-wrap gap-2">
          {['Show dashboard', 'Export Excel', 'Check GST', 'Market entry', 'Funding score'].map((cmd) => (
            <span key={cmd} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
              "{cmd}"
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
