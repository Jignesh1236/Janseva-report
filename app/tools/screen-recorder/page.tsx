
"use client";
import React, { useState, useRef } from 'react';

export default function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

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
    } catch (error) {
      console.error('Error starting screen recording:', error);
      alert('Failed to start screen recording. Please ensure you grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screen-recording-${new Date().toISOString().slice(0, 19)}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewRecording = () => {
    if (recordedChunks.length === 0 || !videoRef.current) return;

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    videoRef.current.src = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Screen Recorder</h1>
          <p className="text-lg text-gray-600">Record your screen activities</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-6">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                🎥 Start Recording
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold text-red-600">Recording...</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-lg"
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
                    onClick={previewRecording}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    👁️ Preview
                  </button>
                  <button
                    onClick={downloadRecording}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    💾 Download
                  </button>
                </div>

                <video
                  ref={videoRef}
                  controls
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                  style={{ display: 'none' }}
                />
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click "Start Recording" to begin</li>
                <li>• Select the screen/window you want to record</li>
                <li>• Click "Stop Recording" when finished</li>
                <li>• Preview and download your recording</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
