"use client";
import React, { useState, useRef, useCallback } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Translations } from '../../types/translations';

// Translation dictionary
const translations: Record<string, Translations> = {
  en: {
    about: "About",
    services: "Services",
    contact: "Contact",
    visitCenter: "Visit Our Center",
    onlineTools: "Online Tools",
    ourServices: "Our Services",
    helpingYou: "Helping You, Every Step of the Way",
    needAssistance: "Need Assistance?",
    youCan: "You can:",
    callUsAt: "Call us at:",
    orVisit: "Or visit our center today!",
    contactUs: "Contact Us",
    quickLinks: "Quick Links",
    followUs: "Follow Us",
    allRightsReserved: "All rights reserved.",
    loading: "Loading...",
    jansevakendra: "Jansevakendra",
    photoCropTool: "Advanced Photo Cropping Tool",
    uploadFront: "Upload Front Side Image",
    uploadBack: "Upload Back Side Image",
    cropFront: "Crop Front Side",
    cropBack: "Crop Back Side",
    download: "Download Combined Image",
    reset: "Reset",
    instructions: "Advanced photo cropping tool with multiple features including aspect ratios, filters, and bulk processing.",
    uploadImageInstruction: "Please upload an image.",
    cropImageInstruction: "Adjust the crop box and click 'Crop'.",
    frontSide: "Front Side",
    backSide: "Back Side",
    combinedPreview: "Combined Cropped Image Preview",
    cropBothSides: "Please crop both sides to see the combined preview and download.",
    singleImageCrop: "Single Image Crop",
    multiImageCrop: "Multi Image Crop",
    idCardCrop: "ID Card Crop",
    passportCrop: "Passport Photo Crop",
    aspectRatio: "Aspect Ratio",
    freeform: "Freeform",
    square: "Square (1:1)",
    passport: "Passport (35:45)",
    photo4x6: "Photo (4:6)",
    photo5x7: "Photo (5:7)",
    cropMode: "Crop Mode",
    brightness: "Brightness",
    contrast: "Contrast",
    saturation: "Saturation",
    rotate: "Rotate",
    flip: "Flip",
    flipHorizontal: "Flip Horizontal",
    flipVertical: "Flip Vertical",
    rotateLeft: "Rotate Left",
    rotateRight: "Rotate Right",
    filters: "Filters",
    presets: "Presets",
    cropAll: "Crop All",
    downloadAll: "Download All",
    addMore: "Add More Images",
    removeImage: "Remove Image",
    preview: "Preview",
    cropped: "Cropped",
    original: "Original"
  },
  gu: {
    about: "અમારા વિશે",
    services: "સેવાઓ",
    contact: "સંપર્ક કરો",
    visitCenter: "અમારા કેન્દ્રની મુલાકાત લો",
    onlineTools: "ઓનલાઈન સાધનો",
    ourServices: "અમારી સેવાઓ",
    helpingYou: "દરેક પગલે તમારી સાથે",
    needAssistance: "સહાયની જરૂર છે?",
    youCan: "તમે કરી શકો છો:",
    callUsAt: "અમને કૉલ કરો:",
    orVisit: "અથવા આજે જ અમારા કેન્દ્રની મુલાકાત લો!",
    contactUs: "સંપર્ક કરો",
    quickLinks: "ઝડપી લિંક્સ",
    followUs: "અમને ફોલો કરો",
    allRightsReserved: "બધા અધિકારો સુરક્ષિત છે.",
    loading: "લોડ થઈ રહ્યું છે...",
    jansevakendra: "જનસેવાકેન્દ્ર",
    photoCropTool: "એડવાન્સ ફોટો ક્રોપિંગ ટૂલ",
    uploadFront: "ફ્રન્ટ સાઈડ ઇમેજ અપલોડ કરો",
    uploadBack: "બેક સાઈડ ઇમેજ અપલોડ કરો",
    cropFront: "ફ્રન્ટ સાઈડ ક્રોપ કરો",
    cropBack: "બેક સાઈડ ક્રોપ કરો",
    download: "કમ્બાઈન્ડ ઇમેજ ડાઉનલોડ કરો",
    reset: "રીસેટ કરો",
    instructions: "એસ્પેક્ટ રેશિયો, ફિલ્ટર અને બલ્ક પ્રોસેસિંગ સાથે એડવાન્સ ફોટો ક્રોપિંગ ટૂલ.",
    uploadImageInstruction: "કૃપા કરીને એક ઇમેજ અપલોડ કરો.",
    cropImageInstruction: "ક્રોપ બોક્સને એડજસ્ટ કરો અને 'ક્રોપ' પર ક્લિક કરો.",
    frontSide: "ફ્રન્ટ સાઈડ",
    backSide: "બેક સાઈડ",
    combinedPreview: "ક્રોપ કરેલ કમ્બાઈન્ડ ઇમેજ પ્રિવ્યૂ",
    cropBothSides: "કમ્બાઈન્ડ પ્રિવ્યૂ અને ડાઉનલોડ જોવા માટે બંને બાજુ ક્રોપ કરો.",
    singleImageCrop: "સિંગલ ઇમેજ ક્રોપ",
    multiImageCrop: "મલ્ટિ ઇમેજ ક્રોપ",
    idCardCrop: "આઈડી કાર્ડ ક્રોપ",
    passportCrop: "પાસપોર્ટ ફોટો ક્રોપ",
    aspectRatio: "એસ્પેક્ટ રેશિયો",
    freeform: "ફ્રીફોર્મ",
    square: "સ્ક્વેર (1:1)",
    passport: "પાસપોર્ટ (35:45)",
    photo4x6: "ફોટો (4:6)",
    photo5x7: "ફોટો (5:7)",
    cropMode: "ક્રોપ મોડ",
    brightness: "બ્રાઇટનેસ",
    contrast: "કન્ટ્રાસ્ટ",
    saturation: "સેચ્યુરેશન",
    rotate: "રોટેટ",
    flip: "ફ્લિપ",
    flipHorizontal: "હોરિઝોન્ટલ ફ્લિપ",
    flipVertical: "વર્ટિકલ ફ્લિપ",
    rotateLeft: "લેફ્ટ રોટેટ",
    rotateRight: "રાઇટ રોટેટ",
    filters: "ફિલ્ટર",
    presets: "પ્રીસેટ",
    cropAll: "બધું ક્રોપ કરો",
    downloadAll: "બધું ડાઉનલોડ કરો",
    addMore: "વધુ ઇમેજ ઉમેરો",
    removeImage: "ઇમેજ દૂર કરો",
    preview: "પ્રિવ્યૂ",
    cropped: "ક્રોપ કરેલ",
    original: "ઓરિજિનલ"
  }
};

