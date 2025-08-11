"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Translations } from '../../types/translations';

// Import translations (assuming they are available)
const translations: Record<string, Translations> = {
  en: {
    about: "About", services: "Services", contact: "Contact", visitCenter: "Visit Our Center", onlineTools: "Online Tools", ourServices: "Our Services", helpingYou: "Helping You, Every Step of the Way", needAssistance: "Need Assistance?", youCan: "You can:", callUsAt: "Call us at:", orVisit: "Or visit our center today!", contactUs: "Contact Us", quickLinks: "Quick Links", followUs: "Follow Us", allRightsReserved: "All rights reserved.", loading: "Loading...", jansevakendra: "Jansevakendra", photoCropTool: "ID Card Photo Crop Tool", uploadFront: "Upload Front Side Image", uploadBack: "Upload Back Side Image", cropFront: "Crop Front Side", cropBack: "Crop Back Side", download: "Download Combined Image", reset: "Reset", instructions: "Upload the front and back images of your ID card and crop them. The tool will then combine them for download.", uploadImageInstruction: "Please upload an image.", cropImageInstruction: "Adjust the crop box and click 'Crop'.", frontSide: "Front Side", backSide: "Back Side", combinedPreview: "Combined Cropped Image Preview", cropBothSides: "Please crop both sides to see the combined preview and download.",
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
    photoshopOnlineTool: "Photoshop Online",
    uploadImage: "Upload Image",
    downloadImage: "Download Image",
    resetImage: "Reset Image",
    brightness: "Brightness",
    contrast: "Contrast",
    saturation: "Saturation",
    blur: "Blur",
    grayscale: "Grayscale",
    sepia: "Sepia",
    invert: "Invert",
    noImageSelected: "No image selected. Please upload an image to start editing.",
    dragAndDrop: "Drag and drop an image here, or click to select",
    imageTooLarge: "Image is too large. Please select an image under 5MB.",
    processing: "Processing...",
    error: "Error processing image. Please try again.",
    addText: "Add Text",
    text: "Text",
    textColor: "Text Color",
    fontSize: "Font Size",
    fontFamily: "Font Family",
    clickToSetTextPosition: "Click on the image to set text position",
    dragToMoveOrResizeText: "Drag the text or resize handles to adjust",
  },
  gu: {
    about: "અમારા વિશે", services: "સેવાઓ", contact: "સંપર્ક કરો", visitCenter: "અમારા કેન્દ્રની મુલાકાત લો", onlineTools: "ઓનલાઈન સાધનો", ourServices: "અમારી સેવાઓ", helpingYou: "દરેક પગલે તમારી સાથે", needAssistance: "સહાયની જરૂર છે?", youCan: "તમે કરી શકો છો:", callUsAt: "અમને કૉલ કરો:", orVisit: "અથવા આજે જ અમારા કેન્દ્રની મુલાકાત લો!", contactUs: "સંપર્ક કરો", quickLinks: "ઝડપી લિંક્સ", followUs: "અમને ફોલો કરો", allRightsReserved: "બધા અધિકારો સુરક્ષિત છે.", loading: "લોડ થઈ રહ્યું છે...", jansevakendra: "જનસેવાકેન્દ્ર", photoCropTool: "આઈડી કાર્ડ ફોટો ક્રોપ ટૂલ", uploadFront: "ફ્રન્ટ સાઈડ ઇમેજ અપલોડ કરો", uploadBack: "બેક સાઈડ ઇમેજ અપલોડ કરો", cropFront: "ફ્રન્ટ સાઈડ ક્રોપ કરો", cropBack: "બેક સાઈડ ક્રોપ કરો", download: "કમ્બાઈન્ડ ઇમેજ ડાઉનલોડ કરો", reset: "રીસેટ કરો", instructions: "તમારા આઈડી કાર્ડની ફ્રન્ટ અને બેક ઇમેજ અપલોડ કરો અને ક્રોપ કરો. ટૂલ પછી તેમને ડાઉનલોડ કરવા માટે કમ્બાઈન્ડ કરશે.", uploadImageInstruction: "કૃપા કરીને એક ઇમેજ અપલોડ કરો.", cropImageInstruction: "ક્રોપ બોક્સને એડજસ્ટ કરો અને 'ક્રોપ' પર ક્લિક કરો.", frontSide: "ફ્રન્ટ સાઈડ", backSide: "બેક સાઈડ", combinedPreview: "ક્રોપ કરેલ કમ્બાઈન્ડ ઇમેજ પ્રિવ્યૂ", cropBothSides: "કમ્બાઈન્ડ પ્રિવ્યૂ અને ડાઉનલોડ જોવા માટે બંને બાજુ ક્રોપ કરો.",
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
    photoshopOnlineTool: "ફોટોશોપ ઓનલાઈન",
    uploadImage: "ઇમેજ અપલોડ કરો",
    downloadImage: "ઇમેજ ડાઉનલોડ કરો",
    resetImage: "ઇમેજ રીસેટ કરો",
    brightness: "બ્રાઇટનેસ",
    contrast: "કન્ટ્રાસ્ટ",
    saturation: "સેચ્યુરેશન",
    blur: "બ્લર",
    grayscale: "ગ્રેસ્કેલ",
    sepia: "સેપિયા",
    invert: "ઇન્વર્ટ",
    noImageSelected: "કોઈ ઇમેજ પસંદ કરેલ નથી. કૃપા કરીને ઇમેજ અપલોડ કરો.",
    dragAndDrop: "ઇમેજ અહીં ડ્રેગ અને ડ્રોપ કરો, અથવા પસંદ કરવા માટે ક્લિક કરો",
    imageTooLarge: "ઇમેજ ખૂબ મોટી છે. કૃપા કરીને 5MB થી નાની ઇમેજ પસંદ કરો.",
    processing: "પ્રોસેસિંગ...",
    error: "ઇમેજ પ્રોસેસ કરવામાં એરર. કૃપા કરીને ફરીથી પ્રયાસ કરો.",
    addText: "લખાણ ઉમેરો",
    text: "લખાણ",
    textColor: "લખાણનો રંગ",
    fontSize: "ફોન્ટ સાઈઝ",
    fontFamily: "ફોન્ટ ફેમિલી",
    clickToSetTextPosition: "લખાણની સ્થિતિ સેટ કરવા માટે ઇમેજ પર ક્લિક કરો",
    dragToMoveOrResizeText: "લખાણ અથવા રીસાઈઝ હેન્ડલ ખેંચીને ગોઠવો",
  }
};

