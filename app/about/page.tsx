"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Translation dictionary
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
    jansevakendra: "Janseva Kendra (Private)"
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
    jansevakendra: "જનસેવા કેન્દ્ર (પ્રાઇવેટ)"
  }
};

export default function AboutPage() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white/90 rounded-xl shadow-lg p-8 sm:p-12 mx-auto mt-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <span className="absolute -top-1 -right-1 text-[10px] font-semibold text-primary transform scale-110 select-none">TM</span>
              <Image
                src="/icons/image-removebg-preview (1).png"
                alt="Jansevakendra Logo"
                width={80}
                height={80}
                className="transition-transform duration-200 hover:scale-110"
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4 text-center">About Janseva Kendra (Private)</h1>
          <p className="text-lg text-gray-700 mb-6 text-center">
            <span className="font-semibold text-primary">From Documents to Digital – We Make It Easy!</span>
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Janseva Kendra (Private)</strong> is dedicated to bridging the gap between citizens and essential government and digital services. Our mission is to empower the community by providing a wide range of services under one roof, making your life easier and more efficient.
          </p>
          <p className="text-gray-700 mb-4">
            Whether you need help with Aadhaar, PAN, insurance, bill payments, travel bookings, or digital assistance, our experienced team is here to support you every step of the way. We believe in transparency, reliability, and a customer-first approach.
          </p>
          <div className="mt-8 text-center">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
              Your trusted partner for all government and digital services.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 