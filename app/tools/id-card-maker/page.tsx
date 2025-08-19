
"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface Translations {
  [key: string]: string;
}

const translations: Record<string, Translations> = {
  en: {
    idCardMaker: "Professional ID Card Designer",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    employeeId: "Employee ID",
    designation: "Designation",
    department: "Department",
    email: "Email Address",
    phone: "Phone Number",
    bloodGroup: "Blood Group",
    emergencyContact: "Emergency Contact",
    address: "Address",
    uploadPhoto: "Upload Photo",
    selectTemplate: "Select Template",
    template1: "Corporate Blue",
    template2: "Modern Green",
    template3: "Classic Red",
    template4: "Professional Purple",
    cardSettings: "Card Settings",
    cardSize: "Card Size",
    standardSize: "Standard (85.60 × 53.98 mm)",
    creditCardSize: "Credit Card Size",
    customSize: "Custom Size",
    width: "Width (mm)",
    height: "Height (mm)",
    backgroundColor: "Background Color",
    textColor: "Text Color",
    fontSize: "Font Size",
    fontFamily: "Font Family",
    preview: "Preview Card",
    downloadCard: "Download ID Card",
    resetForm: "Reset Form",
    frontSide: "Front Side",
    backSide: "Back Side",
    companyLogo: "Company Logo",
    companyName: "Company Name",
    validUntil: "Valid Until",
    signature: "Authorized Signature",
    qrCode: "QR Code",
    includeQrCode: "Include QR Code",
    qrCodeData: "QR Code Data",
    instructions: "Create professional ID cards with our advanced designer. Upload photos, customize designs, and generate high-quality cards for your organization.",
    dragDropPhoto: "Drag & drop photo here or click to upload",
    supportedFormats: "Supported formats: JPG, PNG, GIF (Max 5MB)",
    photoUploaded: "Photo uploaded successfully!",
    fillRequiredFields: "Please fill in all required fields",
    downloadSuccess: "ID card downloaded successfully!",
    about: "About",
    services: "Services", 
    contact: "Contact",
    onlineTools: "Online Tools",
    allRightsReserved: "All rights reserved.",
    jansevakendra: "Jan Seva Kendra Private",
    designTips: "Design Tips",
    qualityAssurance: "Quality Assurance",
    professionalFeatures: "Professional Features"
  },
  gu: {
    idCardMaker: "વ્યાવસાયિક આઈડી કાર્ડ ડિઝાઈનર",
    personalInfo: "વ્યક્તિગત માહિતી",
    fullName: "પૂરું નામ",
    employeeId: "કર્મચારી આઈડી",
    designation: "હોદ્દો",
    department: "વિભાગ",
    email: "ઈમેઇલ સરનામું",
    phone: "ફોન નંબર",
    bloodGroup: "બ્લડ ગ્રૂપ",
    emergencyContact: "ઈમર્જન્સી સંપર્ક",
    address: "સરનામું",
    uploadPhoto: "ફોટો અપલોડ કરો",
    selectTemplate: "ટેમ્પલેટ પસંદ કરો",
    template1: "કોર્પોરેટ બ્લૂ",
    template2: "આધુનિક ગ્રીન",
    template3: "ક્લાસિક રેડ",
    template4: "વ્યાવસાયિક પર્પલ",
    cardSettings: "કાર્ડ સેટિંગ્સ",
    cardSize: "કાર્ડ સાઈઝ",
    standardSize: "સ્ટાન્ડર્ડ (85.60 × 53.98 mm)",
    creditCardSize: "ક્રેડિટ કાર્ડ સાઈઝ",
    customSize: "કસ્ટમ સાઈઝ",
    width: "પહોળાઈ (mm)",
    height: "ઊંચાઈ (mm)",
    backgroundColor: "બેકગ્રાઉન્ડ કલર",
    textColor: "ટેક્સ્ટ કલર",
    fontSize: "ફોન્ટ સાઈઝ",
    fontFamily: "ફોન્ટ ફેમિલી",
    preview: "કાર્ડ પ્રિવ્યૂ",
    downloadCard: "આઈડી કાર્ડ ડાઉનલોડ કરો",
    resetForm: "ફોર્મ રીસેટ કરો",
    frontSide: "આગળની બાજુ",
    backSide: "પાછળની બાજુ",
    companyLogo: "કંપની લોગો",
    companyName: "કંપની નામ",
    validUntil: "માન્ય સુધી",
    signature: "અધિકૃત સહી",
    qrCode: "QR કોડ",
    includeQrCode: "QR કોડ સામેલ કરો",
    qrCodeData: "QR કોડ ડેટા",
    instructions: "અમારા અદ્યતન ડિઝાઈનર સાથે વ્યાવસાયિક આઈડી કાર્ડ બનાવો. ફોટો અપલોડ કરો, ડિઝાઈન કસ્ટમાઈઝ કરો અને તમારી સંસ્થા માટે ઉચ્ચ ગુણવત્તાવાળા કાર્ડ જનરેટ કરો.",
    dragDropPhoto: "ફોટો અહીં ખેંચો અને મૂકો અથવા અપલોડ કરવા માટે ક્લિક કરો",
    supportedFormats: "સપોર્ટેડ ફોર્મેટ: JPG, PNG, GIF (મેક્સ 5MB)",
    photoUploaded: "ફોટો સફળતાપૂર્વક અપલોડ થયો!",
    fillRequiredFields: "કૃપા કરીને બધા જરૂરી ફીલ્ડ ભરો",
    downloadSuccess: "આઈડી કાર્ડ સફળતાપૂર્વક ડાઉનલોડ થયો!",
    about: "અમારા વિશે",
    services: "સેવાઓ",
    contact: "સંપર્ક કરો",
    onlineTools: "ઓનલાઈન સાધનો",
    allRightsReserved: "બધા અધિકારો સુરક્ષિત છે.",
    jansevakendra: "જન સેવા કેન્દ્ર પ્રાઈવેટ",
    designTips: "ડિઝાઈન સૂચનો",
    qualityAssurance: "ગુણવત્તા ખાતરી",
    professionalFeatures: "વ્યાવસાયિક સુવિધાઓ"
  }
};

