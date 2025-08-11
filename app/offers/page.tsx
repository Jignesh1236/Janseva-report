'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Translation dictionary
const translations = {
  en: {
    about: "About",
    services: "Services",
    contact: "Contact",
    visitCenter: "Visit Our Center",
    onlineTools: "Online Tools",
    ourServices: "Our Services",
    helpingYou: "Helping You",
    needAssistance: "Need Assistance",
    jansevakendra: "Janseva Kendra (Private)",
    offers: "Special Offers",
    limitedTimeOffers: "Limited Time Offers",
    specialDeals: "Special Deals & Promotions",
    saveMore: "Save More with Our Exclusive Offers",
    validTill: "Valid Till",
    getOffer: "Get Offer",
    termsApply: "Terms & Conditions Apply",
    contactUs: "Contact Us",
    quickLinks: "Quick Links",
    followUs: "Follow Us",
    allRightsReserved: "All rights reserved.",
    offersDescription: "Don't miss out on our amazing deals and discounts on various government services!"
  },
  gu: {
    about: "અમારા વિશે",
    services: "સેવાઓ",
    contact: "સંપર્ક કરો",
    visitCenter: "અમારા કેન્દ્રની મુલાકાત લો",
    onlineTools: "ઓનલાઈન સાધનો",
    ourServices: "અમારા સેવાઓ",
    helpingYou: "તમને મદદ આપવા",
    needAssistance: "તમને મદદ જોવાની જરૂર",
    jansevakendra: "જનસેવાકેન્દ્ર",
    offers: "વિશેષ ઓફર",
    limitedTimeOffers: "મર્યાદિત સમય ઓફર",
    specialDeals: "વિશેષ ડીલ અને પ્રમોશન",
    saveMore: "અમારા વિશિષ્ટ ઓફર સાથે વધુ બચાવો",
    validTill: "આ સુધી માન્ય",
    getOffer: "ઓફર મેળવો",
    termsApply: "નિયમો અને શરતો લાગુ પડે છે",
    contactUs: "સંપર્ક કરો",
    quickLinks: "ઝડપી લિંક્સ",
    followUs: "અમને ફોલો કરો",
    allRightsReserved: "બધા અધિકારો સુરક્ષિત છે.",
    offersDescription: "વિવિધ સરકારી સેવાઓ પર અમારા અદ્ભુત ડીલ અને ડિસ્કાઉન્ટ ન ચૂકશો!"
  }
};

