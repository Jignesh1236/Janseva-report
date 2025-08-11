"use client";
import React, { useState } from 'react';

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
    jansevakendra: "Jansevakendra"
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
    jansevakendra: "જનસેવાકેન્દ્ર"
  }
};

export default function ServicesPage() {
  const [language, setLanguage] = useState('en');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceLanguage, setServiceLanguage] = useState<Record<string, string>>({});
  const t = translations[language as keyof typeof translations];

  const services = [
    {
      title: 'Aadhaar Smart Card',
      description: 'Get your Aadhaar Smart Card and related services.',
      titleGu: 'આધાર સ્માર્ટ કાર્ડ',
      descriptionGu: 'તમારો આધાર સ્માર્ટ કાર્ડ અને સંબંધિત સેવાઓ મેળવો.',
      icon: '🪪',
    },
    {
      title: 'Aadhaar Card',
      description: 'New Aadhaar Card application and services.',
      titleGu: 'આધાર કાર્ડ',
      descriptionGu: 'નવા આધાર કાર્ડની અરજી અને સેવાઓ.',
      icon: '🪪',
    },
    {
      title: 'Aadhaar Card Update',
      description: 'Update your existing Aadhaar Card details.',
      titleGu: 'આધાર કાર્ડ અપડેટ',
      descriptionGu: 'તમારા હાલના આધાર કાર્ડની વિગતો અપડેટ કરો.',
      icon: '📝',
    },
    {
      title: 'Insurance Premium Payment',
      description: 'Pay your insurance premiums easily.',
      titleGu: 'વીમા પ્રીમિયમ ચુકવણી',
      descriptionGu: 'તમારા વીમા પ્રીમિયમ સરળતાથી ચૂકવો.',
      icon: '💰',
    },
    {
      title: 'Mobile/DTH Recharge',
      description: 'Recharge your mobile and DTH connections.',
      titleGu: 'મોબાઇલ/ડીટીએચ રીચાર્જ',
      descriptionGu: 'તમારા મોબાઇલ અને ડીટીએચ કનેક્શન રીચાર્જ કરો.',
      icon: '📱',
    },
    {
      title: 'BSNL Telephone Bill',
      description: 'Pay your BSNL telephone bills.',
      titleGu: 'બીએસએનએલ ટેલિફોન બિલ',
      descriptionGu: 'તમારા બીએસએનએલ ટેલિફોન બિલ ચૂકવો.',
      icon: '📞',
    },
    {
      title: 'Kisan E-Store',
      description: 'Purchase medicines and pumps through Kisan E-Store.',
      titleGu: 'કિસાન ઇ-સ્ટોર',
      descriptionGu: 'કિસાન ઇ-સ્ટોર દ્વારા દવાઓ અને પંપ ખરીદો.',
      icon: '💊',
    },
    {
      title: 'Electricity Bill',
      description: 'Pay your electricity bills.',
      titleGu: 'વીજળી બિલ',
      descriptionGu: 'તમારા વીજળી બિલ ચૂકવો.',
      icon: '⚡',
    },
    {
      title: 'National Pension Card',
      description: 'Services related to National Pension Scheme.',
      titleGu: 'રાષ્ટ્રીય પેન્શન કાર્ડ',
      descriptionGu: 'રાષ્ટ્રીય પેન્શન યોજના સંબંધિત સેવાઓ.',
      icon: '👴',
    },
    {
      title: 'PAN Card',
      description: 'Apply for new PAN Card and related services.',
      titleGu: 'પેન કાર્ડ',
      descriptionGu: 'નવા પેન કાર્ડ અને સંબંધિત સેવાઓ માટે અરજી કરો.',
      icon: '💳',
    },
    {
      title: 'Passport',
      description: 'Passport application and related services.',
      titleGu: 'પાસપોર્ટ',
      descriptionGu: 'પાસપોર્ટ અરજી અને સંબંધિત સેવાઓ.',
      icon: '📘',
    },
    {
      title: 'Insurance',
      description: 'Various insurance services and policies.',
      titleGu: 'વીમો',
      descriptionGu: 'વિવિધ વીમા સેવાઓ અને પોલિસીઓ.',
      icon: '🛡️',
    },
    {
      title: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance scheme services.',
      titleGu: 'પ્રધાનમંત્રી ફસલ બીમા યોજના',
      descriptionGu: 'પાક બીમા યોજના સેવાઓ.',
      icon: '🌾',
    },
    {
      title: 'FSSAI Registration',
      description: 'Food safety registration services.',
      titleGu: 'એફએસએસએઆઈ રજિસ્ટ્રેશન',
      descriptionGu: 'ખાદ્ય સલામતી રજિસ્ટ્રેશન સેવાઓ.',
      icon: '🍽️',
    },
    {
      title: '7/12 and 8A Number Copy',
      description: 'Get copies of land records.',
      titleGu: '7/12 અને 8A નંબરની નકલ',
      descriptionGu: 'જમીન રેકોર્ડની નકલો મેળવો.',
      icon: '📄',
    },
    {
      title: '135-D Rights Copy',
      description: 'Get copies of 135-D rights documents.',
      titleGu: '135-ડી અધિકાર નકલ',
      descriptionGu: '135-ડી અધિકાર દસ્તાવેજોની નકલો મેળવો.',
      icon: '📋',
    },
    {
      title: 'PMJAY Card',
      description: 'Ayushman Bharat health insurance card services.',
      titleGu: 'પીએમજેએવાય કાર્ડ',
      descriptionGu: 'આયુષ્માન ભારત સ્વાસ્થ્ય વીમા કાર્ડ સેવાઓ.',
      icon: '🏥',
    },
    {
      title: 'School Sector Services',
      description: 'Various educational sector services.',
      titleGu: 'શાળા ક્ષેત્ર સેવાઓ',
      descriptionGu: 'વિવિધ શૈક્ષણિક ક્ષેત્ર સેવાઓ.',
      icon: '🏫',
    },
    {
      title: 'Fastag',
      description: 'Fastag services and recharge.',
      titleGu: 'ફાસ્ટેગ',
      descriptionGu: 'ફાસ્ટેગ સેવાઓ અને રીચાર્જ.',
      icon: '🚗',
    },
    {
      title: 'Bus/Railway Ticket Booking',
      description: 'Book your bus and railway tickets.',
      titleGu: 'બસ/રેલવે ટિકિટ બુકિંગ',
      descriptionGu: 'તમારી બસ અને રેલવે ટિકિટ બુક કરો.',
      icon: '🚌',
    },
    {
      title: 'Air Ticket Booking',
      description: 'Book your air tickets.',
      titleGu: 'એર ટિકિટ બુકિંગ',
      descriptionGu: 'તમારી એર ટિકિટ બુક કરો.',
      icon: '✈️',
    },
    {
      title: 'Patanjali Products',
      description: 'Purchase Patanjali medicines and products.',
      titleGu: 'પતંજલી પ્રોડક્ટ્સ',
      descriptionGu: 'પતંજલી દવાઓ અને પ્રોડક્ટ્સ ખરીદો.',
      icon: '💊',
    },
    {
      title: 'Lamination',
      description: 'Document lamination services.',
      titleGu: 'લેમિનેશન',
      descriptionGu: 'દસ્તાવેજ લેમિનેશન સેવાઓ.',
      icon: '🖨️',
    },
    {
      title: 'Xerox/Color Xerox',
      description: 'Photocopy and color photocopy services.',
      titleGu: 'ઝેરોક્સ/કલર ઝેરોક્સ',
      descriptionGu: 'ફોટોકોપી અને કલર ફોટોકોપી સેવાઓ.',
      icon: '📷',
    },
    {
      title: 'E-Stamping',
      description: 'Electronic stamping services.',
      titleGu: 'ઇ-સ્ટેમ્પિંગ',
      descriptionGu: 'ઇલેક્ટ્રોનિક સ્ટેમ્પિંગ સેવાઓ.',
      icon: '📜',
    },
    {
      title: 'RTO Services',
      description: 'All RTO related services.',
      titleGu: 'આરટીઓ સેવાઓ',
      descriptionGu: 'બધી આરટીઓ સંબંધિત સેવાઓ.',
      icon: '🚘',
    },
    {
      title: 'Shramyogi Card',
      description: 'UWIN Card services for workers.',
      titleGu: 'શ્રમયોગી કાર્ડ',
      descriptionGu: 'મજૂરો માટે યુવિન કાર્ડ સેવાઓ.',
      icon: '👷',
    },
    {
      title: 'Ayushman Card',
      description: 'Health insurance card services.',
      titleGu: 'આયુષ્માન કાર્ડ',
      descriptionGu: 'સ્વાસ્થ્ય વીમા કાર્ડ સેવાઓ.',
      icon: '🏥',
    },
    {
      title: 'Digipay',
      description: 'Digital payment services.',
      titleGu: 'ડિજિપે',
      descriptionGu: 'ડિજિટલ ચુકવણી સેવાઓ.',
      icon: '💳',
    },
    {
      title: 'Pension Services',
      description: 'All pension related services.',
      titleGu: 'પેન્શન સેવાઓ',
      descriptionGu: 'બધી પેન્શન સંબંધિત સેવાઓ.',
      icon: '👴',
    },
    {
      title: 'Government Form Filling',
      description: 'Assistance with government form filling.',
      titleGu: 'સરકારી ફોર્મ ભરવામાં સહાય',
      descriptionGu: 'સરકારી ફોર્મ ભરવામાં સહાય.',
      icon: '📝',
    },
    {
      title: 'Print & Lamination',
      description: 'Printing and lamination services.',
      titleGu: 'પ્રિન્ટ અને લેમિનેશન',
      descriptionGu: 'પ્રિન્ટિંગ અને લેમિનેશન સેવાઓ.',
      icon: '🖨️',
    },
    {
      title: 'Internet Services',
      description: 'Various internet based services.',
      titleGu: 'ઇન્ટરનેટ સેવાઓ',
      descriptionGu: 'વિવિધ ઇન્ટરનેટ આધારિત સેવાઓ.',
      icon: '🌐',
    },
    {
      title: 'Government Certificate Help',
      description: 'Assistance with government certificates.',
      titleGu: 'સરકારી પ્રમાણપત્ર સહાય',
      descriptionGu: 'સરકારી પ્રમાણપત્રોમાં સહાય.',
      icon: '📜',
    },
    {
      title: 'Bus Pass & Travel Help',
      description: 'Assistance with bus passes and online travel.',
      titleGu: 'બસ પાસ અને મુસાફરી સહાય',
      descriptionGu: 'બસ પાસ અને ઓનલાઈન મુસાફરીમાં સહાય.',
      icon: '🎫',
    },
    {
      title: 'General Assistance',
      description: 'Email, scanning, and other general services.',
      titleGu: 'સામાન્ય સહાય',
      descriptionGu: 'ઇમેઇલ, સ્કેનિંગ અને અન્ય સામાન્ય સેવાઓ.',
      icon: '💻',
    },
    {
      title: 'Bank Statement',
      description: 'Get your bank statements and account details.',
      titleGu: 'બેંક સ્ટેટમેન્ટ',
      descriptionGu: 'તમારા બેંક સ્ટેટમેન્ટ અને ખાતાની વિગતો મેળવો.',
      icon: '🏦',
    },
    {
      title: 'NIOS',
      description: 'National Institute of Open Schooling services.',
      titleGu: 'એનઆઈઓએસ',
      descriptionGu: 'નેશનલ ઇન્સ્ટિટ્યૂટ ઓફ ઓપન સ્કૂલિંગ સેવાઓ.',
      icon: '📚',
    }
  ];

  const handleServiceClick = (serviceTitle: string) => {
    setSelectedService(selectedService === serviceTitle ? null : serviceTitle);
    setServiceLanguage(prev => ({
      ...prev,
      [serviceTitle]: prev[serviceTitle] === 'gu' ? 'en' : 'gu'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.ourServices}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.helpingYou}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.title)}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {serviceLanguage[service.title] === 'gu' ? service.titleGu : service.title}
              </h3>
              <p className="text-gray-600 mb-2">
                {serviceLanguage[service.title] === 'gu' ? service.descriptionGu : service.description}
              </p>
            
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.needAssistance}</h2>
          <p className="text-gray-600 mb-6">
            {t.youCan}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+916355390372"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors duration-200"
            >
              +91 63553 90372
            </a>
            <a
              href="tel:+919727202545"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors duration-200"
            >
              +91 97272 02545
            </a>
          </div>
          <p className="mt-4 text-gray-600">
            {t.orVisit}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-primary/30 mt-12 rounded-t-xl shadow-inner">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">{t.contactUs}</h3>
              <p className="text-gray-300">Email: <a href="mailto:jansevakarjan@gmail.com" className="underline hover:text-primary">jansevakarjan@gmail.com</a></p>
              <p className="text-gray-300">Phone: <a href="tel:+916355390372" className="underline hover:text-primary">+91 63553 90372</a></p>
              <p className="text-gray-300">Phone: <a href="tel:+919727202545" className="underline hover:text-primary">+91 97272 02545</a></p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">{t.quickLinks}</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-300 hover:text-primary underline">{t.about}</a></li>
                <li><a href="/services" className="text-gray-300 hover:text-primary underline">{t.services}</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-primary underline">{t.contact}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">{t.followUs}</h3>
              <div className="flex space-x-4 mt-2">
                <a href="https://www.instagram.com/janseva_kendra_private/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary flex items-center transition-colors duration-200">
                  <svg className="h-6 w-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2a1 1 0 0 1 0-2z" />
                  </svg>
                  <span>@janseva_kendra_private</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex justify-between items-center">
            <p className="text-gray-400">&copy; 2025 Jansevakendra. {t.allRightsReserved}</p>
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
