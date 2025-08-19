
"use client";
import React, { useState, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Sliders } from 'lucide-react';

interface CompressedImage {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  reduction: number;
  preview: string;
}

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const compressImage = useCallback(async (file: File): Promise<CompressedImage> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reduction = ((file.size - blob.size) / file.size) * 100;
              resolve({
                original: file,
                compressed: blob,
                originalSize: file.size,
                compressedSize: blob.size,
                reduction,
                preview: canvas.toDataURL('image/jpeg', quality / 100)
              });
            }
          },
          'image/jpeg',
          quality / 100
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, [quality, maxWidth, maxHeight]);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    
    setIsProcessing(true);
    const newImages: CompressedImage[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file);
        newImages.push(compressed);
      }
    }
    
    setImages(prev => [...prev, ...newImages]);
    setIsProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const downloadImage = (image: CompressedImage, index: number) => {
    const url = URL.createObjectURL(image.compressed);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed-${image.original.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => downloadImage(image, index), index * 100);
    });
  };

  const clearAll = () => {
    setImages([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Compressor</h1>
          <p className="text-lg text-gray-600">Reduce image file sizes without losing quality</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compression Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Width (px)
                </label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Height (px)
                </label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-8 ${
              dragOver 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Images
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop images here, or click to select
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
            >
              Select Images
            </label>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="text-center mb-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Compressing images...</p>
            </div>
          )}

          {/* Results */}
          {images.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Compressed Images ({images.length})
                </h3>
                <div className="space-x-3">
                  <button
                    onClick={downloadAll}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </button>
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <img
                        src={image.preview}
                        alt={`Compressed ${image.original.name}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 truncate">
                        {image.original.name}
                      </h4>
                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Original:</span>
                          <span>{formatFileSize(image.originalSize)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Compressed:</span>
                          <span>{formatFileSize(image.compressedSize)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-green-600">
                          <span>Saved:</span>
                          <span>{image.reduction.toFixed(1)}%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadImage(image, index)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
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
