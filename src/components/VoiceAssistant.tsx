'use client';

import React, { useState, useEffect } from 'react';

export const VoiceAssistant: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    let recognition: any;
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (e: any) => {
        setTranscript(e.results[0][0].transcript);
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
    }
    return () => recognition && recognition.stop();
  }, []);

  const start = () => {
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      const r = new (window as any).webkitSpeechRecognition();
      r.continuous = false;
      r.interimResults = false;
      r.onresult = (e: any) => setTranscript(e.results[0][0].transcript);
      r.onend = () => setListening(false);
      r.start();
      setListening(true);
    } else {
      alert('Voice not supported in this browser');
    }
  };

  return (
    <div className="glass p-4">
      <h3 className="font-bold text-sm">Voice Query</h3>
      <p className="text-xs text-gray-300">Speak to query the system</p>
      <div className="mt-3">
        <button onClick={start} className="px-3 py-1 bg-amber-600 rounded text-xs">Start Listening</button>
        <div className="mt-2 text-xs">{listening ? 'Listening...' : 'Not listening'}</div>
        <div className="mt-2 text-sm">Transcript: {transcript}</div>
      </div>
    </div>
  );
};