export default function OffersPage() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];

  const offers = [
    {
      title: 'Aadhaar Card Bundle Offer',
      titleGu: 'આધાર કાર્ડ બંડલ ઓફર',
      description: 'Get Aadhaar Card + PAN Card + Passport Photo for just ₹299',
      descriptionGu: 'માત્ર ₹299માં આધાર કાર્ડ + પેન કાર્ડ + પાસપોર્ટ ફોટો મેળવો',
      originalPrice: '₹450',
      offerPrice: '₹299',
      discount: '33% OFF',
      validTill: '31st March 2025',
      validTillGu: '31 માર્ચ 2025',
      icon: '🪪',
      popular: true
    },
    {
      title: 'Mobile Recharge Cashback',
      titleGu: 'મોબાઇલ રીચાર્જ કેશબેક',
      description: 'Get 5% cashback on mobile recharges above ₹500',
      descriptionGu: '₹500થી વધુના મોબાઇલ રીચાર્જ પર 5% કેશબેક મેળવો',
      originalPrice: 'No Extra Cost',
      offerPrice: '5% Cashback',
      discount: 'CASHBACK',
      validTill: '30th April 2025',
      validTillGu: '30 એપ્રિલ 2025',
      icon: '📱',
      popular: false
    },
    {
      title: 'Insurance Premium Special',
      titleGu: 'વીમા પ્રીમિયમ સ્પેશિયલ',
      description: 'Pay 3 months insurance premium and get 1 month free processing',
      descriptionGu: '3 મહિનાનું વીમા પ્રીમિયમ ભરો અને 1 મહિનાની મફત પ્રોસેસિંગ મેળવો',
      originalPrice: '₹100 Processing',
      offerPrice: 'FREE',
      discount: '100% OFF',
      validTill: '15th May 2025',
      validTillGu: '15 મે 2025',
      icon: '🛡️',
      popular: false
    },
    {
      title: 'Electricity Bill Payment Offer',
      titleGu: 'વીજળી બિલ ચુકવણી ઓફર',
      description: 'Pay electricity bill and get free lamination service',
      descriptionGu: 'વીજળી બિલ ભરો અને મફત લેમિનેશન સેવા મેળવો',
      originalPrice: '₹20 Lamination',
      offerPrice: 'FREE',
      discount: 'FREE',
      validTill: '28th February 2025',
      validTillGu: '28 ફેબ્રુઆરી 2025',
      icon: '⚡',
      popular: false
    },
    {
      title: 'PAN Card Express Service',
      titleGu: 'પેન કાર્ડ એક્સપ્રેસ સેવા',
      description: 'Get your PAN Card in 7 days with express processing',
      descriptionGu: 'એક્સપ્રેસ પ્રોસેસિંગ સાથે 7 દિવસમાં તમારો પેન કાર્ડ મેળવો',
      originalPrice: '₹200',
      offerPrice: '₹150',
      discount: '25% OFF',
      validTill: '31st January 2025',
      validTillGu: '31 જાન્યુઆરી 2025',
      icon: '💳',
      popular: true
    },
    {
      title: 'Student Special Package',
      titleGu: 'વિદ્યાર્થી વિશેષ પેકેજ',
      description: 'Special discount for students on all document services',
      descriptionGu: 'બધી દસ્તાવેજ સેવાઓ પર વિદ્યાર્થીઓ માટે વિશેષ ડિસ્કાઉન્ટ',
      originalPrice: 'Regular Price',
      offerPrice: '20% OFF',
      discount: 'STUDENT',
      validTill: 'Ongoing',
      validTillGu: 'ચાલુ',
      icon: '🎓',
      popular: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.specialDeals}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {t.saveMore}
          </p>
          <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-semibold text-lg animate-pulse">
            {t.limitedTimeOffers}
          </div>
        </motion.div>

        {/* Offers Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {offers.map((offer, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                offer.popular ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {/* Popular Badge */}
              {offer.popular && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold z-10">
                  POPULAR
                </div>
              )}
              
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                {offer.discount}
              </div>

              <div className="p-6">
                {/* Icon */}
                <div className="text-5xl mb-4 text-center">{offer.icon}</div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {language === 'gu' ? offer.titleGu : offer.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-4 text-center">
                  {language === 'gu' ? offer.descriptionGu : offer.description}
                </p>
                
                {/* Pricing */}
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {offer.offerPrice}
                  </div>
                  <div className="text-lg text-gray-500 line-through">
                    {offer.originalPrice}
                  </div>
                </div>
                
                {/* Valid Till */}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">
                    {t.validTill}: <span className="font-semibold">
                      {language === 'gu' ? offer.validTillGu : offer.validTill}
                    </span>
                  </p>
                </div>
                
                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105">
                  {t.getOffer}
                </button>
                
                {/* Terms */}
                <p className="text-xs text-gray-400 text-center mt-2">
                  *{t.termsApply}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Save Money?</h2>
          <p className="text-xl mb-6">{t.offersDescription}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+916355390372"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200"
            >
              Call: +91 63553 90372
            </a>
            <a
              href="tel:+919727202545"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200"
            >
              Call: +91 97272 02545
            </a>
          </div>
        </motion.div>
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
                <li><a href="/offers" className="text-gray-300 hover:text-primary underline">{t.offers}</a></li>
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
            <p className="text-gray-400">&copy; 2025 Janseva Kendra (Private). {t.allRightsReserved}</p>
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