export default function PhotoshopOnline() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0
  });
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textPosition, setTextPosition] = useState<{ x: number, y: number } | null>(null);
  
  // State for text manipulation
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [isResizingText, setIsResizingText] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [initialFontSize, setInitialFontSize] = useState<number | null>(null);
  const [initialTextPosition, setInitialTextPosition] = useState<{ x: number, y: number } | null>(null);
  const [textBoundingBox, setTextBoundingBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [resizeHandleSize, setResizeHandleSize] = useState(10);
  const [resizingHandle, setResizingHandle] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Redraw canvas whenever dependencies change
  useEffect(() => {
    if (originalImageUrl) {
      const img = new Image();
      img.onload = () => {
        imageObjRef.current = img;
        drawImageOnCanvas();
      };
      img.src = originalImageUrl;
    } else {
        // Clear canvas if no image
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
         imageObjRef.current = null;
         setTextPosition(null);
         setTextBoundingBox(null);
    }
  }, [originalImageUrl, filters, text, textColor, fontSize, fontFamily, textPosition, textBoundingBox]);

  // Function to draw image and text on canvas
  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageObjRef.current;

    if (!canvas || !ctx || !img) return;

    // Set canvas dimensions to image dimensions for accurate drawing
    const canvasWidth = img.naturalWidth;
    const canvasHeight = img.naturalHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Apply filters by drawing to a temporary canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCanvas || !tempCtx) return;

    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    tempCtx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      invert(${filters.invert}%)
    `;
    tempCtx.drawImage(img, 0, 0);

    // Draw the filtered image onto the main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);

    // Add text if available
    if (text && textPosition) {
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = textColor;
      ctx.strokeStyle = textColor === '#000000' ? '#ffffff' : '#000000';
      ctx.lineWidth = 1;
      
      // Get text metrics after setting font
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      // A rough estimate for height (can be improved)
      const textHeight = fontSize; // Use fontSize as a simple height estimate

      // Update bounding box state
      const boxX = textPosition.x;
      const boxY = textPosition.y - textHeight; // Position y is the baseline, adjust for top
      setTextBoundingBox({ x: boxX, y: boxY, width: textWidth, height: textHeight });

      // Draw the text
      ctx.fillText(text, textPosition.x, textPosition.y);
      ctx.strokeText(text, textPosition.x, textPosition.y);
      
      // Draw bounding box and resize handles if not dragging/resizing
      if (!isDraggingText && !isResizingText) {
        // Draw bounding box
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)'; // Blue bounding box
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX, boxY, textWidth, textHeight);

        // Draw resize handles (corners)
        const handles = [
            { x: boxX, y: boxY }, // Top-left
            { x: boxX + textWidth, y: boxY }, // Top-right
            { x: boxX, y: boxY + textHeight }, // Bottom-left
            { x: boxX + textWidth, y: boxY + textHeight } // Bottom-right
        ];

        ctx.fillStyle = 'blue'; // Blue handles
        handles.forEach(handle => {
            ctx.fillRect(handle.x - resizeHandleSize / 2, handle.y - resizeHandleSize / 2, resizeHandleSize, resizeHandleSize);
        });
      }
    }
  };

  // Helper to get mouse position relative to canvas
  const getMousePos = (canvas: HTMLCanvasElement, evt: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  };

  // Check if mouse is over the resize handle
  const isMouseOverResizeHandle = (mousePos: { x: number, y: number }) => {
    if (!textBoundingBox) return false;
    const { x, y, width, height } = textBoundingBox;
    const handleSize = resizeHandleSize;

    // Define handle areas (slightly larger for easier interaction)
    const handles = [
        { x: x - handleSize, y: y - handleSize, cursor: 'nwse-resize', handle: 'tl' }, // Top-left
        { x: x + width, y: y - handleSize, cursor: 'nesw-resize', handle: 'tr' }, // Top-right
        { x: x - handleSize, y: y + height, cursor: 'nesw-resize', handle: 'bl' }, // Bottom-left
        { x: x + width, y: y + height, cursor: 'nwse-resize', handle: 'br' } // Bottom-right
    ];

    for (const handle of handles) {
        if (mousePos.x > handle.x && mousePos.x < handle.x + handleSize &&
            mousePos.y > handle.y && mousePos.y < handle.y + handleSize) {
            return { cursor: handle.cursor, handle: handle.handle };
        }
    }
    return false;
  };

   // Check if mouse is over the text bounding box (for dragging)
   const isMouseOverText = (mousePos: { x: number, y: number }) => {
     if (!textBoundingBox) return false;
     return mousePos.x > textBoundingBox.x && mousePos.x < textBoundingBox.x + textBoundingBox.width &&
            mousePos.y > textBoundingBox.y && mousePos.y < textBoundingBox.y + textBoundingBox.height;
   };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !textPosition || !textBoundingBox) return;

    const mousePos = getMousePos(canvas, e);

    // Check if clicking on resize handle
    const resizeHandle = isMouseOverResizeHandle(mousePos);
    if (resizeHandle) {
      setIsResizingText(true);
      setDragStart(mousePos);
      setInitialFontSize(fontSize);
      setInitialTextPosition(textPosition);
      setResizingHandle(resizeHandle.handle);
      e.stopPropagation(); // Prevent canvas click handler
      return;
    }

    // Check if clicking on text (for dragging)
    if (isMouseOverText(mousePos)) {
        setIsDraggingText(true);
        // Calculate offset from text position to mouse position
        const offsetX = mousePos.x - textPosition.x;
        const offsetY = mousePos.y - textPosition.y;
        setDragStart({ x: offsetX, y: offsetY });
        setInitialTextPosition(textPosition);
         e.stopPropagation(); // Prevent canvas click handler
        return;
    }

    // If clicked elsewhere, potentially set new text position
    if (text && !textPosition) {
         handleCanvasClick(e); // Reuse existing click logic to set initial position
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingText && !isResizingText || !canvasRef.current || !dragStart) return;

    const canvas = canvasRef.current;
    const mousePos = getMousePos(canvas, e);

    if (isDraggingText && initialTextPosition) {
      // Update text position based on drag
      const newX = mousePos.x - dragStart.x;
      const newY = mousePos.y - dragStart.y;
      setTextPosition({ x: newX, y: newY });
    }

    if (isResizingText && initialFontSize && initialTextPosition && textBoundingBox && resizingHandle) {
      const dragDistanceX = mousePos.x - dragStart.x;
      const dragDistanceY = mousePos.y - dragStart.y;

      let newFontSize = initialFontSize;
      let newTextPosition = { ...initialTextPosition };

      // Calculate scaling based on the dragged handle
      switch (resizingHandle) {
        case 'br': // Bottom-right
          newFontSize = initialFontSize * Math.max(1, (textBoundingBox.width + dragDistanceX) / textBoundingBox.width);
          break;
        case 'bl': // Bottom-left
           newFontSize = initialFontSize * Math.max(1, (textBoundingBox.width - dragDistanceX) / textBoundingBox.width);
           newTextPosition.x = initialTextPosition.x + dragDistanceX;
          break;
        case 'tr': // Top-right
           newFontSize = initialFontSize * Math.max(1, (textBoundingBox.width + dragDistanceX) / textBoundingBox.width);
           newTextPosition.y = initialTextPosition.y + dragDistanceY; // Adjust y based on vertical drag
          break;
        case 'tl': // Top-left
           newFontSize = initialFontSize * Math.max(1, (textBoundingBox.width - dragDistanceX) / textBoundingBox.width);
           newTextPosition.x = initialTextPosition.x + dragDistanceX;
           newTextPosition.y = initialTextPosition.y + dragDistanceY; // Adjust y based on vertical drag
          break;
        // Add cases for side handles if implemented
      }
      
      // Ensure font size is within reasonable limits
       newFontSize = Math.max(10, Math.min(200, newFontSize));

      setFontSize(newFontSize);
      setTextPosition(newTextPosition);
      
      // Recalculate bounding box after resizing to ensure handle positions are correct
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
       if (canvas && ctx && imageObjRef.current) {
            ctx.font = `${newFontSize}px ${fontFamily}`;
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const textHeight = newFontSize;
            const boxX = newTextPosition.x;
            const boxY = newTextPosition.y - textHeight;
             setTextBoundingBox({ x: boxX, y: boxY, width: textWidth, height: textHeight });
       }
    }
     drawImageOnCanvas(); // Redraw on mouse move for smooth interaction
  };

  const handleMouseUp = () => {
    setIsDraggingText(false);
    setIsResizingText(false);
    setDragStart(null);
    setInitialFontSize(null);
    setInitialTextPosition(null);
    setResizingHandle(null);
    drawImageOnCanvas(); // Final redraw after interaction ends
  };

  // Attach mousemove and mouseup listeners to the window to handle drags outside canvas
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingText, isResizingText, dragStart, initialFontSize, initialTextPosition, textBoundingBox, filters, text, textColor, fontSize, fontFamily, textPosition]); // Re-attach if state changes

  // Helper function to determine the canvas cursor style
  const getCanvasCursor = () => {
    const canvas = canvasRef.current;
    if (!canvas || !textPosition) {
      return text ? 'crosshair' : 'default';
    }

    const mousePos = getMousePos(canvas, {} as any); // Pass a dummy event object as getMousePos expects it

    if (isDraggingText || isResizingText) {
      return 'grabbing';
    }

    const handleInfo = isMouseOverResizeHandle(mousePos);
    if (typeof handleInfo === 'object') {
      return handleInfo.cursor;
    } else if (isMouseOverText(mousePos)) {
      return 'move';
    }

    return 'default';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert(t.imageTooLarge);
      return;
    }
    
    setImageFile(file);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImageUrl(result);
      setEditedImageUrl(result); // Initially set edited to original
      setIsProcessing(false);
      // Reset text state on new image upload
      setText('');
      setTextPosition(null);
      setTextBoundingBox(null);
      setFontSize(24);
      setTextColor('#000000');
      setFontFamily('Arial');
    };
    reader.onerror = () => {
      alert(t.error);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFilterChange = (filter: string, value: number) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObjRef.current || textPosition || !text) return; // Only set position if not already set and text exists

    const mousePos = getMousePos(canvas, e);
    
    setTextPosition(mousePos);
  };

  const resetImage = () => {
    if (originalImageUrl) {
      setImageFile(null);
      setOriginalImageUrl(null);
      setEditedImageUrl(null);
      setFilters({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        invert: 0
      });
      setText('');
      setTextColor('#000000');
      setFontSize(24);
      setFontFamily('Arial');
      setTextPosition(null);
      setTextBoundingBox(null);
      setResizingHandle(null);
      imageObjRef.current = null;
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageFile) return;
    
    // Draw the image and text without the bounding box/handles for download
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
     const img = imageObjRef.current;
    if (!tempCanvas || !tempCtx || !img) return;

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Apply filters
     tempCtx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      invert(${filters.invert}%)
    `;
    tempCtx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw original image with filters

     // Add text if available (without bounding box/handles)
    if (text && textPosition) {
      tempCtx.font = `${fontSize}px ${fontFamily}`;
      tempCtx.fillStyle = textColor;
      tempCtx.strokeStyle = textColor === '#000000' ? '#ffffff' : '#000000';
      tempCtx.lineWidth = 1;
      tempCtx.fillText(text, textPosition.x, textPosition.y);
      tempCtx.strokeText(text, textPosition.x, textPosition.y);
    }

    const link = document.createElement('a');
    link.download = `edited-${imageFile.name}`;
    tempCanvas.toBlob((blob) => {
      if (blob) {
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    }, 'image/png');
  };

  const fontFamilies = ['Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Times New Roman', 'Georgia', 'Courier New', 'Lucida Console'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">{t.photoshopOnlineTool}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Preview / Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg flex justify-center items-center">
              {!originalImageUrl ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors w-full h-96 flex items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageUpload({ target: { files: [file] } } as any); // Simulate event
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <p className="text-gray-600">{t.dragAndDrop}</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative max-w-full max-h-full">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onMouseDown={handleMouseDown}
                    // MouseMove and MouseUp listeners are on the window
                    className="max-w-full max-h-screen-md mx-auto block"
                    style={{
                      cursor: getCanvasCursor()
                    }}
                  />
                   {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <p className="text-white">{t.processing}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
             {originalImageUrl && text && !textPosition && (
                <p className="text-center text-gray-600 mt-2">{t.clickToSetTextPosition}</p>
             )}
              {originalImageUrl && textPosition && (
                <p className="text-center text-gray-600 mt-2">{t.dragToMoveOrResizeText}</p>
             )}
          </div>

          {/* Editing Tools */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Editing Tools</h2>
            
            {originalImageUrl && (
              <div className="space-y-4">
                {/* Filter Sliders */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.brightness}</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.brightness}
                    onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.contrast}</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.contrast}
                    onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.saturation}</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.saturation}
                    onChange={(e) => handleFilterChange('saturation', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.blur}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.blur}
                    onChange={(e) => handleFilterChange('blur', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.grayscale}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.grayscale}
                    onChange={(e) => handleFilterChange('grayscale', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.sepia}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.sepia}
                    onChange={(e) => handleFilterChange('sepia', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.invert}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.invert}
                    onChange={(e) => handleFilterChange('invert', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Text Input Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.text}</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t.addText}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.textColor}</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10"
                  />
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.fontSize}</label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.fontFamily}</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {fontFamilies.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-3 pt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors duration-200"
              >
                {t.uploadImage}
              </button>
              <button
                onClick={resetImage}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200"
                disabled={!originalImageUrl}
              >
                {t.resetImage}
              </button>
              <button
                onClick={downloadImage}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
                disabled={!originalImageUrl}
              >
                {t.downloadImage}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-primary/30 mt-12 rounded-t-xl shadow-inner">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">&copy; 2025 {t.jansevakendra}. {t.allRightsReserved}</p>
            <button
              onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-200"
            >
              {language === 'en' ? 'ગુજરાતી' : 'English'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
} 