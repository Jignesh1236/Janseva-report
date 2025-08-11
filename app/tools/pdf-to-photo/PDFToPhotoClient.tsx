"use client";
import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

// This component is dynamically imported with ssr: false in page.tsx to avoid SSR issues with browser-only APIs like DOMMatrix.

export default function PDFToPhoto() {
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(0.8);
  const [scale, setScale] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (file: File | null) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    setSelectedPDF(file);
    setPages([]);
    setIsConverting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageImages: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const imageDataUrl = canvas.toDataURL(`image/${outputFormat}`, outputFormat === 'jpeg' ? quality : undefined);
        pageImages.push(imageDataUrl);
      }

      setPages(pageImages);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF file. Please try again with a different file.');
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImage = (dataUrl: string, pageNumber: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${selectedPDF?.name?.replace('.pdf', '') || 'pdf'}-page-${pageNumber}.${outputFormat}`;
    link.click();
  };

  const downloadAllImages = async () => {
    if (pages.length === 0) return;

    setIsConverting(true);
    
    // Create a zip file with all images
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    pages.forEach((dataUrl, index) => {
      const base64Data = dataUrl.split(',')[1];
      zip.file(`page-${index + 1}.${outputFormat}`, base64Data, { base64: true });
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${selectedPDF?.name?.replace('.pdf', '') || 'pdf'}-pages.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Error creating zip file. Please try downloading images individually.');
    } finally {
      setIsConverting(false);
    }
  };

  const resetTool = () => {
    setSelectedPDF(null);
    setPages([]);
    setIsConverting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">PDF to Photo Converter</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert PDF pages into individual image files. Each page will be converted to a separate image that you can download.
          </p>
        </div>

        <div className="space-y-8">
          {/* File Upload Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileSelection(file);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="space-y-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m6 0h6m-6 6v6m0-6V6a2 2 0 012-2h4a2 2 0 012 2v6m0 0h6m-6 6v6m6-6h6a2 2 0 012 2v4a2 2 0 01-2 2h-6m-6-6v6m0-6H9m6 6H9a2 2 0 01-2-2v-4a2 2 0 012-2h6" />
                </svg>
                <div>
                  <p className="text-lg font-medium text-gray-900">Click to upload PDF</p>
                  <p className="text-sm text-gray-500">or drag and drop a PDF file here</p>
                  <p className="text-xs text-gray-400 mt-2">Maximum file size: 50MB</p>
                </div>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => handleFileSelection(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>

          {/* Conversion Settings */}
          {selectedPDF && !isConverting && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as 'png' | 'jpeg')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="png">PNG (High Quality)</option>
                    <option value="jpeg">JPEG (Smaller Size)</option>
                  </select>
                </div>
                {outputFormat === 'jpeg' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality ({Math.round(quality * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution Scale ({scale}x)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.5"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleFileSelection(selectedPDF)}
                  className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors duration-200 font-semibold"
                >
                  Convert to Images
                </button>
                <button
                  onClick={resetTool}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200 font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isConverting && (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Converting PDF pages to images...</p>
            </div>
          )}

          {/* Results */}
          {pages.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Converted Pages ({pages.length})
                </h3>
                <button
                  onClick={downloadAllImages}
                  disabled={isConverting}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  Download All as ZIP
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((pageImage, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <img
                      src={pageImage}
                      alt={`Page ${index + 1}`}
                      className="w-full h-48 object-contain bg-gray-50 rounded mb-3"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Page {index + 1}</span>
                      <button
                        onClick={() => downloadImage(pageImage, index + 1)}
                        className="bg-primary text-white py-1 px-3 rounded text-sm hover:bg-secondary transition-colors duration-200"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 