interface ImageData {
  id: string;
  file: File;
  originalUrl: string;
  croppedUrl?: string;
  cropperRef: React.RefObject<ReactCropperElement>;
}

export default function AdvancedPhotoCropTool() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];
  
  const [cropMode, setCropMode] = useState<'single' | 'multi' | 'idcard' | 'passport'>('single');
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100
  });
  
  // ID Card specific states
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [croppedFrontImage, setCroppedFrontImage] = useState<string | null>(null);
  const [croppedBackImage, setCroppedBackImage] = useState<string | null>(null);
  const frontCropperRef = useRef<ReactCropperElement>(null);
  const backCropperRef = useRef<ReactCropperElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatios = {
    freeform: undefined,
    square: 1,
    passport: 35/45,
    photo4x6: 4/6,
    photo5x7: 5/7,
    idcard: 1.586
  };

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ImageData[] = [];
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      alert('Please select valid image files');
      return;
    }

    let processedCount = 0;
    
    validFiles.forEach((file, index) => {
      const id = Date.now().toString() + index;
      const reader = new FileReader();
      reader.onload = () => {
        const imageData: ImageData = {
          id,
          file,
          originalUrl: reader.result as string,
          cropperRef: React.createRef<ReactCropperElement>()
        };
        newImages.push(imageData);
        processedCount++;
        
        if (processedCount === validFiles.length) {
          if (cropMode === 'single') {
            setImages([newImages[0]]);
            setSelectedImageId(newImages[0].id);
          } else {
            setImages(prev => [...prev, ...newImages]);
            if (!selectedImageId && newImages.length > 0) {
              setSelectedImageId(newImages[0].id);
            }
          }
        }
      };
      reader.onerror = () => {
        alert(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  }, [cropMode, selectedImageId]);

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (side === 'front') {
          setFrontImage(reader.result as string);
          setCroppedFrontImage(null);
        } else {
          setBackImage(reader.result as string);
          setCroppedBackImage(null);
        }
      };
      reader.onerror = () => {
        alert('Error reading file');
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleCrop = (imageId?: string) => {
    if (cropMode === 'idcard') {
      return;
    }

    const targetId = imageId || selectedImageId;
    const image = images.find(img => img.id === targetId);
    if (!image?.cropperRef.current) return;

    try {
      const cropper = image.cropperRef.current.cropper;
      const canvas = cropper.getCroppedCanvas({
        width: 800,
        height: 600,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });
      
      if (canvas) {
        // Apply filters
        const filteredCanvas = document.createElement('canvas');
        const ctx = filteredCanvas.getContext('2d');
        filteredCanvas.width = canvas.width;
        filteredCanvas.height = canvas.height;
        
        if (ctx) {
          ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;
          ctx.drawImage(canvas, 0, 0);
          
          const croppedUrl = filteredCanvas.toDataURL('image/jpeg', 0.9);
          setImages(prev => prev.map(img => 
            img.id === targetId ? { ...img, croppedUrl } : img
          ));
        }
      }
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Error cropping image. Please try again.');
    }
  };

  const handleIdCardCrop = (side: 'front' | 'back') => {
    const cropperRef = side === 'front' ? frontCropperRef : backCropperRef;
    
    if (!cropperRef.current) {
      alert('Cropper not initialized');
      return;
    }

    try {
      const cropper = cropperRef.current.cropper;
      const canvas = cropper.getCroppedCanvas({
        width: 400,
        height: 250,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });
      
      if (canvas) {
        const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
        if (side === 'front') {
          setCroppedFrontImage(croppedImage);
        } else {
          setCroppedBackImage(croppedImage);
        }
      }
    } catch (error) {
      console.error('Error cropping ID card:', error);
      alert('Error cropping image. Please try again.');
    }
  };

  const handleRotate = (degrees: number) => {
    const image = images.find(img => img.id === selectedImageId);
    if (image?.cropperRef.current) {
      try {
        image.cropperRef.current.cropper.rotate(degrees);
      } catch (error) {
        console.error('Error rotating image:', error);
      }
    }
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    const image = images.find(img => img.id === selectedImageId);
    if (image?.cropperRef.current) {
      try {
        const cropper = image.cropperRef.current.cropper;
        const data = cropper.getData();
        if (direction === 'horizontal') {
          cropper.scaleX(-(data.scaleX || 1));
        } else {
          cropper.scaleY(-(data.scaleY || 1));
        }
      } catch (error) {
        console.error('Error flipping image:', error);
      }
    }
  };

  const handleDownload = (imageId?: string) => {
    if (cropMode === 'idcard') {
      handleIdCardDownload();
      return;
    }

    const targetId = imageId || selectedImageId;
    const image = images.find(img => img.id === targetId);
    
    if (image?.croppedUrl) {
      try {
        const link = document.createElement('a');
        link.href = image.croppedUrl;
        link.download = `cropped-${image.file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading image:', error);
        alert('Error downloading image');
      }
    } else {
      alert('Please crop the image first');
    }
  };

  const handleIdCardDownload = () => {
    if (!croppedFrontImage || !croppedBackImage) {
      alert('Please crop both sides first');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const frontImg = new Image();
      const backImg = new Image();
      let imagesLoaded = 0;

      const checkAndDraw = () => {
        imagesLoaded++;
        if (imagesLoaded === 2) {
          const padding = 20;
          canvas.width = frontImg.width + backImg.width + padding;
          canvas.height = Math.max(frontImg.height, backImg.height);
          
          // White background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.drawImage(frontImg, 0, 0);
          ctx.drawImage(backImg, frontImg.width + padding, 0);

          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/jpeg', 0.9);
          link.download = 'id-card-combined.jpg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };

      frontImg.onload = checkAndDraw;
      backImg.onload = checkAndDraw;
      frontImg.onerror = () => alert('Error loading front image');
      backImg.onerror = () => alert('Error loading back image');
      frontImg.src = croppedFrontImage;
      backImg.src = croppedBackImage;
    } catch (error) {
      console.error('Error downloading combined image:', error);
      alert('Error downloading combined image');
    }
  };

  const handleDownloadAll = () => {
    const croppedImages = images.filter(img => img.croppedUrl);
    if (croppedImages.length === 0) {
      alert('No cropped images to download');
      return;
    }

    croppedImages.forEach((image, index) => {
      setTimeout(() => handleDownload(image.id), index * 200);
    });
  };

  const handleCropAll = () => {
    if (images.length === 0) {
      alert('No images to crop');
      return;
    }
    images.forEach(image => handleCrop(image.id));
  };

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImageId === imageId) {
      const remaining = images.filter(img => img.id !== imageId);
      setSelectedImageId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleReset = () => {
    setImages([]);
    setSelectedImageId(null);
    setFrontImage(null);
    setBackImage(null);
    setCroppedFrontImage(null);
    setCroppedBackImage(null);
    setFilters({ brightness: 100, contrast: 100, saturation: 100 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectedImage = images.find(img => img.id === selectedImageId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-4">{t.photoCropTool}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">{t.instructions}</p>
        </div>

        {/* Crop Mode Selection */}
        <div className="mb-6 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-600 mb-4">{t.cropMode}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { key: 'single', label: t.singleImageCrop },
              { key: 'multi', label: t.multiImageCrop },
              { key: 'idcard', label: t.idCardCrop },
              { key: 'passport', label: t.passportCrop }
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => {
                  setCropMode(mode.key as any);
                  if (mode.key === 'passport') setAspectRatio(aspectRatios.passport);
                  else if (mode.key === 'idcard') setAspectRatio(aspectRatios.idcard);
                  handleReset();
                }}
                className={`p-3 rounded-lg border-2 transition-colors text-sm sm:text-base ${
                  cropMode === mode.key
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* ID Card Mode */}
        {cropMode === 'idcard' && (
          <div className="space-y-6 mb-8">
            {/* Front Side */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4 sm:mb-6">{t.frontSide}</h2>
              
              {!frontImage && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm sm:text-base">{t.uploadImageInstruction}</p>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleIdCardUpload(e, 'front')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                  </div>
                </div>
              )}

              {frontImage && !croppedFrontImage && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm sm:text-base">{t.cropImageInstruction}</p>
                  <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
                    <Cropper
                      ref={frontCropperRef}
                      src={frontImage}
                      style={{ height: '400px', width: '100%' }}
                      aspectRatio={1.586}
                      guides={true}
                      viewMode={1}
                      autoCropArea={0.9}
                      background={false}
                      responsive={true}
                      restore={false}
                      cropBoxResizable={true}
                      cropBoxMovable={true}
                      dragMode="move"
                      toggleDragModeOnDblclick={false}
                      minCropBoxHeight={50}
                      minCropBoxWidth={80}
                    />
                  </div>
                  <button
                    onClick={() => handleIdCardCrop('front')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base font-semibold"
                  >
                    {t.cropFront}
                  </button>
                </div>
              )}

              {croppedFrontImage && (
                <div className="flex flex-col items-center space-y-3">
                  <p className="text-green-600 font-semibold text-sm sm:text-base">✅ Front side cropped successfully!</p>
                  <img src={croppedFrontImage} alt="Cropped Front" className="rounded-lg max-h-48 sm:max-h-64 border border-gray-200 w-auto shadow-md" />
                </div>
              )}
            </div>

            {/* Back Side */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4 sm:mb-6">{t.backSide}</h2>

              {!backImage && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm sm:text-base">{t.uploadImageInstruction}</p>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleIdCardUpload(e, 'back')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                  </div>
                </div>
              )}

              {backImage && !croppedBackImage && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm sm:text-base">{t.cropImageInstruction}</p>
                  <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
                    <Cropper
                      ref={backCropperRef}
                      src={backImage}
                      style={{ height: '400px', width: '100%' }}
                      aspectRatio={1.586}
                      guides={true}
                      viewMode={1}
                      autoCropArea={0.9}
                      background={false}
                      responsive={true}
                      restore={false}
                      cropBoxResizable={true}
                      cropBoxMovable={true}
                      dragMode="move"
                      toggleDragModeOnDblclick={false}
                      minCropBoxHeight={50}
                      minCropBoxWidth={80}
                    />
                  </div>
                  <button
                    onClick={() => handleIdCardCrop('back')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base font-semibold"
                  >
                    {t.cropBack}
                  </button>
                </div>
              )}

              {croppedBackImage && (
                <div className="flex flex-col items-center space-y-3">
                  <p className="text-green-600 font-semibold text-sm sm:text-base">✅ Back side cropped successfully!</p>
                  <img src={croppedBackImage} alt="Cropped Back" className="rounded-lg max-h-48 sm:max-h-64 border border-gray-200 w-auto shadow-md" />
                </div>
              )}
            </div>

            {/* Combined Preview for ID Card */}
            {croppedFrontImage && croppedBackImage && (
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4 sm:mb-6 text-center">{t.combinedPreview}</h2>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600 mb-2">Front Side</p>
                      <img src={croppedFrontImage} alt="Cropped Front" className="rounded-lg max-h-40 border border-gray-200 w-auto shadow-md" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600 mb-2">Back Side</p>
                      <img src={croppedBackImage} alt="Cropped Back" className="rounded-lg max-h-40 border border-gray-200 w-auto shadow-md" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons for ID Card */}
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleIdCardDownload}
                disabled={!croppedFrontImage || !croppedBackImage}
                className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
              >
                💾 {t.download}
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-500 text-white py-3 px-6 rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base font-semibold"
              >
                🔄 {t.reset}
              </button>
            </div>
          </div>
        )}

        {/* Single/Multi/Passport Mode */}
        {cropMode !== 'idcard' && (
          <div className="space-y-6">
            {/* Main Cropping Area */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              {images.length === 0 ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="space-y-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <p className="text-gray-600 mb-2 text-lg font-medium">📁 Drag and drop images here or click to upload</p>
                      <p className="text-sm text-gray-500">
                        {cropMode === 'single' ? 'Upload one image' : 'Upload multiple images'} • Supports JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                  
                </div>
              ) : (
                <div>
                  {selectedImage && (
                    <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
                      <Cropper
                        ref={selectedImage.cropperRef}
                        src={selectedImage.originalUrl}
                        style={{ height: '500px', width: '100%' }}
                        aspectRatio={aspectRatio}
                        guides={true}
                        viewMode={1}
                        autoCropArea={0.8}
                        background={false}
                        responsive={true}
                        restore={false}
                        cropBoxResizable={true}
                        cropBoxMovable={true}
                        dragMode="move"
                        toggleDragModeOnDblclick={false}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Image Thumbnails for Multi Mode */}
              {cropMode === 'multi' && images.length > 1 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Images ({images.length})</h3>
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {images.map(image => (
                      <div
                        key={image.id}
                        className={`relative flex-shrink-0 cursor-pointer rounded-lg transition-all ${
                          selectedImageId === image.id ? 'ring-3 ring-blue-600 shadow-lg' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedImageId(image.id)}
                      >
                        <img
                          src={image.originalUrl}
                          alt="Thumbnail"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        {image.croppedUrl && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                          className="absolute -top-1 -left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            {images.length > 0 && (
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">🎛️ Controls</h2>
                
                {/* Aspect Ratio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.aspectRatio}</label>
                  <select
                    value={aspectRatio === undefined ? 'freeform' : Object.keys(aspectRatios).find(key => aspectRatios[key as keyof typeof aspectRatios] === aspectRatio) || 'freeform'}
                    onChange={(e) => setAspectRatio(e.target.value === 'freeform' ? undefined : aspectRatios[e.target.value as keyof typeof aspectRatios])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="freeform">{t.freeform}</option>
                    <option value="square">{t.square}</option>
                    <option value="passport">{t.passport}</option>
                    <option value="photo4x6">{t.photo4x6}</option>
                    <option value="photo5x7">{t.photo5x7}</option>
                  </select>
                </div>

                {/* Transform Controls */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">🔄 {t.rotate} & {t.flip}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleRotate(-90)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs sm:text-sm transition-colors flex items-center justify-center"
                      disabled={!selectedImage}
                    >
                      ↺ {t.rotateLeft}
                    </button>
                    <button
                      onClick={() => handleRotate(90)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs sm:text-sm transition-colors flex items-center justify-center"
                      disabled={!selectedImage}
                    >
                      ↻ {t.rotateRight}
                    </button>
                    <button
                      onClick={() => handleFlip('horizontal')}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs sm:text-sm transition-colors flex items-center justify-center"
                      disabled={!selectedImage}
                    >
                      ⟷ Flip H
                    </button>
                    <button
                      onClick={() => handleFlip('vertical')}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs sm:text-sm transition-colors flex items-center justify-center"
                      disabled={!selectedImage}
                    >
                      ⟷ Flip V
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">🎨 {t.filters}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">{t.brightness}: {filters.brightness}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.brightness}
                        onChange={(e) => setFilters(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">{t.contrast}: {filters.contrast}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.contrast}
                        onChange={(e) => setFilters(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">{t.saturation}: {filters.saturation}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.saturation}
                        onChange={(e) => setFilters(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  {cropMode !== 'multi' && (
                    <button
                      onClick={() => handleCrop()}
                      disabled={!selectedImage}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
                    >
                      ✂️ Crop Image
                    </button>
                  )}
                  
                  {cropMode === 'multi' && (
                    <>
                      <button
                        onClick={handleCropAll}
                        disabled={images.length === 0}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
                      >
                        ✂️ {t.cropAll}
                      </button>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => handleFileUpload(e.target.files)}
                          accept="image/*"
                          multiple={cropMode === 'multi'}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm sm:text-base font-semibold"
                        >
                          ➕ {t.addMore}
                        </button>
                      </div>
                    </>
                  )}

                  <button
                    onClick={cropMode === 'multi' ? handleDownloadAll : () => handleDownload()}
                    disabled={cropMode === 'multi' ? !images.some(img => img.croppedUrl) : !selectedImage?.croppedUrl}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
                  >
                    💾 {cropMode === 'multi' ? t.downloadAll : t.download}
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base font-semibold"
                  >
                    🔄 {t.reset}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-200 mt-12 rounded-t-xl shadow-inner">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left">&copy; 2025 {t.jansevakendra}. All rights reserved.</p>
            <button
              onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
            >
              {language === 'en' ? 'ગુજરાતી' : 'English'}
            </button>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px #2563eb;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px #2563eb;
        }
      `}</style>
    </div>
  );
}
