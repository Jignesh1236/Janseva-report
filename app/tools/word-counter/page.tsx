
"use client";
import React, { useState, useEffect } from 'react';
import { FileText, Hash, Clock, Eye } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0
  });

  const calculateStats = (inputText: string) => {
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    
    const words = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;
    
    const sentences = inputText.trim() === '' ? 0 : 
      inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    const paragraphs = inputText.trim() === '' ? 0 : 
      inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Average reading speed: 200-300 words per minute
    const readingTime = Math.ceil(words / 250);
    
    // Average speaking speed: 130-150 words per minute
    const speakingTime = Math.ceil(words / 140);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime
    });
  };

  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const clearText = () => {
    setText('');
  };

  const StatCard = ({ icon: Icon, label, value, unit = '' }: {
    icon: React.ElementType;
    label: string;
    value: number;
    unit?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()} {unit}
          </p>
        </div>
        <Icon className="h-8 w-8 text-blue-500" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Word Counter</h1>
          <p className="text-lg text-gray-600">Count words, characters, and analyze your text</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Text Input Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Enter Your Text</h2>
                <div className="flex space-x-3">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Upload File
                  </label>
                  <button
                    onClick={clearText}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              
              <div className="mt-4 text-sm text-gray-500">
                Real-time analysis • Upload .txt files for analysis
              </div>
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistics</h2>
              
              <div className="space-y-4">
                <StatCard
                  icon={Hash}
                  label="Characters"
                  value={stats.characters}
                />
                
                <StatCard
                  icon={Hash}
                  label="Characters (no spaces)"
                  value={stats.charactersNoSpaces}
                />
                
                <StatCard
                  icon={FileText}
                  label="Words"
                  value={stats.words}
                />
                
                <StatCard
                  icon={FileText}
                  label="Sentences"
                  value={stats.sentences}
                />
                
                <StatCard
                  icon={FileText}
                  label="Paragraphs"
                  value={stats.paragraphs}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Reading Time</h2>
              
              <div className="space-y-4">
                <StatCard
                  icon={Eye}
                  label="Reading Time"
                  value={stats.readingTime}
                  unit="min"
                />
                
                <StatCard
                  icon={Clock}
                  label="Speaking Time"
                  value={stats.speakingTime}
                  unit="min"
                />
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>• Reading: ~250 words/min</p>
                <p>• Speaking: ~140 words/min</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Paste text directly or upload .txt files</li>
                <li>• Statistics update in real-time</li>
                <li>• Reading time based on average speed</li>
                <li>• Perfect for content creators and writers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
