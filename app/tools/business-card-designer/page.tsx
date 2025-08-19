
"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  logo: string;
  secondaryTitle: string;
  socialMedia: {
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
  qrCode: string;
}

interface CardSettings {
  template: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontSize: number;
  cardStyle: 'standard' | 'premium' | 'creative';
  includeQR: boolean;
  orientation: 'horizontal' | 'vertical';
  fontFamily: string;
}

export default function BusinessCardDesigner() {
  const [cardData, setCardData] = useState<BusinessCardData>({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    logo: '',
    secondaryTitle: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: ''
    },
    qrCode: ''
  });

  const [settings, setSettings] = useState<CardSettings>({
    template: 'modern',
    primaryColor: '#2563eb',
    secondaryColor: '#f3f4f6',
    textColor: '#1f2937',
    fontSize: 14,
    cardStyle: 'standard',
    includeQR: false,
    orientation: 'horizontal',
    fontFamily: 'Arial'
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates = [
    { 
      id: 'modern', 
      name: 'Modern Professional', 
      description: 'Clean and contemporary design',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      colors: { primary: '#667eea', secondary: '#f8fafc', text: '#1e293b' }
    },
    { 
      id: 'classic', 
      name: 'Classic Business', 
      description: 'Traditional and elegant',
      preview: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      colors: { primary: '#3b82f6', secondary: '#f1f5f9', text: '#0f172a' }
    },
    { 
      id: 'creative', 
      name: 'Creative Bold', 
      description: 'Artistic and eye-catching',
      preview: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      colors: { primary: '#f59e0b', secondary: '#fef3c7', text: '#451a03' }
    },
    { 
      id: 'minimal', 
      name: 'Minimal Clean', 
      description: 'Simple and sophisticated',
      preview: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)',
      colors: { primary: '#6b7280', secondary: '#f9fafb', text: '#111827' }
    },
    { 
      id: 'luxury', 
      name: 'Luxury Gold', 
      description: 'Premium and luxurious',
      preview: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
      colors: { primary: '#d4af37', secondary: '#1a1a1a', text: '#ffffff' }
    },
    { 
      id: 'tech', 
      name: 'Tech Gradient', 
      description: 'Modern tech aesthetic',
      preview: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      colors: { primary: '#8b5cf6', secondary: '#f0f9ff', text: '#0c4a6e' }
    }
  ];

  const fontFamilies = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Trebuchet MS', 'Impact'
  ];

  const colorPresets = [
    { name: 'Ocean Blue', primary: '#2563eb', secondary: '#dbeafe' },
    { name: 'Forest Green', primary: '#059669', secondary: '#d1fae5' },
    { name: 'Royal Purple', primary: '#7c3aed', secondary: '#e5d4ff' },
    { name: 'Sunset Orange', primary: '#ea580c', secondary: '#fed7aa' },
    { name: 'Rose Pink', primary: '#e11d48', secondary: '#fce7f3' },
    { name: 'Midnight Black', primary: '#1f2937', secondary: '#f3f4f6' }
  ];

  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform: keyof BusinessCardData['socialMedia'], value: string) => {
    setCardData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  const handleSettingsChange = (field: keyof CardSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSettings(prev => ({
        ...prev,
        template: templateId,
        primaryColor: template.colors.primary,
        secondaryColor: template.colors.secondary,
        textColor: template.colors.text
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('फाइल का साइज 5MB से कम होना चाहिए');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCardData(prev => ({ ...prev, logo: e.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRCode = () => {
    const qrData = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.name}
ORG:${cardData.company}
TITLE:${cardData.title}
EMAIL:${cardData.email}
TEL:${cardData.phone}
URL:${cardData.website}
ADR:${cardData.address}
END:VCARD`;
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    setCardData(prev => ({ ...prev, qrCode: qrUrl }));
  };

  const drawBusinessCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on orientation
    if (settings.orientation === 'horizontal') {
      canvas.width = 1050;
      canvas.height = 600;
    } else {
      canvas.width = 600;
      canvas.height = 1050;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw based on template
    switch (settings.template) {
      case 'modern':
        drawModernTemplate(ctx);
        break;
      case 'classic':
        drawClassicTemplate(ctx);
        break;
      case 'creative':
        drawCreativeTemplate(ctx);
        break;
      case 'minimal':
        drawMinimalTemplate(ctx);
        break;
      case 'luxury':
        drawLuxuryTemplate(ctx);
        break;
      case 'tech':
        drawTechTemplate(ctx);
        break;
      default:
        drawModernTemplate(ctx);
    }
  };

  const drawModernTemplate = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    
    // Background
    ctx.fillStyle = settings.secondaryColor;
    ctx.fillRect(0, 0, width, height);

    // Left accent panel
    const gradient = ctx.createLinearGradient(0, 0, width * 0.4, height);
    gradient.addColorStop(0, settings.primaryColor);
    gradient.addColorStop(1, adjustColor(settings.primaryColor, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width * 0.4, height);

    // Text content on right side
    const textX = width * 0.45;
    
    // Name
    ctx.fillStyle = settings.textColor;
    ctx.font = `bold ${settings.fontSize + 10}px ${settings.fontFamily}`;
    ctx.fillText(cardData.name || 'Your Name', textX, 120);

    // Title
    ctx.fillStyle = settings.primaryColor;
    ctx.font = `${settings.fontSize + 4}px ${settings.fontFamily}`;
    ctx.fillText(cardData.title || 'Your Title', textX, 160);
    
    if (cardData.secondaryTitle) {
      ctx.fillText(cardData.secondaryTitle, textX, 190);
    }

    // Company
    ctx.fillStyle = settings.textColor;
    ctx.font = `bold ${settings.fontSize + 2}px ${settings.fontFamily}`;
    ctx.fillText(cardData.company || 'Company Name', textX, 230);

    // Contact info
    ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;
    let yPos = 280;
    
    if (cardData.email) {
      ctx.fillText(`📧 ${cardData.email}`, textX, yPos);
      yPos += 30;
    }
    if (cardData.phone) {
      ctx.fillText(`📞 ${cardData.phone}`, textX, yPos);
      yPos += 30;
    }
    if (cardData.website) {
      ctx.fillText(`🌐 ${cardData.website}`, textX, yPos);
    }

    // Logo - draw after text to avoid async issues
    if (cardData.logo) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          // Clear logo area first
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(40, 40, 120, 80);
          
          // Draw logo with proper scaling
          const logoAspect = img.width / img.height;
          let logoWidth = 120;
          let logoHeight = 80;
          
          if (logoAspect > 1.5) { // Wide logo
            logoHeight = logoWidth / logoAspect;
          } else if (logoAspect < 0.75) { // Tall logo
            logoWidth = logoHeight * logoAspect;
          }
          
          const logoX = 40 + (120 - logoWidth) / 2;
          const logoY = 40 + (80 - logoHeight) / 2;
          
          ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight);
        } catch (error) {
          console.error('Error drawing logo:', error);
        }
      };
      img.onerror = () => {
        console.error('Failed to load logo image');
      };
      img.src = cardData.logo;
    }

    // QR Code on left panel
    if (settings.includeQR && cardData.qrCode) {
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => {
        try {
          ctx.drawImage(qrImg, 40, height - 160, 120, 120);
        } catch (error) {
          console.error('Error drawing QR code:', error);
        }
      };
      qrImg.onerror = () => {
        console.error('Failed to load QR code');
      };
      qrImg.src = cardData.qrCode;
    }
  };

  const drawClassicTemplate = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Border with rounded corners
    ctx.strokeStyle = settings.primaryColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(20, 20, width - 40, height - 40, 15);
    ctx.stroke();

    // Header section background
    ctx.fillStyle = settings.primaryColor;
    ctx.fillRect(40, 40, width - 80, 120);

    // Name on header
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${settings.fontSize + 8}px ${settings.fontFamily}`;
    ctx.fillText(cardData.name || 'Your Name', 200, 90);

    // Title on header
    ctx.font = `${settings.fontSize + 2}px ${settings.fontFamily}`;
    ctx.fillText(cardData.title || 'Your Title', 200, 120);

    // Body content
    ctx.fillStyle = settings.textColor;
    ctx.font = `bold ${settings.fontSize + 4}px ${settings.fontFamily}`;
    ctx.fillText(cardData.company || 'Company Name', 60, 220);

    // Contact details
    ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;
    let yPos = 260;
    
    const contactInfo = [
      { icon: '📧', text: cardData.email },
      { icon: '📞', text: cardData.phone },
      { icon: '🌐', text: cardData.website },
      { icon: '📍', text: cardData.address }
    ].filter(item => item.text);

    contactInfo.forEach(item => {
      ctx.fillText(`${item.icon} ${item.text}`, 60, yPos);
      yPos += 35;
    });

    // Logo - improved loading
    if (cardData.logo) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const logoAspect = img.width / img.height;
          let logoWidth = 100;
          let logoHeight = 60;
          
          if (logoAspect > 1.67) {
            logoHeight = logoWidth / logoAspect;
          } else if (logoAspect < 1) {
            logoWidth = logoHeight * logoAspect;
          }
          
          const logoX = 60 + (100 - logoWidth) / 2;
          const logoY = 50 + (60 - logoHeight) / 2;
          
          ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight);
        } catch (error) {
          console.error('Error drawing logo:', error);
        }
      };
      img.onerror = () => {
        console.error('Failed to load logo image');
      };
      img.src = cardData.logo;
    }

    // QR Code
    if (settings.includeQR && cardData.qrCode) {
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => {
        try {
          ctx.drawImage(qrImg, width - 180, height - 180, 120, 120);
        } catch (error) {
          console.error('Error drawing QR code:', error);
        }
      };
      qrImg.onerror = () => {
        console.error('Failed to load QR code');
      };
      qrImg.src = cardData.qrCode;
    }
  };

  const drawCreativeTemplate = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    
    // Creative background with shapes
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, settings.primaryColor);
    gradient.addColorStop(0.5, settings.secondaryColor);
    gradient.addColorStop(1, settings.primaryColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(width - 100, 100, 80, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(100, height - 100, 60, 0, 2 * Math.PI);
    ctx.fill();

    // Main content area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(60, 80, width - 120, height - 160, 20);
    ctx.fill();

    // Name with creative styling
    ctx.fillStyle = settings.primaryColor;
    ctx.font = `bold ${settings.fontSize + 12}px ${settings.fontFamily}`;
    ctx.fillText(cardData.name || 'Your Name', 250, 160);

    // Title
    ctx.fillStyle = settings.textColor;
    ctx.font = `italic ${settings.fontSize + 4}px ${settings.fontFamily}`;
    ctx.fillText(cardData.title || 'Your Title', 250, 190);

    // Company
    ctx.font = `bold ${settings.fontSize + 2}px ${settings.fontFamily}`;
    ctx.fillText(cardData.company || 'Company Name', 250, 220);

    // Contact in creative layout
    ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;
    const contacts = [
      cardData.email,
      cardData.phone,
      cardData.website
    ].filter(Boolean);

    contacts.forEach((contact, index) => {
      const x = 100 + (index % 2) * 250;
      const y = 280 + Math.floor(index / 2) * 30;
      ctx.fillText(contact, x, y);
    });

    // Logo - improved loading
    if (cardData.logo) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const logoAspect = img.width / img.height;
          let logoWidth = 120;
          let logoHeight = 80;
          
          if (logoAspect > 1.5) {
            logoHeight = logoWidth / logoAspect;
          } else if (logoAspect < 0.75) {
            logoWidth = logoHeight * logoAspect;
          }
          
          const logoX = 100 + (120 - logoWidth) / 2;
          const logoY = 120 + (80 - logoHeight) / 2;
          
          ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight);
        } catch (error) {
          console.error('Error drawing logo:', error);
        }
      };
      img.onerror = () => {
        console.error('Failed to load logo image');
      };
      img.src = cardData.logo;
    }
  };

  const drawMinimalTemplate = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    
    // Clean white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Minimal accent line
    ctx.strokeStyle = settings.primaryColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(80, height / 2);
    ctx.lineTo(width - 80, height / 2);
    ctx.stroke();

    // Typography hierarchy
    ctx.fillStyle = settings.textColor;
    ctx.font = `300 ${settings.fontSize + 16}px ${settings.fontFamily}`;
    ctx.fillText(cardData.name || 'Your Name', 80, 150);

    ctx.font = `400 ${settings.fontSize + 4}px ${settings.fontFamily}`;
    ctx.fillText(cardData.title || 'Your Title', 80, 185);

    ctx.fillStyle = settings.primaryColor;
    ctx.font = `500 ${settings.fontSize + 2}px ${settings.fontFamily}`;
    ctx.fillText(cardData.company || 'Company Name', 80, 215);

    // Contact details below the line
    ctx.fillStyle = settings.textColor;
    ctx.font = `300 ${settings.fontSize}px ${settings.fontFamily}`;
    let yPos = height / 2 + 50;
    
    [cardData.email, cardData.phone, cardData.website].filter(Boolean).forEach(contact => {
      ctx.fillText(contact, 80, yPos);
      yPos += 30;
    });

    // Logo positioned top right - improved loading
    if (cardData.logo) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const logoAspect = img.width / img.height;
          let logoWidth = 120;
          let logoHeight = 80;
          
          if (logoAspect > 1.5) {
            logoHeight = logoWidth / logoAspect;
          } else if (logoAspect < 0.75) {
            logoWidth = logoHeight * logoAspect;
          }
          
          const logoX = width - 200 + (120 - logoWidth) / 2;
          const logoY = 60 + (80 - logoHeight) / 2;
          
          ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight);
        } catch (error) {
          console.error('Error drawing logo:', error);
        }
      };
      img.onerror = () => {
        console.error('Failed to load logo image');
      };
      img.src = cardData.logo;
    }
  };

  const drawLuxuryTemplate = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    
    // Luxury dark background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Gold border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(30, 30, width - 60, height - 60, 15);
    ctx.stroke();

    // Inner decoration
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(50, 50, width - 100, height - 100, 10);
    ctx.stroke();

    // Luxury typography
    ctx.fillStyle = '#d4af37';
    ctx.font = `bold ${settings.fontSize + 12}px ${settings.fontFamily}`;
    ctx.fillText(cardData.name || 'Your Name', 80, 140);

    ctx.fillStyle = '#ffffff';
    ctx.font = `italic ${settings.fontSize + 6}px ${settings.fontFamily}`;
    ctx.fillText(cardData.title || 'Your Title', 80, 180);

    ctx.font = `${settings.fontSize + 3}px ${settings.fontFamily}`;
    ctx.fillText(cardData.company || 'Company Name', 80, 215);

    // Contact section
    ctx.fillStyle = '#d4af37';
    ctx.font = `${settings.fontSize + 1}px ${settings.fontFamily}`;
    let yPos = height - 200;
    
    [cardData.email, cardData.phone, cardData.website].filter(Boolean).forEach(contact => {
      ctx.fillText(contact, 80, yPos);
      yPos += 35;
    });

    // Logo - improved loading
    if (cardData.logo) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const logoAspect = img.width / img.height;
          let logoWidth = 130;
          let logoHeight = 85;
          
          if (logoAspect > 1.53) {
            logoHeight = logoWidth / logoAspect;
          } else if (logoAspect < 1) {
            logoWidth = logoHeight * logoAspect;
          }
          
          const logoX = width - 200 + (130 - logoWidth) / 2;
          const logoY = 70 + (85 - logoHeight) / 2;
          
          ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight);
        } catch (error) {
          console.error('Error drawing logo:', error);
        }
      };
      img.onerror = () => {
        console.error('Failed to load logo image');
      };
      img.src = cardData.logo;
    }
  };

  const drawTechTemplate = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    
    // Tech gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, settings.primaryColor);
    gradient.addColorStop(1, adjustColor(settings.primaryColor, -30));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Tech pattern overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (width / 8), 0);
      ctx.lineTo(i * (width / 8), height);
      ctx.stroke();
    }

    // Card overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(50, 50, width - 100, height - 100, 20);
    ctx.fill();

    // Modern typography
    ctx.fillStyle = settings.textColor;
    ctx.font = `600 ${settings.fontSize + 10}px ${settings.fontFamily}`;
    ctx.fillText(cardData.name || 'Your Name', 250, 130);

    ctx.fillStyle = settings.primaryColor;
    ctx.font = `400 ${settings.fontSize + 4}px ${settings.fontFamily}`;
    ctx.fillText(cardData.title || 'Your Title', 250, 165);

    ctx.fillStyle = settings.textColor;
    ctx.font = `500 ${settings.fontSize + 1}px ${settings.fontFamily}`;
    ctx.fillText(cardData.company || 'Company Name', 250, 195);

    // Tech-style contact info
    ctx.font = `400 ${settings.fontSize}px ${settings.fontFamily}`;
    let yPos = 250;
    
    [cardData.email, cardData.phone, cardData.website].filter(Boolean).forEach(contact => {
      ctx.fillText(`→ ${contact}`, 80, yPos);
      yPos += 30;
    });

    // Logo - improved loading
    if (cardData.logo) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const logoAspect = img.width / img.height;
          let logoWidth = 130;
          let logoHeight = 85;
          
          if (logoAspect > 1.53) {
            logoHeight = logoWidth / logoAspect;
          } else if (logoAspect < 1) {
            logoWidth = logoHeight * logoAspect;
          }
          
          const logoX = 80 + (130 - logoWidth) / 2;
          const logoY = 80 + (85 - logoHeight) / 2;
          
          ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight);
        } catch (error) {
          console.error('Error drawing logo:', error);
        }
      };
      img.onerror = () => {
        console.error('Failed to load logo image');
      };
      img.src = cardData.logo;
    }
  };

  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      drawBusinessCard();
    }, 100);
    return () => clearTimeout(timer);
  }, [cardData, settings]);

  useEffect(() => {
    if (settings.includeQR && (cardData.name || cardData.email || cardData.phone)) {
      generateQRCode();
    }
  }, [settings.includeQR, cardData.name, cardData.email, cardData.phone, cardData.website]);

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!cardData.name || !cardData.email) {
      alert('कृपया नाम और ईमेल भरें');
      return;
    }

    const link = document.createElement('a');
    link.download = `business-card-${cardData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const saveAsTemplate = () => {
    const templateData = {
      cardData,
      settings,
      timestamp: new Date().toISOString()
    };
    const dataStr = JSON.stringify(templateData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `business-card-template-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const templateData = JSON.parse(e.target?.result as string);
          setCardData(templateData.cardData);
          setSettings(templateData.settings);
          alert('Template loaded successfully!');
        } catch (error) {
          alert('Invalid template file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎨 प्रोफेशनल बिज़नेस कार्ड डिज़ाइनर</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced business card designer with professional templates, QR codes, and customization options
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Panel - Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="राज कुमार शर्मा"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Title *</label>
                  <input
                    type="text"
                    value={cardData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Managing Director"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Title</label>
                  <input
                    type="text"
                    value={cardData.secondaryTitle}
                    onChange={(e) => handleInputChange('secondaryTitle', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="& Founder"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={cardData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Tech Solutions Pvt. Ltd."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={cardData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="raj@techsolutions.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={cardData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={cardData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="www.techsolutions.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={cardData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Mumbai, Maharashtra"
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Company Logo
              </h2>
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors duration-200 flex flex-col items-center justify-center group bg-gray-50 hover:bg-blue-50"
                >
                  {cardData.logo ? (
                    <div className="space-y-3">
                      <img src={cardData.logo} alt="Logo Preview" className="h-20 w-20 object-contain rounded-lg" />
                      <p className="text-green-600 font-semibold">Logo uploaded successfully!</p>
                      <p className="text-sm text-gray-500">Click to change logo</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Click to upload logo</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, SVG up to 5MB</p>
                        <p className="text-xs text-gray-400 mt-1">Recommended: 300x200px for best quality</p>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                Choose Template
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-5 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                      settings.template === template.id
                        ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div 
                      className="w-full h-20 rounded-lg mb-4 shadow-sm"
                      style={{ background: template.preview }}
                    />
                    <h3 className="font-semibold text-gray-800 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    {settings.template === template.id && (
                      <div className="flex items-center text-blue-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Design Settings */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                Design Customization
              </h2>
              <div className="space-y-6">
                {/* Quick Color Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quick Color Schemes</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          handleSettingsChange('primaryColor', preset.primary);
                          handleSettingsChange('secondaryColor', preset.secondary);
                        }}
                        className="flex items-center p-3 border rounded-xl hover:shadow-md transition-all hover:scale-105"
                      >
                        <div className="flex mr-3">
                          <div 
                            className="w-5 h-5 rounded-l border border-gray-200"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div 
                            className="w-5 h-5 rounded-r border border-gray-200"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                        <span className="text-sm font-medium">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                    <select
                      value={settings.fontFamily}
                      onChange={(e) => handleSettingsChange('fontFamily', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      {fontFamilies.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                    <select
                      value={settings.orientation}
                      onChange={(e) => handleSettingsChange('orientation', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="horizontal">Horizontal (Standard)</option>
                      <option value="vertical">Vertical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Font Size: {settings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={settings.fontSize}
                    onChange={(e) => handleSettingsChange('fontSize', parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Advanced Options</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Include QR Code</span>
                      <p className="text-xs text-gray-500">Add a QR code with your contact details</p>
                    </div>
                    <button
                      onClick={() => handleSettingsChange('includeQR', !settings.includeQR)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.includeQR ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          settings.includeQR ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview & Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                Live Preview
              </h2>
              <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-md mx-auto border border-gray-300 rounded-lg shadow-sm bg-white"
                  style={{ aspectRatio: settings.orientation === 'horizontal' ? '1.75/1' : '1/1.75' }}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={downloadCard}
                  disabled={!cardData.name || !cardData.email}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Business Card
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={saveAsTemplate}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Save Template
                  </button>
                  <label className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center text-sm font-medium cursor-pointer shadow-md hover:shadow-lg">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Load Template
                    <input
                      type="file"
                      accept=".json"
                      onChange={loadTemplate}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Tips & Guidelines */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Professional Tips
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Use high contrast colors for better readability</li>
                <li>• Keep essential information only - avoid clutter</li>
                <li>• Upload logo in PNG format for transparency</li>
                <li>• QR codes help in quick contact sharing</li>
                <li>• Choose fonts that match your brand personality</li>
                <li>• Standard business card size: 3.5" × 2"</li>
                <li>• Print on 300gsm cardstock for premium feel</li>
              </ul>
            </div>

            {/* Card Specifications */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Card Specifications
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• <strong>Dimensions:</strong> 3.5" × 2" (89mm × 51mm)</p>
                <p>• <strong>Resolution:</strong> 300 DPI for print quality</p>
                <p>• <strong>Format:</strong> High-quality PNG</p>
                <p>• <strong>Color Mode:</strong> RGB</p>
                <p>• <strong>Template:</strong> {templates.find(t => t.id === settings.template)?.name}</p>
                <p>• <strong>Orientation:</strong> {settings.orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
