"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Translations } from '../types/translations';
import AIChat from '../components/AIChat';

// Import translations
const translations: Record<string, Translations> = {
  en: {
    about: "About", services: "Services", contact: "Contact", visitCenter: "Visit Our Center", onlineTools: "Online Tools", ourServices: "Our Services", helpingYou: "Helping You, Every Step of the Way", needAssistance: "Need Assistance?", youCan: "You can:", callUsAt: "Call us at:", orVisit: "Or visit our center today!", contactUs: "Contact Us", quickLinks: "Quick Links", followUs: "Follow Us", allRightsReserved: "All rights reserved.", loading: "Loading...", jansevakendra: "Jan Seva Kendra Private", photoCropTool: "ID Card Photo Crop Tool", uploadFront: "Upload Front Side Image", uploadBack: "Upload Back Side Image", cropFront: "Crop Front Side", cropBack: "Crop Back Side", download: "Download Combined Image", reset: "Reset", instructions: "Upload the front and back images of your ID card and crop them. The tool will then combine them for download.", uploadImageInstruction: "Please upload an image.", cropImageInstruction: "Adjust the crop box and click 'Crop'.", frontSide: "Front Side", backSide: "Back Side", combinedPreview: "Combined Cropped Image Preview", cropBothSides: "Please crop both sides to see the combined preview and download.",
    resumeMakerTool: "Professional Resume Maker",
    personalInformation: "Personal Information",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    linkedinPortfolio: "LinkedIn/Portfolio URL",
    summaryObjective: "Summary/Objective",
    summaryPlaceholder: "Write a brief summary or objective for your resume.",
    workExperience: "Work Experience",
    jobTitle: "Job Title",
    company: "Company",
    location: "Location",
    startDate: "Start Date",
    endDate: "End Date",
    responsibilities: "Responsibilities/Achievements",
    addExperience: "Add Experience",
    education: "Education",
    degree: "Degree/Diploma",
    institution: "Institution",
    graduationDate: "Graduation Date",
    addEducation: "Add Education",
    skills: "Skills",
    skillName: "Skill Name",
    addSkill: "Add Skill",
    generateResume: "Generate Resume",
    serviceManagementTool: "Service Management Tool",
    photoshopOnlineTool: "Photoshop Online",
    textCaseConverter: "Text Case Converter",
    urlEncoderTool: "URL Encoder/Decoder",
    imageToTextTool: "Image to Text Extractor",
    idCardMaker: "ID Card Maker"
  },
  gu: {
    about: "અમારા વિશે", services: "સેવાઓ", contact: "સંપર્ક કરો", visitCenter: "અમારા કેન્દ્રની મુલાકાત લો", onlineTools: "ઓનલાઈન સાધનો", ourServices: "અમારી સેવાઓ", helpingYou: "દરેક પગલે તમારી સાથે", needAssistance: "સહાયની જરૂર છે?", youCan: "તમે કરી શકો છો:", callUsAt: "અમને કૉલ કરો:", orVisit: "અથવા આજે જ અમારા કેન્દ્રની મુલાકાત લો!", contactUs: "સંપર્ક કરો", quickLinks: "ઝડપી લિંક્સ", followUs: "અમને ફોલો કરો", allRightsReserved: "બધા અધિકારો સુરક્ષિત છે.", loading: "લોડ થઈ રહ્યું છે...", jansevakendra: "જન સેવા કેન્દ્ર પ્રાઇવેટ", photoCropTool: "આઈડી કાર્ડ ફોટો ક્રોપ ટૂલ", uploadFront: "ફ્રન્ટ સાઈડ ઇમેજ અપલોડ કરો", uploadBack: "બેક સાઈડ ઇમેજ અપલોડ કરો", cropFront: "ફ્રન્ટ સાઈડ ક્રોપ કરો", cropBack: "બેક સાઈડ ક્રોપ કરો", download: "કમ્બાઈન્ડ ઇમેજ ડાઉનલોડ કરો", reset: "રીસેટ કરો", instructions: "તમારા આઈડી કાર્ડની ફ્રન્ટ અને બેક ઇમેજ અપલોડ કરો અને ક્રોપ કરો. ટૂલ પછી તેમને ડાઉનલોડ કરવા માટે કમ્બાઈન્ડ કરશે.", uploadImageInstruction: "કૃપા કરીને એક ઇમેજ અપલોડ કરો.", cropImageInstruction: "ક્રોપ બોક્સને એડજસ્ટ કરો અને 'ક્રોપ' પર ક્લિક કરો.", frontSide: "ફ્રન્ટ સાઈડ", backSide: "બેક સાઈડ", combinedPreview: "ક્રોપ કરેલ કમ્બાઈન્ડ ઇમેજ પ્રિવ્યૂ", cropBothSides: "કમ્બાઈન્ડ પ્રિવ્યૂ અને ડાઉનલોડ જોવા માટે બંને બાજુ ક્રોપ કરો.",
    resumeMakerTool: "વ્યાવસાયિક રિઝ્યુમ મેકર",
    personalInformation: "વ્યક્તિગત માહિતી",
    fullName: "પૂરું નામ",
    email: "ઇમેઇલ",
    phone: "ફોન નંબર",
    linkedinPortfolio: "લિંક્ડઇન/પોર્ટફોલિયો URL",
    summaryObjective: "સારાંશ/ઉદ્દેશ્ય",
    summaryPlaceholder: "તમારા રિઝ્યુમ માટે સંક્ષિપ્ત સારાંશ અથવા ઉદ્દેશ્ય લખો.",
    workExperience: "કાર્ય અનુભવ",
    jobTitle: "પદ",
    company: "કંપની",
    location: "સ્થાન",
    startDate: "શરૂઆત તારીખ",
    endDate: "અંત તારીખ",
    responsibilities: "જવાબદારીઓ/સિદ્ધિઓ",
    addExperience: "અનુભવ ઉમેરો",
    education: "શિક્ષણ",
    degree: "ડિગ્રી/ડિપ્લોમા",
    institution: "સંસ્થા",
    graduationDate: "ગ્રેજ્યુએશન તારીખ",
    addEducation: "શિક્ષણ ઉમેરો",
    skills: "કુશળતા",
    skillName: "કુશળતાનું નામ",
    addSkill: "કુશળતા ઉમેરો",
    generateResume: "રિઝ્યુમ બનાવો",
    serviceManagementTool: "સેવા વિવર્ધન ટૂલ",
    photoshopOnlineTool: "ફોટોશોપ ઓનલાઈન",
    textCaseConverter: "ટેક્સ્ટ કેસ કન્વર્ટર",
    urlEncoderTool: "URL એન્કોડર/ડિકોડર",
    imageToTextTool: "ઇમેજ થી ટેક્સ્ટ એક્સ્ટ્રેક્ટર",
    idCardMaker: "આઈડી કાર્ડ મેકર"
  }
};