interface CardData {
  fullName: string;
  employeeId: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  bloodGroup: string;
  emergencyContact: string;
  address: string;
  photo: string;
  companyName: string;
  companyLogo: string;
  validUntil: string;
  includeQrCode: boolean;
  qrCodeData: string;
}

interface CardSettings {
  template: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  width: number;
  height: number;
}

const templates = {
  template1: {
    name: "Corporate Blue",
    primaryColor: "#1e3a8a",
    secondaryColor: "#3b82f6",
    accentColor: "#ffffff",
    description: "Professional blue theme for corporate environments"
  },
  template2: {
    name: "Modern Green",
    primaryColor: "#064e3b",
    secondaryColor: "#10b981",
    accentColor: "#ffffff",
    description: "Fresh green design for modern organizations"
  },
  template3: {
    name: "Classic Red",
    primaryColor: "#991b1b",
    secondaryColor: "#ef4444",
    accentColor: "#ffffff",
    description: "Traditional red theme for established institutions"
  },
  template4: {
    name: "Professional Purple",
    primaryColor: "#581c87",
    secondaryColor: "#8b5cf6",
    accentColor: "#ffffff",
    description: "Elegant purple design for premium organizations"
  }
};

export default function IdCardMaker() {
  const [language, setLanguage] = useState('en');
  const [cardData, setCardData] = useState<CardData>({
    fullName: '',
    employeeId: '',
    designation: '',
    department: '',
    email: '',
    phone: '',
    bloodGroup: '',
    emergencyContact: '',
    address: '',
    photo: '',
    companyName: '',
    companyLogo: '',
    validUntil: '',
    includeQrCode: false,
    qrCodeData: ''
  });

  const [cardSettings, setCardSettings] = useState<CardSettings>({
    template: 'template1',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontSize: 12,
    fontFamily: 'Inter',
    width: 85.6,
    height: 53.98
  });

  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language as keyof typeof translations];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        setCardData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file under 5MB');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        setCardData(prev => ({ ...prev, companyLogo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRCode = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data)}`;
  };

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const requiredFields = ['fullName', 'employeeId', 'designation', 'department'];
    const missingFields = requiredFields.filter(field => !cardData[field as keyof CardData]);
    
    if (missingFields.length > 0) {
      alert(t.fillRequiredFields);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (convert mm to pixels at 300 DPI)
    const dpi = 300;
    const pixelWidth = (cardSettings.width / 25.4) * dpi;
    const pixelHeight = (cardSettings.height / 25.4) * dpi;
    
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;

    // Clear canvas
    ctx.fillStyle = cardSettings.backgroundColor;
    ctx.fillRect(0, 0, pixelWidth, pixelHeight);

    // Get template colors
    const template = templates[cardSettings.template as keyof typeof templates];

    // Draw template background with rounded corners
    const gradient = ctx.createLinearGradient(0, 0, pixelWidth, 0);
    gradient.addColorStop(0, template.primaryColor);
    gradient.addColorStop(1, template.secondaryColor);
    ctx.fillStyle = gradient;
    
    // Rounded header
    ctx.beginPath();
    ctx.roundRect(0, 0, pixelWidth, pixelHeight * 0.35, [20, 20, 0, 0]);
    ctx.fill();

    // Company name with better typography
    if (cardData.companyName) {
      ctx.fillStyle = template.accentColor;
      ctx.font = `bold ${cardSettings.fontSize * 5}px ${cardSettings.fontFamily}`;
      ctx.textAlign = 'center';
      const textWidth = ctx.measureText(cardData.companyName).width;
      if (textWidth > pixelWidth - 80) {
        ctx.font = `bold ${cardSettings.fontSize * 4}px ${cardSettings.fontFamily}`;
      }
      ctx.fillText(cardData.companyName, pixelWidth / 2, 100);
    }

    // Professional border
    ctx.strokeStyle = template.primaryColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, pixelWidth - 8, pixelHeight - 8);

    // Employee details with better spacing
    ctx.fillStyle = cardSettings.textColor;
    ctx.font = `${cardSettings.fontSize * 3}px ${cardSettings.fontFamily}`;
    ctx.textAlign = 'left';
    
    const startY = pixelHeight * 0.42;
    const lineHeight = cardSettings.fontSize * 4.5;
    const leftMargin = 50;
    
    // Enhanced text rendering
    ctx.font = `600 ${cardSettings.fontSize * 3.5}px ${cardSettings.fontFamily}`;
    ctx.fillText(cardData.fullName, leftMargin, startY);
    
    ctx.font = `${cardSettings.fontSize * 2.8}px ${cardSettings.fontFamily}`;
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`ID: ${cardData.employeeId}`, leftMargin, startY + lineHeight * 0.8);
    ctx.fillText(cardData.designation, leftMargin, startY + lineHeight * 1.4);
    ctx.fillText(cardData.department, leftMargin, startY + lineHeight * 2);
    
    if (cardData.email) {
      ctx.fillText(cardData.email, leftMargin, startY + lineHeight * 2.6);
    }

    // Professional photo with shadow effect
    const photoX = pixelWidth - 220;
    const photoY = startY - 30;
    const photoSize = 180;

    if (cardData.photo) {
      const img = new Image();
      img.onload = () => {
        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoSize, photoSize, 15);
        ctx.clip();
        ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
        ctx.restore();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Photo border
        ctx.strokeStyle = template.primaryColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoSize, photoSize, 15);
        ctx.stroke();
        
        // Download after photo is drawn
        const link = document.createElement('a');
        link.download = `id-card-${cardData.fullName.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      };
      img.src = cardData.photo;
    } else {
      // Professional photo placeholder
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(photoX, photoY, photoSize, photoSize);
      
      // Camera icon placeholder
      ctx.fillStyle = '#94a3b8';
      ctx.font = `${cardSettings.fontSize * 6}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('📷', photoX + photoSize/2, photoY + photoSize/2 + 20);
      
      // Download immediately if no photo
      const link = document.createElement('a');
      link.download = `id-card-${cardData.fullName.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  const resetForm = () => {
    setCardData({
      fullName: '',
      employeeId: '',
      designation: '',
      department: '',
      email: '',
      phone: '',
      bloodGroup: '',
      emergencyContact: '',
      address: '',
      photo: '',
      companyName: '',
      companyLogo: '',
      validUntil: '',
      includeQrCode: false,
      qrCodeData: ''
    });
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0v2m0 6h.01"/>
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t.idCardMaker}
              </h1>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto text-base leading-relaxed">
              {t.instructions}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  {t.personalInfo}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.fullName} <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={cardData.fullName}
                      onChange={(e) => setCardData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.employeeId} <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={cardData.employeeId}
                      onChange={(e) => setCardData(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter employee ID"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.designation} <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={cardData.designation}
                      onChange={(e) => setCardData(prev => ({ ...prev, designation: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter designation"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.department} <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={cardData.department}
                      onChange={(e) => setCardData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter department"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.email}</label>
                    <input
                      type="email"
                      value={cardData.email}
                      onChange={(e) => setCardData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.phone}</label>
                    <input
                      type="tel"
                      value={cardData.phone}
                      onChange={(e) => setCardData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.companyName}</label>
                    <input
                      type="text"
                      value={cardData.companyName}
                      onChange={(e) => setCardData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.validUntil}</label>
                    <input
                      type="date"
                      value={cardData.validUntil}
                      onChange={(e) => setCardData(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="mt-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">{t.uploadPhoto}</label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    {cardData.photo ? (
                      <div className="space-y-3">
                        <img src={cardData.photo} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-xl shadow-lg" />
                        <p className="text-green-600 font-semibold">{t.photoUploaded}</p>
                        <p className="text-sm text-gray-500">Click to change photo</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">{t.dragDropPhoto}</p>
                          <p className="text-sm text-gray-500 mt-1">{t.supportedFormats}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
                  </svg>
                  {t.selectTemplate}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(templates).map(([key, template]) => (
                    <div
                      key={key}
                      onClick={() => setCardSettings(prev => ({ ...prev, template: key }))}
                      className={`p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg ${
                        cardSettings.template === key 
                          ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div 
                        className="w-full h-16 rounded-lg mb-4 shadow-sm"
                        style={{ 
                          background: `linear-gradient(135deg, ${template.primaryColor}, ${template.secondaryColor})`
                        }}
                      />
                      <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      {cardSettings.template === key && (
                        <div className="mt-3 flex items-center text-blue-600">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Selected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {t.cardSettings}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">{t.fontSize}</label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="8"
                        max="20"
                        value={cardSettings.fontSize}
                        onChange={(e) => setCardSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Small</span>
                        <span className="font-medium text-blue-600">{cardSettings.fontSize}px</span>
                        <span>Large</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">{t.fontFamily}</label>
                    <select
                      value={cardSettings.fontFamily}
                      onChange={(e) => setCardSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="Inter">Inter (Modern)</option>
                      <option value="Arial">Arial (Classic)</option>
                      <option value="Times New Roman">Times New Roman (Traditional)</option>
                      <option value="Helvetica">Helvetica (Professional)</option>
                      <option value="Georgia">Georgia (Elegant)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                {t.preview}
              </button>
              <button
                onClick={downloadCard}
                className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                {t.downloadCard}
              </button>
              <button
                onClick={resetForm}
                className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {t.resetForm}
              </button>
            </div>
          </div>

          {/* Preview and Tips Section */}
          <div className="space-y-6">
            {/* Preview */}
            {showPreview && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    {t.preview}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex justify-center">
                    <div 
                      className="border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
                      style={{
                        width: `${cardSettings.width * 4}px`,
                        height: `${cardSettings.height * 4}px`,
                        backgroundColor: cardSettings.backgroundColor,
                        maxWidth: '100%'
                      }}
                    >
                      <div 
                        className="w-full h-1/3 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${templates[cardSettings.template as keyof typeof templates].primaryColor}, ${templates[cardSettings.template as keyof typeof templates].secondaryColor})`
                        }}
                      >
                        {cardData.companyName && (
                          <p 
                            className="font-bold text-white text-center px-4"
                            style={{ fontSize: `${Math.max(cardSettings.fontSize, 8)}px` }}
                          >
                            {cardData.companyName}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex h-2/3 p-3">
                        <div className="flex-1 space-y-1">
                          <p style={{ fontSize: `${Math.max(cardSettings.fontSize - 2, 6)}px`, color: cardSettings.textColor }} className="font-semibold">
                            {cardData.fullName || 'Full Name'}
                          </p>
                          <p style={{ fontSize: `${Math.max(cardSettings.fontSize - 4, 5)}px`, color: '#6b7280' }}>
                            ID: {cardData.employeeId || 'Employee ID'}
                          </p>
                          <p style={{ fontSize: `${Math.max(cardSettings.fontSize - 4, 5)}px`, color: cardSettings.textColor }}>
                            {cardData.designation || 'Designation'}
                          </p>
                          <p style={{ fontSize: `${Math.max(cardSettings.fontSize - 4, 5)}px`, color: cardSettings.textColor }}>
                            {cardData.department || 'Department'}
                          </p>
                        </div>
                        
                        <div className="w-20 h-24 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                          {cardData.photo ? (
                            <img src={cardData.photo} alt="ID" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-2xl">📷</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Features */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {t.professionalFeatures}
              </h3>
              <ul className="text-sm text-blue-700 space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✨</span>
                  <span>High-resolution 300 DPI output for professional printing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🎨</span>
                  <span>Multiple professional templates with modern design</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">📱</span>
                  <span>Mobile-responsive interface for any device</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🔒</span>
                  <span>Secure processing - no data stored on servers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">⚡</span>
                  <span>Instant preview and download functionality</span>
                </li>
              </ul>
            </div>

            {/* Design Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                {t.designTips}
              </h3>
              <ul className="text-sm text-amber-700 space-y-2">
                <li>• Use high-quality photos (300x400px recommended)</li>
                <li>• Ensure all text is clearly readable</li>
                <li>• Choose templates that match your brand colors</li>
                <li>• Print on high-quality cardstock (250-300 GSM)</li>
                <li>• Consider lamination for durability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hidden Canvas for Image Generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">{t.jansevakendra}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Professional digital services for modern organizations. Creating quality solutions with cutting-edge technology.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">{t.onlineTools}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/tools" className="text-gray-300 hover:text-white transition-colors">All Tools</Link></li>
                <li><Link href="/tools/photo-crop" className="text-gray-300 hover:text-white transition-colors">Photo Crop</Link></li>
                <li><Link href="/tools/resume-maker" className="text-gray-300 hover:text-white transition-colors">Resume Maker</Link></li>
                <li><Link href="/tools/qr-code-generator" className="text-gray-300 hover:text-white transition-colors">QR Generator</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">{t.contact}</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Professional Support Available</p>
                <p>Quality Assured Services</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 {t.jansevakendra}. {t.allRightsReserved}
            </p>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {language === 'en' ? 'ગુજરાતી' : 'English'}
              </button>
              
              <Link
                href="/tools"
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
              >
                ← Back to Tools
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
