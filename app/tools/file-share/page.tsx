
"use client";
import React, { useState, useRef, useEffect } from 'react';

interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string; // base64 encoded file data
  uploadedAt: string;
}

// IndexedDB helper functions
const DB_NAME = 'FileShareDB';
const DB_VERSION = 1;
const STORE_NAME = 'files';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const getAllFiles = async (): Promise<SharedFile[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const saveFile = async (file: SharedFile): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(file);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

const deleteFile = async (fileId: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(fileId);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

const clearAllFiles = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export default function FileShare() {
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from IndexedDB on component mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const files = await getAllFiles();
      setSharedFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const newFiles: SharedFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (limit to 50MB to prevent issues)
        if (file.size > 50 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 50MB.`);
          continue;
        }
        
        // Convert file to base64
        const reader = new FileReader();
        const fileData = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        
        const sharedFile: SharedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          data: fileData,
          uploadedAt: new Date().toISOString()
        };
        
        // Save to IndexedDB
        await saveFile(sharedFile);
        newFiles.push(sharedFile);
      }
      
      setSharedFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    }
    
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const downloadFile = (file: SharedFile) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      setSharedFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📁';
  };

  const handleClearAllFiles = async () => {
    if (confirm('Are you sure you want to clear all shared files?')) {
      try {
        await clearAllFiles();
        setSharedFiles([]);
      } catch (error) {
        console.error('Error clearing files:', error);
        alert('Error clearing files. Please try again.');
      }
    }
  };

  // Get current IP for sharing
  const getNetworkUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4">Local Network File Share</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share files easily within your local network. Upload files to make them available for download by others on the same network.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-500'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isUploading ? 'Uploading...' : 'Click to upload files or drag and drop'}
                </p>
                <p className="text-sm text-gray-500">
                  Share any file type with others on your network (Max 50MB per file)
                </p>
              </div>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Network Information */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-blue-800">Network Sharing Info</h3>
          </div>
          <p className="text-blue-700 mt-2 text-sm">
            Files uploaded here are stored in your browser using IndexedDB and accessible to anyone who visits this page on the same network. 
            Share this URL with others: <span className="font-mono bg-white px-2 py-1 rounded">{getNetworkUrl()}</span>
          </p>
        </div>

        {/* Shared Files */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Shared Files ({sharedFiles.length})
            </h2>
            {sharedFiles.length > 0 && (
              <button
                onClick={handleClearAllFiles}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {sharedFiles.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 mt-4">No files shared yet</p>
              <p className="text-sm text-gray-400">Upload files to share them with others on your network</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sharedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadFile(file)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete file"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Sharing Files:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Upload files by clicking or dragging them</li>
                <li>• Files are stored using IndexedDB (better for large files)</li>
                <li>• Share this page URL with others</li>
                <li>• Maximum 50MB per file</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Accessing Files:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Others can download files from this page</li>
                <li>• Files persist until browser data is cleared</li>
                <li>• Works within the same local network</li>
                <li>• Much larger storage capacity than localStorage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
