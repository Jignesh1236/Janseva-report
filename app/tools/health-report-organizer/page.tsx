
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HealthReport {
  id: string;
  name: string;
  date: string;
  type: string;
  doctor: string;
  hospital: string;
  notes: string;
  files: FileData[];
  tags: string[];
}

interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64 encoded
}

export default function HealthReportOrganizer() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null);
  const [newReport, setNewReport] = useState<Omit<HealthReport, 'id'>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    type: 'blood-test',
    doctor: '',
    hospital: '',
    notes: '',
    files: [],
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  const reportTypes = [
    'blood-test',
    'x-ray',
    'mri',
    'ct-scan',
    'ultrasound',
    'ecg',
    'prescription',
    'discharge-summary',
    'vaccination',
    'other'
  ];

  useEffect(() => {
    // Load reports from localStorage
    const savedReports = localStorage.getItem('healthReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  useEffect(() => {
    // Save reports to localStorage
    localStorage.setItem('healthReports', JSON.stringify(reports));
  }, [reports]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData: FileData = {
          id: Date.now().toString() + Math.random().toString(36),
          name: file.name,
          type: file.type,
          size: file.size,
          data: event.target?.result as string
        };

        setNewReport(prev => ({
          ...prev,
          files: [...prev.files, fileData]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (fileId: string) => {
    setNewReport(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !newReport.tags.includes(newTag.trim())) {
      setNewReport(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setNewReport(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addReport = () => {
    if (!newReport.name.trim()) {
      alert('Please enter a report name');
      return;
    }

    const report: HealthReport = {
      ...newReport,
      id: Date.now().toString()
    };

    setReports(prev => [report, ...prev]);
    setNewReport({
      name: '',
      date: new Date().toISOString().split('T')[0],
      type: 'blood-test',
      doctor: '',
      hospital: '',
      notes: '',
      files: [],
      tags: []
    });
    setShowAddForm(false);
  };

  const deleteReport = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(prev => prev.filter(r => r.id !== id));
      if (selectedReport?.id === id) {
        setSelectedReport(null);
      }
    }
  };

  const downloadFile = (file: FileData) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  const exportReports = () => {
    const dataStr = JSON.stringify(reports, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health-reports-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || report.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Report Organizer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Organize and manage all your medical reports, prescriptions, and health documents in one place
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Filters & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search & Filter */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {reportTypes.map(type => (
                    <option key={type} value={type}>
                      {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="space-y-3">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="w-full bg-teal-600 text-white px-4 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
                >
                  + Add New Report
                </button>
                <button
                  onClick={exportReports}
                  className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                >
                  Export All Reports
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Reports:</span>
                  <span className="font-medium">{reports.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>This Month:</span>
                  <span className="font-medium">
                    {reports.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Files:</span>
                  <span className="font-medium">
                    {reports.reduce((acc, r) => acc + r.files.length, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Panel - Reports List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Report Form */}
            {showAddForm && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Report</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Report Name"
                    value={newReport.name}
                    onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={newReport.date}
                      onChange={(e) => setNewReport(prev => ({ ...prev, date: e.target.value }))}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <select
                      value={newReport.type}
                      onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value }))}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {reportTypes.map(type => (
                        <option key={type} value={type}>
                          {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Doctor Name"
                      value={newReport.doctor}
                      onChange={(e) => setNewReport(prev => ({ ...prev, doctor: e.target.value }))}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Hospital/Clinic"
                      value={newReport.hospital}
                      onChange={(e) => setNewReport(prev => ({ ...prev, hospital: e.target.value }))}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    placeholder="Notes"
                    value={newReport.notes}
                    onChange={(e) => setNewReport(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows={3}
                  />

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <button
                        onClick={addTag}
                        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newReport.tags.map(tag => (
                        <span key={tag} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm flex items-center">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-teal-600 hover:text-teal-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Files</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    {newReport.files.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {newReport.files.map(file => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="text-sm">
                              <span className="font-medium">{file.name}</span>
                              <span className="text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                            </div>
                            <button
                              onClick={() => removeFile(file.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={addReport}
                      className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                    >
                      Add Report
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reports List */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Health Reports ({filteredReports.length})
              </h3>
              {filteredReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No reports found</p>
                  <p className="text-sm">Add your first health report to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredReports.map(report => (
                    <div 
                      key={report.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedReport?.id === report.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{report.name}</h4>
                          <div className="text-sm text-gray-500 mt-1">
                            <span>{new Date(report.date).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{report.type.replace('-', ' ')}</span>
                            {report.doctor && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Dr. {report.doctor}</span>
                              </>
                            )}
                          </div>
                          {report.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {report.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {report.files.length} file{report.files.length !== 1 ? 's' : ''}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteReport(report.id);
                            }}
                            className="text-red-600 hover:text-red-800 text-sm mt-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Report Details */}
          <div className="lg:col-span-1">
            {selectedReport ? (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800">{selectedReport.name}</h4>
                    <p className="text-sm text-gray-500">{new Date(selectedReport.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type:</label>
                    <p className="capitalize">{selectedReport.type.replace('-', ' ')}</p>
                  </div>
                  
                  {selectedReport.doctor && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Doctor:</label>
                      <p>Dr. {selectedReport.doctor}</p>
                    </div>
                  )}
                  
                  {selectedReport.hospital && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Hospital/Clinic:</label>
                      <p>{selectedReport.hospital}</p>
                    </div>
                  )}
                  
                  {selectedReport.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Notes:</label>
                      <p className="text-sm whitespace-pre-wrap">{selectedReport.notes}</p>
                    </div>
                  )}
                  
                  {selectedReport.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tags:</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedReport.tags.map(tag => (
                          <span key={tag} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedReport.files.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Files:</label>
                      <div className="space-y-2 mt-2">
                        {selectedReport.files.map(file => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="text-sm">
                              <div className="font-medium">{file.name}</div>
                              <div className="text-gray-500">({formatFileSize(file.size)})</div>
                            </div>
                            <button
                              onClick={() => downloadFile(file)}
                              className="text-teal-600 hover:text-teal-800 text-sm"
                            >
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Select a report to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