interface Tool {
  name: string;
  description: string;
  path: string;
  icon: string;
  category: string;
  popular?: boolean;
}

// Floating AI Help Widget
function AIHelpWidget() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
        aria-label="AI Help"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <span className="font-bold text-lg">🤖</span>
        )}
      </button>
      {open && (
        <div className="fixed z-50 bottom-24 right-6 w-80 max-w-full">
          <AIChat />
        </div>
      )}
    </>
  );
}

export default function OnlineTools() {
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const t = translations[language as keyof typeof translations];

  const tools: Tool[] = [
    { 
      name: t.resumeMakerTool, 
      description: 'Create professional resumes with customizable templates',
      path: '/tools/resume-maker', 
      icon: '📄', 
      category: 'Documents',
      popular: true
    },
    { 
      name: t.idCardMaker, 
      description: 'Create professional ID cards with customizable templates and designs',
      path: '/tools/id-card-maker', 
      icon: '🆔', 
      category: 'Documents',
      popular: true
    },
    { 
      name: t.photoCropTool, 
      description: 'Crop and edit ID card photos with precision tools',
      path: '/tools/photo-crop', 
      icon: '✂️', 
      category: 'Images',
      popular: true
    },
    { 
      name: 'QR Code Generator', 
      description: 'Generate QR codes for text, URLs, and more',
      path: '/tools/qr-code-generator', 
      icon: '📱', 
      category: 'Utilities'
    },
    { 
      name: 'Password Generator', 
      description: 'Create secure passwords with custom settings',
      path: '/tools/password-generator', 
      icon: '🔐', 
      category: 'Security',
      popular: true
    },
    { 
      name: 'Color Picker & Palette', 
      description: 'Pick colors and generate beautiful color palettes',
      path: '/tools/color-picker', 
      icon: '🎨', 
      category: 'Design'
    },
    { 
      name: 'Hash Generator', 
      description: 'Generate MD5, SHA-1, SHA-256 hashes for text',
      path: '/tools/hash-generator', 
      icon: '#️⃣', 
      category: 'Security'
    },
    { 
      name: 'Photo to PDF Converter', 
      description: 'Convert multiple photos into a single PDF document',
      path: '/tools/photo-to-pdf', 
      icon: '📸', 
      category: 'Converters'
    },
    { 
      name: 'PDF to Photo Converter', 
      description: 'Extract images from PDF files',
      path: '/tools/pdf-to-photo', 
      icon: '🖼️', 
      category: 'Converters'
    },
    { 
      name: 'Local Network File Share', 
      description: 'Share files across your local network easily',
      path: '/tools/file-share', 
      icon: '📂', 
      category: 'Utilities'
    },
    { 
      name: t.textCaseConverter, 
      description: 'Convert text between different cases',
      path: '/tools/text-case-converter', 
      icon: '📝', 
      category: 'Text'
    },
    { 
      name: t.urlEncoderTool, 
      description: 'Encode and decode URLs safely',
      path: '/tools/url-encoder', 
      icon: '🔗', 
      category: 'Utilities'
    },
    { 
      name: t.imageToTextTool, 
      description: 'Extract text from images using OCR',
      path: '/tools/image-to-text', 
      icon: '🔍', 
      category: 'Images'
    },
    { 
      name: t.photoshopOnlineTool, 
      description: 'Online photo editing with advanced features',
      path: '/tools/photoshop-online', 
      icon: '🖌️', 
      category: 'Images'
    },
    { 
      name: 'PDF Merger', 
      description: 'Combine multiple PDF files into one document',
      path: '/tools/pdf-merger', 
      icon: '📑', 
      category: 'Documents',
      popular: true
    },
    { 
      name: 'Image Compressor', 
      description: 'Reduce image file sizes without losing quality',
      path: '/tools/image-compressor', 
      icon: '🗜️', 
      category: 'Images'
    },
    { 
      name: 'Base64 Encoder/Decoder', 
      description: 'Encode and decode Base64 strings',
      path: '/tools/base64-converter', 
      icon: '🔤', 
      category: 'Utilities'
    },
    { 
      name: 'JSON Formatter', 
      description: 'Format, validate and beautify JSON data',
      path: '/tools/json-formatter', 
      icon: '📊', 
      category: 'Utilities'
    },
    { 
      name: 'Timestamp Converter', 
      description: 'Convert between timestamps and readable dates',
      path: '/tools/timestamp-converter', 
      icon: '⏰', 
      category: 'Utilities'
    },
    { 
      name: 'Lorem Ipsum Generator', 
      description: 'Generate placeholder text for designs',
      path: '/tools/lorem-ipsum', 
      icon: '📝', 
      category: 'Text'
    },
    { 
      name: 'Word Counter', 
      description: 'Count words, characters, and paragraphs',
      path: '/tools/word-counter', 
      icon: '📊', 
      category: 'Text'
    },
    { 
      name: 'Expense Calculator', 
      description: 'Calculate and track your expenses',
      path: '/tools/expense-calculator', 
      icon: '💰', 
      category: 'Finance'
    },
    { 
      name: 'Unit Converter', 
      description: 'Convert between different units of measurement',
      path: '/tools/unit-converter', 
      icon: '🔄', 
      category: 'Utilities'
    },
    { 
      name: 'Screen Recorder', 
      description: 'Record your screen activities',
      path: '/tools/screen-recorder', 
      icon: '🎥', 
      category: 'Utilities'
    },
    { 
      name: 'Voice Recorder', 
      description: 'Record and download audio files',
      path: '/tools/voice-recorder', 
      icon: '🎤', 
      category: 'Utilities'
    },
    { 
      name: 'Invoice Generator', 
      description: 'Create professional invoices',
      path: '/tools/invoice-generator', 
      icon: '🧾', 
      category: 'Documents',
      popular: true
    },
    { 
      name: 'Barcode Generator', 
      description: 'Generate various types of barcodes',
      path: '/tools/barcode-generator', 
      icon: '⬛', 
      category: 'Utilities'
    },
    { 
      name: 'Weather App', 
      description: 'Check weather conditions and forecasts',
      path: '/tools/weather', 
      icon: '🌤️', 
      category: 'Utilities'
    },
    { 
      name: 'Calculator', 
      description: 'Scientific calculator with advanced functions',
      path: '/tools/calculator', 
      icon: '🧮', 
      category: 'Utilities'
    },
    { 
      name: 'Age Calculator', 
      description: 'Calculate exact age and important dates',
      path: '/tools/age-calculator', 
      icon: '🎂', 
      category: 'Utilities'
    },
    { 
      name: 'EMI Calculator', 
      description: 'Calculate loan EMI and interest',
      path: '/tools/emi-calculator', 
      icon: '🏦', 
      category: 'Finance'
    },
    { 
      name: 'Gradient Generator', 
      description: 'Create CSS gradients visually',
      path: '/tools/gradient-generator', 
      icon: '🌈', 
      category: 'Design'
    },
    { 
      name: 'CSS Beautifier', 
      description: 'Format and beautify CSS code',
      path: '/tools/css-beautifier', 
      icon: '🎨', 
      category: 'Design'
    },
  ];

  const categories = ['All', ...Array.from(new Set(tools.map(tool => tool.category))).sort()];

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, tools]);

  const popularTools = tools.filter(tool => tool.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* AI Help Floating Button and Chat */}
      <AIHelpWidget />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t.onlineTools}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive collection of professional-grade online tools designed to streamline your workflow and boost productivity.
          </p>
        </div>

        <div className="space-y-8">
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-95">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white text-primary shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white text-primary shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Tools Section */}
            {selectedCategory === 'All' && searchTerm === '' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-3">⭐</span>
                  <h2 className="text-2xl font-bold text-gray-800">Popular Tools</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularTools.map((tool, index) => (
                    <Link key={index} href={tool.path}>
                      <div className="p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 cursor-pointer group hover:shadow-md hover:border-primary/30">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                            {tool.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors duration-200 truncate">
                              {tool.name}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">{tool.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tools Grid/List */}
            <div className="bg-white p-6 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-95">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory === 'All' ? 'All Tools' : `${selectedCategory} Tools`}
                  <span className="text-lg font-normal text-gray-500 ml-2">
                    ({filteredTools.length})
                  </span>
                </h2>
              </div>

              {filteredTools.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.02-5.709-2.709A7.965 7.965 0 014 9c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8a7.965 7.965 0 01-2.709-.709z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No tools found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or filters</p>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }>
                  {filteredTools.map((tool, index) => (
                    <Link key={index} href={tool.path}>
                      <div className={`
                        group cursor-pointer transition-all duration-300 hover:shadow-lg
                        ${viewMode === 'grid' 
                          ? 'p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 hover:border-primary/30 hover:-translate-y-1' 
                          : 'flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary/30'
                        }
                      `}>
                        {viewMode === 'grid' ? (
                          <div className="text-center space-y-4">
                            <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                              {tool.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-200 mb-2">
                                {tool.name}
                              </h3>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {tool.description}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                {tool.category}
                              </span>
                              {tool.popular && (
                                <span className="text-xs text-yellow-600">⭐ Popular</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-3xl mr-4 group-hover:scale-110 transition-transform duration-200">
                              {tool.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-200">
                                  {tool.name}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  {tool.popular && (
                                    <span className="text-xs text-yellow-600">⭐</span>
                                  )}
                                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                    {tool.category}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                {tool.description}
                              </p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 border-t border-primary/30 mt-12 rounded-t-2xl shadow-2xl">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                &copy; 2025 {t.jansevakendra}. {t.allRightsReserved}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Empowering productivity with modern web tools
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:from-secondary hover:to-primary transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {language === 'en' ? 'ગુજરાતી' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
