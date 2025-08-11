"use client";
import React, { useState } from 'react';
import Navigation from './Navigation';

const translations = {
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
    jansevakendra: "Janseva Kendra (Private)",
    photoCropTool: "Photo Crop Tool",
    uploadFront: "Upload Front",
    uploadBack: "Upload Back",
    cropFront: "Crop Front",
    cropBack: "Crop Back",
    download: "Download",
    reset: "Reset",
    instructions: "Instructions",
    offers: "Offers"
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
    jansevakendra: "જનસેવા કેન્દ્ર પ્રાઇવેટ",
    photoCropTool: "ફોટો ક્રોપ ટૂલ",
    uploadFront: "ફ્રન્ટ અપલોડ કરો",
    uploadBack: "બેક અપલોડ કરો",
    cropFront: "ફ્રન્ટ ક્રોપ કરો",
    cropBack: "બેક ક્રોપ કરો",
    download: "ડાઉનલોડ",
    reset: "રીસેટ",
    instructions: "સૂચનાઓ",
    offers: "ઓફર્સ"
  }
};

export default function NavigationWrapper() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];

  return (
    <Navigation language={language} translations={t} setLanguage={setLanguage} currentLanguage={language} />
  );
} 