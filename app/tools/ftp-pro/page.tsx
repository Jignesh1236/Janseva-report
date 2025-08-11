"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Download, 
  Share2, 
  X, 
  Copy, 
  Check,
  FileText,
  Trash2,
  Eye,
  ExternalLink,
  AlertCircle,
  Clock
} from 'lucide-react';

interface FileData {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
  mimeType: string;
  data: string; // base64 encoded file data
  preview?: string;
  shareLink: string;
  uploaded: Date;
  expiresAt: Date;
}

// Storage key for localStorage
const STORAGE_KEY = 'fileshare_files';
const FILE_EXPIRY_HOURS = 24; // Files expire after 24 hours

function App() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from localStorage on component mount
  useEffect(() => {
    loadFilesFromStorage();
    
    // Check if we're accessing a shared file
    const urlParams = new URLSearchParams(window.location.search);
    const fileId = urlParams.get('file');
    
    if (fileId) {
      const sharedFile = getFileFromStorage(fileId);
      if (sharedFile && !isFileExpired(sharedFile)) {
        setDownloadingFile(sharedFile);
      }
    }
  }, []);

  const loadFilesFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedFiles: FileData[] = JSON.parse(stored);
        // Filter out expired files
        const validFiles = parsedFiles.filter(file => !isFileExpired(file));
        setFiles(validFiles);
        
        // Update storage if we removed expired files
        if (validFiles.length !== parsedFiles.length) {
          saveFilesToStorage(validFiles);
        }
      }
    } catch (error) {
      console.error('Error loading files from storage:', error);
    }
  };

  const saveFilesToStorage = (filesToSave: FileData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filesToSave));
    } catch (error) {
      console.error('Error saving files to storage:', error);
      // Handle storage quota exceeded
      if (error instanceof DOMException && error.code === 22) {
        alert('Storage quota exceeded. Please remove some files.');
      }
    }
  };

  const getFileFromStorage = (fileId: string): FileData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const files: FileData[] = JSON.parse(stored);
        return files.find(f => f.id === fileId) || null;
      }
    } catch (error) {
      console.error('Error getting file from storage:', error);
    }
    return null;
  };

  const isFileExpired = (file: FileData): boolean => {
    return new Date() > new Date(file.expiresAt);
  };

  const getFileType = (file: File): FileData['type'] => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'document';
    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return 'archive';
    return 'other';
  };

  const getFileIcon = (type: FileData['type']) => {
    switch (type) {
      case 'image': return <Image className="w-8 h-8" />;
      case 'video': return <Video className="w-8 h-8" />;
      case 'audio': return <Music className="w-8 h-8" />;
      case 'document': return <FileText className="w-8 h-8" />;
      case 'archive': return <Archive className="w-8 h-8" />;
      default: return <File className="w-8 h-8" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateShareLink = (fileId: string): string => {
    return `${window.location.origin}${window.location.pathname}?file=${fileId}`;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const processFiles = useCallback(async (fileList: FileList) => {
    setIsLoading(true);
    const newFiles: FileData[] = [];
    
    try {
      for (const file of Array.from(fileList)) {
        // Check file size (limit to 10MB for localStorage)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
          continue;
        }

        const id = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        const type = getFileType(file);
        const data = await fileToBase64(file);
        const now = new Date();
        const expiresAt = new Date(now.getTime() + FILE_EXPIRY_HOURS * 60 * 60 * 1000);
        
        const fileData: FileData = {
          id,
          name: file.name,
          size: file.size,
          type,
          mimeType: file.type,
          data,
          shareLink: generateShareLink(id),
          uploaded: now,
          expiresAt
        };

        // Create preview for images
        if (type === 'image') {
          fileData.preview = data;
        }

        newFiles.push(fileData);
      }

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      saveFilesToStorage(updatedFiles);
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [files]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const copyShareLink = async (fileId: string, shareLink: string) => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopiedId(fileId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const downloadFile = (fileData: FileData) => {
    try {
      const blob = base64ToBlob(fileData.data, fileData.mimeType);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    saveFilesToStorage(updatedFiles);
    
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  const openFilePreview = (file: FileData) => {
    setSelectedFile(file);
  };

  const closeDownloadModal = () => {
    setDownloadingFile(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const getTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const timeLeft = new Date(expiresAt).getTime() - now.getTime();
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m`;
    } else if (minutesLeft > 0) {
      return `${minutesLeft}m`;
    } else {
      return 'Expired';
    }
  };

  // If we're showing a shared file download, render that instead
  if (downloadingFile) {
    const isExpired = isFileExpired(downloadingFile);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isExpired ? 'bg-red-100' : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}>
              {isExpired ? (
                <AlertCircle className="w-8 h-8 text-red-600" />
              ) : (
                <Download className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isExpired ? 'File Expired' : 'Download File'}
            </h1>
            <p className="text-gray-600">
              {isExpired ? 'This file is no longer available' : 'Someone shared a file with you'}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-gray-400">
                {getFileIcon(downloadingFile.type)}
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 truncate">{downloadingFile.name}</h3>
                <p className="text-sm text-gray-600">{formatFileSize(downloadingFile.size)}</p>
                {!isExpired && (
                  <div className="flex items-center space-x-1 text-xs text-orange-600 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Expires in {getTimeRemaining(downloadingFile.expiresAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {!isExpired ? (
              <button
                onClick={() => downloadFile(downloadingFile)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Download File
              </button>
            ) : (
              <div className="w-full px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-medium cursor-not-allowed">
                File No Longer Available
              </div>
            )}
            <button
              onClick={closeDownloadModal}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              {isExpired ? 'Go Back' : 'Cancel'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span>Files expire after 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FileShare Pro
                </h1>
                <p className="text-gray-600 text-sm">Share files instantly and securely</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {files.length} file{files.length !== 1 ? 's' : ''} shared
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className={`p-6 rounded-full transition-all duration-300 ${
                    dragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Upload className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {dragActive ? 'Drop files here' : 'Drag & drop files here'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Support for all file types • Max 10MB per file • Files expire in 24h
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? 'Processing...' : 'Choose Files'}
                    </button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Shared Files</h2>
                  <p className="text-gray-600 mt-1">Manage and share your uploaded files</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {files.map((fileData) => {
                    const isExpired = isFileExpired(fileData);
                    return (
                      <div key={fileData.id} className={`p-6 transition-colors duration-200 ${
                        isExpired ? 'bg-red-50 opacity-75' : 'hover:bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex-shrink-0 text-gray-400">
                              {getFileIcon(fileData.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {fileData.name}
                                </h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  fileData.type === 'image' ? 'bg-green-100 text-green-800' :
                                  fileData.type === 'video' ? 'bg-red-100 text-red-800' :
                                  fileData.type === 'audio' ? 'bg-purple-100 text-purple-800' :
                                  fileData.type === 'document' ? 'bg-blue-100 text-blue-800' :
                                  fileData.type === 'archive' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {fileData.type}
                                </span>
                                {isExpired && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                    Expired
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 mt-1">
                                <p className="text-sm text-gray-600">{formatFileSize(fileData.size)}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(fileData.uploaded).toLocaleDateString()}
                                </p>
                                {!isExpired && (
                                  <div className="flex items-center space-x-1 text-xs text-orange-600">
                                    <Clock className="w-3 h-3" />
                                    <span>{getTimeRemaining(fileData.expiresAt)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openFilePreview(fileData)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Preview"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => downloadFile(fileData)}
                              disabled={isExpired}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Download"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => copyShareLink(fileData.id, fileData.shareLink)}
                              disabled={isExpired}
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Copy Share Link"
                            >
                              {copiedId === fileData.id ? (
                                <Check className="w-5 h-5 text-green-600" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => removeFile(fileData.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Remove"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Files</span>
                  <span className="font-semibold text-gray-900">{files.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Size</span>
                  <span className="font-semibold text-gray-900">
                    {formatFileSize(files.reduce((total, f) => total + f.size, 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Links</span>
                  <span className="font-semibold text-gray-900">
                    {files.filter(f => !isFileExpired(f)).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Persistent file storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Working share links</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">File preview</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">24-hour expiry</span>
                </div>
              </div>
            </div>

            {/* File Types */}
            {files.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">File Types</h3>
                <div className="space-y-3">
                  {['image', 'video', 'audio', 'document', 'archive', 'other'].map(type => {
                    const count = files.filter(f => f.type === type).length;
                    if (count === 0) return null;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="text-gray-400">
                            {getFileIcon(type as FileData['type'])}
                          </div>
                          <span className="text-gray-600 text-sm capitalize">{type}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* How it works */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600">1.</span>
                  <span>Upload files (max 10MB each)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600">2.</span>
                  <span>Files are stored in browser storage</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600">3.</span>
                  <span>Share the generated link with anyone</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600">4.</span>
                  <span>Files expire after 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="text-gray-400">
                  {getFileIcon(selectedFile.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedFile.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{formatFileSize(selectedFile.size)}</span>
                    {!isFileExpired(selectedFile) && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <Clock className="w-3 h-3" />
                        <span>Expires in {getTimeRemaining(selectedFile.expiresAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {selectedFile.type === 'image' && selectedFile.preview && (
                <img 
                  src={selectedFile.preview} 
                  alt={selectedFile.name}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              )}
              {selectedFile.type !== 'image' && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4 flex justify-center">
                    {getFileIcon(selectedFile.type)}
                  </div>
                  <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                  <button
                    onClick={() => downloadFile(selectedFile)}
                    disabled={isFileExpired(selectedFile)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isFileExpired(selectedFile) ? 'File Expired' : 'Download File'}
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => downloadFile(selectedFile)}
                    disabled={isFileExpired(selectedFile)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => copyShareLink(selectedFile.id, selectedFile.shareLink)}
                    disabled={isFileExpired(selectedFile)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {copiedId === selectedFile.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedId === selectedFile.id ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
                <div className="text-sm text-gray-500 max-w-xs truncate">
                  <ExternalLink className="w-4 h-4 inline mr-1" />
                  {selectedFile.shareLink}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
