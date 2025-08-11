
"use client";
import React, { useState, useRef } from 'react';

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        setRecordedChunks(chunks);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting voice recording:', error);
      alert('Failed to start voice recording. Please ensure you grant microphone permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-recording-${new Date().toISOString().slice(0, 19)}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const playRecording = () => {
    if (recordedChunks.length === 0 || !audioRef.current) return;

    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    audioRef.current.src = url;
    audioRef.current.play();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Voice Recorder</h1>
          <p className="text-lg text-gray-600">Record and download audio files</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl">
              🎤
            </div>

            {isRecording && (
              <div className="text-2xl font-mono text-red-600">
                {formatTime(recordingTime)}
              </div>
            )}

            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-8 py-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                🎤 Start Recording
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold text-red-600">Recording...</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="px-8 py-4 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors font-semibold text-lg"
                >
                  ⏹️ Stop Recording
                </button>
              </div>
            )}

            {recordedChunks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recording Complete!</h3>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={playRecording}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ▶️ Play
                  </button>
                  <button
                    onClick={downloadRecording}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    💾 Download
                  </button>
                  <button
                    onClick={() => {setRecordedChunks([]); setRecordingTime(0);}}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    🗑️ Clear
                  </button>
                </div>

                <audio
                  ref={audioRef}
                  controls
                  className="w-full max-w-md mx-auto"
                />
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Allow microphone access when prompted</li>
                <li>• Click "Start Recording" to begin</li>
                <li>• Speak clearly into your microphone</li>
                <li>• Click "Stop Recording" when finished</li>
                <li>• Play back, download, or clear your recording</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
