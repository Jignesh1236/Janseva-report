'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface Translations {
  about: string;
  services: string;
  contact: string;
  visitCenter: string;
  onlineTools: string;
  ourServices: string;
  helpingYou: string;
  needAssistance: string;
  jansevakendra: string;
  [key: string]: string;
}

interface NavigationProps {
  language: string;
  translations: Translations;
  setLanguage?: (lang: string) => void;
  currentLanguage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ language, translations, setLanguage, currentLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-xl rounded-b-2xl border-b border-blue-200 transition-all duration-300 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <span className="absolute -top-1 -right-1 text-[10px] font-semibold text-primary transform scale-110 select-none">TM</span>
              <Image
                src="/icons/image-removebg-preview (1).png"
                alt="Janseva Kendra (Private) Logo"
                width={44}
                height={44}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            <span className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-200">
              {translations.jansevakendra}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: translations.about },
              { href: '/services', label: translations.services },
              { href: '/location', label: translations.visitCenter },
              { href: '/report', label: translations.reports || 'Reports' },
              { href: '/contact', label: translations.contact }
            ].map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-gray-800 font-semibold transition-colors duration-300 hover:text-primary focus:text-primary group ${isActive ? 'text-primary' : ''}`}
                >
                  <span>{link.label}</span>
                  <span className={`absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded transition-all duration-300 ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'} group-hover:opacity-100 group-hover:scale-x-100`}></span>
                </Link>
              );
            })}
            {/* Language Switcher */}
            {setLanguage && (
              <div className="flex items-center space-x-0.5 ml-6 border rounded overflow-hidden">
                <button
                  className={`px-2 py-1 text-sm font-semibold transition-colors duration-200 focus:outline-none ${currentLanguage === 'en' ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-blue-50'}`}
                  onClick={() => setLanguage('en')}
                >
                  EN
                </button>
                <button
                  className={`px-2 py-1 text-sm font-semibold transition-colors duration-200 focus:outline-none border-l ${currentLanguage === 'gu' ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-blue-50'}`}
                  onClick={() => setLanguage('gu')}
                >
                  ગુજરાતી
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden fixed inset-0 z-60 bg-white/95 backdrop-blur-lg shadow-2xl"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col space-y-6">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/about', label: translations.about },
                  { href: '/services', label: translations.services },
                  { href: '/offers', label: translations.offers || 'Offers' },
                  { href: '/location', label: translations.visitCenter },
                  { href: '/report', label: translations.reports || 'Reports' },
                  { href: '/contact', label: translations.contact }
                ].map((link, i) => (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      href={link.href}
                      className="block text-2xl font-semibold text-gray-900 hover:text-primary transition-colors duration-300 px-3 py-3 rounded-lg focus:bg-blue-50 focus:outline-none"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {/* Mobile Language Switcher */}
                {setLanguage && (
                  <div className="flex items-center space-x-0.5 mt-8 border rounded overflow-hidden self-center">
                <button
                  className={`px-3 py-2 text-base font-semibold transition-colors duration-300 focus:outline-none ${currentLanguage === 'en' ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-blue-50'}`}
                  onClick={() => setLanguage('en')}
                >
                  EN
                </button>
                <button
                  className={`px-3 py-2 text-base font-semibold transition-colors duration-300 focus:outline-none border-l ${currentLanguage === 'gu' ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-blue-50'}`}
                  onClick={() => setLanguage('gu')}
                >
                  ગુજરાતી
                </button>
              </div>
            )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
