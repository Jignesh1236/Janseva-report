
"use client";
import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';

export default function PhotoToPDF() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Legal'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    setSelectedImages(imageFiles);

    // Create preview URLs
    const urls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedImages(newImages);
    setPreviewUrls(newUrls);
  };

  const convertToPDF = async () => {
    if (selectedImages.length === 0) return;

    setIsConverting(true);

    try {
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize.toLowerCase()
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        
        if (i > 0) {
          pdf.addPage();
        }

        // Create image element to get dimensions
        const img = new Image();
        const imageDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        await new Promise<void>((resolve) => {
          img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;

            // Calculate dimensions to fit the page while maintaining aspect ratio
            const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
            const width = imgWidth * ratio;
            const height = imgHeight * ratio;

            // Center the image on the page
            const x = (pageWidth - width) / 2;
            const y = (pageHeight - height) / 2;

            pdf.addImage(imageDataUrl, 'JPEG', x, y, width, height);
            resolve();
          };
          img.src = imageDataUrl;
        });
      }

      pdf.save('photos-to-pdf.pdf');
    } catch (error) {
      console.error('Error converting to PDF:', error);
      alert('Error converting images to PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const clearAll = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setPreviewUrls([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Photo to PDF Converter</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert multiple photos into a single PDF document. Upload images and customize the PDF settings.
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
                handleFileSelection(e.dataTransfer.files);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="space-y-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-lg font-medium text-gray-900">Click to upload photos</p>
                  <p className="text-sm text-gray-500">or drag and drop multiple images here</p>
                  <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, GIF, WebP</p>
                </div>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelection(e.target.files)}
              className="hidden"
            />
          </div>

          {/* PDF Settings */}
          {selectedImages.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">PDF Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as 'A4' | 'Letter' | 'Legal')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Selected Images ({selectedImages.length})
                </h3>
                <button
                  onClick={clearAll}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{selectedImages[index].name}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={convertToPDF}
                disabled={isConverting}
                className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-secondary transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConverting ? 'Converting...' : 'Convert to PDF'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
