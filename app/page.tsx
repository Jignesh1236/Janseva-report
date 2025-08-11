"use client";
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Navigation from './components/Navigation'
import AIChat from './components/AIChat'
import ImageSlideshow from './components/ImageSlideshow'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import DecryptedText from './components/DecryptedText'

// Enhanced color palette with gradients
const colors = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  accent: '#10B981',
  warning: '#F59E0B',
  success: '#059669',
  danger: '#EF4444',
  gradient: {
    primary: 'from-blue-500 via-purple-500 to-indigo-600',
    secondary: 'from-purple-500 via-pink-500 to-rose-500',
    accent: 'from-emerald-400 via-cyan-400 to-teal-500',
    warm: 'from-orange-400 via-red-400 to-pink-500',
    cool: 'from-blue-400 via-cyan-400 to-emerald-400'
  }
}

// Enhanced translations with more content
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
    toggleChat: "Toggle Chat",
    whyChooseUs: "Why Choose Us?",
    experienceExcellence: "Experience excellence in every service we provide",
    quickService: "Quick Service",
    quickServiceDesc: "Get your documents processed quickly with our efficient service system.",
    expertGuidance: "Expert Guidance",
    expertGuidanceDesc: "Professional assistance for all your document and digital service needs.",
    secureProcess: "Secure Process",
    secureProcessDesc: "Your documents and information are handled with utmost security and confidentiality.",
    testimonials: "What Our Customers Say",
    newsletter: "Stay Updated",
    newsletterDesc: "Subscribe to get the latest updates and offers",
    subscribe: "Subscribe",
    statistics: "Our Impact",
    satisfaction: "Customer Satisfaction",
    servicesCompleted: "Services Completed",
    yearsExperience: "Years Experience"
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
    jansevakendra: "જન સેવા કેન્દ્ર પ્રાઇવેટ",
    toggleChat: "ચેટ ટોગલ કરો",
    whyChooseUs: "અમને કેમ પસંદ કરો?",
    experienceExcellence: "અમારી દરેક સેવામાં શ્રેષ્ઠતાનો અનુભવ કરો",
    quickService: "ઝડપી સેવા",
    quickServiceDesc: "અમારી કાર્યક્ષમ સેવા સિસ્ટમ સાથે તમારા દસ્તાવેજો ઝડપથી પ્રક્રિયા કરો.",
    expertGuidance: "નિષ્ણાત માર્ગદર્શન",
    expertGuidanceDesc: "તમારા બધા દસ્તાવેજ અને ડિજિટલ સેવાની જરૂરિયાતો માટે વ્યાવસાયિક સહાયતા.",
    secureProcess: "સુરક્ષિત પ્રક્રિયા",
    secureProcessDesc: "તમારા દસ્તાવેજો અને માહિતીને અત્યંત સુરક્ષા અને ગોપનીયતા સાથે હેન્ડલ કરવામાં આવે છે.",
    testimonials: "અમારા ગ્રાહકો શું કહે છે",
    newsletter: "અપડેટ રહો",
    newsletterDesc: "લેટેસ્ટ અપડેટ્સ અને ઓફર મેળવવા માટે સબ્સ્ક્રાઇબ કરો",
    subscribe: "સબ્સ્ક્રાઇબ કરો",
    statistics: "અમારી અસર",
    satisfaction: "ગ્રાહક સંતુષ્ટિ",
    servicesCompleted: "પૂર્ણ થયેલી સેવાઓ",
    yearsExperience: "વર્ષોનો અનુભવ"
  }
};

// Type definitions for props
interface StatisticsCounterProps {
  value: string;
  label: string;
  delay?: number;
}

interface NewsletterProps {
  language: 'en' | 'gu';
}

// Enhanced Splash Loader with more animations
function SplashLoader() {
  const cubeRef = useRef(null);
  const textRef = useRef(null);
  const [isGujarati, setIsGujarati] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Dynamically import anime.js
    import('animejs').then((animeModule) => {
      // Enhanced 3D cube rotation
      animeModule.default({
        targets: cubeRef.current,
        rotateY: '2turn',
        rotateX: '0.5turn',
        duration: 2000,
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate'
      });

      // Enhanced fade in text with bounce
      animeModule.default({
        targets: textRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.8, 1],
        delay: 400,
        duration: 1000,
        easing: 'easeOutElastic(1, .6)',
      });
    });

    return () => clearInterval(progressInterval);
  }, []);

  const handleTextClick = () => {
    setIsGujarati(!isGujarati);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-emerald-600/30 backdrop-blur-2xl">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-emerald-400/15 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-pink-400/15 rounded-full blur-3xl animate-pulse [animation-delay:3s]"></div>
      </div>

      <div className="flex flex-col items-center relative z-10">
        {/* Enhanced 3D Cube with glow effect */}
        <div
          ref={cubeRef}
          className="w-32 h-32 mb-8 relative"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
          <div
            className="relative"
            style={{
              width: 120,
              height: 120,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
              borderRadius: 24,
              boxShadow: '0 25px 80px rgba(59, 130, 246, 0.4), 0 12px 20px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotateY(0deg) rotateX(15deg)',
              backfaceVisibility: 'hidden',
              border: '3px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-[21px]"></div>
            <img
              src="/icons/481573786_593041823723784_4398692427343624609_n-removebg-preview.webp"
              alt="Jan Seva Kendra Private Logo"
              width={80}
              height={80}
              style={{ borderRadius: 20, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))' }}
            />
          </div>
        </div>

        {/* Enhanced Brand Name with better typography */}
        <div
          ref={textRef}
          className="text-center mb-8 cursor-pointer group"
          style={{ opacity: 0 }}
          onClick={handleTextClick}
        >
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-red-600 transition-all duration-500 drop-shadow-lg">
            {isGujarati ? translations.gu.jansevakendra : translations.en.jansevakendra}
          </h1>
          <div className="h-1.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-80 bg-gray-200/30 rounded-full h-2 mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>

        {/* Enhanced Loading Animation */}
        <div className="flex space-x-3 mb-6">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i}
              className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce shadow-lg"
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>

        <span className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          {isGujarati ? translations.gu.loading : translations.en.loading}
        </span>
        <span className="text-lg font-medium text-gray-600 mt-2">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

// Enhanced Floating AI Text with better positioning
function FloatingAIText() {
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchRandomText = async () => {
      try {
        const response = await fetch('/api/shapes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Give me a short, inspiring message about digital services and citizen empowerment.'
          }),
        });
        const data = await response.json();
        if (data.response) {
          setText(data.response);
          setIsVisible(true);
          // Better positioning logic
          setPosition({
            x: Math.random() * (Math.max(window.innerWidth - 350, 50)),
            y: Math.random() * (Math.max(window.innerHeight - 150, 50))
          });

          // Auto hide after 10 seconds
          setTimeout(() => setIsVisible(false), 10000);
        }
      } catch (error) {
        console.error('Error fetching AI text:', error);
      }
    };

    const interval = setInterval(fetchRandomText, 20000);
    fetchRandomText();

    return () => clearInterval(interval);
  }, []);

  if (!isVisible || !text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
      }}
      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl max-w-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          AI
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{text}</p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        ×
      </button>
    </motion.div>
  );
}

// New Statistics Counter Component
function StatisticsCounter({ value, label, delay = 0 }: StatisticsCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let start = 0;
        const end = parseInt(value);
        const increment = end / 100;
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 20);
        return () => clearInterval(timer);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg backdrop-blur-sm border border-primary/10"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: (delay + 200) / 1000, type: "spring", stiffness: 100 }}
        className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
      >
        {count}{value.includes('%') ? '%' : '+'}
      </motion.div>
      <p className="text-gray-600 dark:text-gray-300 font-medium">{label}</p>
    </motion.div>
  );
}

// Enhanced Newsletter Component
function Newsletter({ language }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-3xl p-8 text-white text-center shadow-2xl"
    >
      <h3 className="text-2xl font-bold mb-2">{t.newsletter}</h3>
      <p className="mb-6 opacity-90">{t.newsletterDesc}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
          required
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={subscribed}
          className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
        >
          {subscribed ? '✓ Subscribed!' : t.subscribe}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'gu'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showChat, setShowChat] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme');
  }, [theme]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (loading) return <SplashLoader />;

  const t = translations[language as keyof typeof translations];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const paperVariants = {
    initial: { 
      opacity: 0,
      y: 20,
      rotateX: 10,
      scale: 0.95
    },
    animate: { 
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1
      }
    },
    hover: {
      y: -8,
      rotateX: 5,
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.97,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <>
      {/* Enhanced Global Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
          animation-delay: 4s;
        }
        .cursor-glow {
          background: radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
        }
      `}</style>

      {/* Mouse Glow Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 cursor-glow"
        style={{
          background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08) 0%, transparent 50%)`
        }}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative">
        <AnimatePresence>
          <FloatingAIText />
        </AnimatePresence>


        {/* Enhanced Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ opacity, scale }}
          transition={{ duration: 0.8 }}
          className="relative py-16 sm:py-32 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-emerald-50/80 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-emerald-900/40 rounded-3xl shadow-2xl mx-4 mt-6 border border-white/30 backdrop-blur-lg overflow-hidden"
        >
          {/* Enhanced animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute top-10 right-1/4 w-32 h-32 bg-pink-400/15 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-10 left-1/4 w-36 h-36 bg-cyan-400/15 rounded-full blur-2xl animate-float-delayed"></div>
          </div>

          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 120 }}
                className="flex justify-center mb-12 relative z-10"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 scale-125"></div>
                  <div className="relative bg-white/95 dark:bg-gray-800/95 p-6 rounded-full shadow-2xl border-3 border-white/40 backdrop-blur-lg">
                    <span className="absolute -top-3 -right-3 text-sm font-bold text-blue-600 bg-white px-3 py-1.5 rounded-full shadow-lg transform rotate-15 border border-blue-200">TM</span>
                    <img
                      src="/icons/481573786_593041823723784_4398692427343624609_n-removebg-preview.webp"
                      alt="Jan Seva Kendra Private Logo"
                      width={160}
                      height={160}
                      className="transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl sm:text-4xl md:text-6xl font-black mb-6 sm:mb-8 relative z-10"
              >
                <motion.span 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="block bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-2xl"
                >
                  From Documents to Digital
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="block bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent mt-4 drop-shadow-2xl"
                >
                  We Make It Easy!
                </motion.span>
              </motion.h1>


              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-12 flex flex-col sm:flex-row justify-center gap-6 relative z-10"
              >
                <motion.div whileHover={{ scale: 1.05, rotateY: 5 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/location" className="group relative w-full sm:w-auto inline-block px-12 py-5 text-lg rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white font-bold shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      📍 {t.visitCenter}
                    </span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, rotateY: -5 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/tools" className="group relative w-full sm:w-auto inline-block px-12 py-5 text-lg rounded-2xl border-3 border-blue-600 text-blue-600 dark:text-blue-400 font-bold bg-white/95 dark:bg-gray-800/95 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 backdrop-blur-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors duration-300">
                      🛠️ {t.onlineTools}
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Image Slideshow Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto px-6 mt-20"
        >
          <ImageSlideshow />
        </motion.div>

        {/* Enhanced Features Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 mt-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10 rounded-3xl mx-4 shadow-inner"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">{t.whyChooseUs}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t.experienceExcellence}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05, rotateY: 8 }}
                className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-primary/10 backdrop-blur-sm"
              >
                <motion.div 
                  className="text-6xl mb-6"
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >⚡</motion.div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">{t.quickService}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t.quickServiceDesc}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05, rotateY: 8 }}
                className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-primary/10 backdrop-blur-sm"
              >
                <motion.div 
                  className="text-6xl mb-6"
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >🤝</motion.div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">{t.expertGuidance}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t.expertGuidanceDesc}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: 8 }}
                className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-primary/10 backdrop-blur-sm"
              >
                <motion.div 
                  className="text-6xl mb-6"
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >🔒</motion.div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">{t.secureProcess}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t.secureProcessDesc}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Services Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 bg-gradient-to-br from-gray-50/90 via-white/90 to-blue-50/90 dark:from-gray-800/90 dark:via-gray-900/90 dark:to-blue-900/90 mt-20 rounded-3xl shadow-2xl mx-4 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-sm sm:text-base text-primary font-semibold tracking-wide uppercase mb-4">{t.ourServices}</h2>
              <p className="text-2xl sm:text-4xl leading-8 font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{t.helpingYou}</p>
            </motion.div>

            <motion.ul 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
            >
              {[
                'Aadhaar Smart Card', 'Aadhaar Card', 'Aadhaar Card Sudharo (Update)', 'Vima Premium Jama Karvu',
                'Recharge (Mobile/DTH)', 'BSNL Telephone Bill', 'Kisan E-Store (Davaiyo ane Pump)', 'Light Bill',
                'National Pension Card', 'PAN Card', 'Passport', 'Insurance', 'Pradhan Mantri Fasal Bima Yojana',
                'FSSAI Registration', '7/12 ane 8A Number Nakal Utara', '135-D Adhikar Sudhi Nakal Utara',
                'PMJAY Card (Ayushman Bharat)', 'School Sector', 'Fastag', 'Bus / Railway Ticket Booking',
                'Air Ticket Booking', 'Patanjali Products (Dava)', 'Lamination', 'Xerox / Color Xerox',
                'E-Stamping', 'RTO sambandhit kaam', 'Shramyogi Card (UWIN CARD)', 'Ayushman Card',
                'Digipay', 'Mobile Recharge', 'DTH Recharge', 'Dava Booking (through Kisan Store)',
                'Pension Related Services', 'Electricity Services', 'Insurance Premium Payment',
                'Government Form Filling', 'Print & Lamination Services', 'Internet Based Services',
                'Government Certificate Help', 'Bus Pass ya Online Travel Help',
                'General Assistance (like email/scan etc.)'
              ].map((service, i) => (
                <motion.li 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, rotateY: 5, transition: { duration: 0.2 } }}
                  className="bg-white/95 dark:bg-gray-800/95 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 backdrop-blur-sm group"
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-bold group-hover:scale-110 transition-transform duration-200">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{service}</span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            {/* Enhanced Contact/Assistance Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 dark:from-primary/20 dark:via-secondary/20 dark:to-accent/20 rounded-3xl shadow-xl p-10 mt-16 max-w-4xl mx-auto text-center border-2 border-primary/20 backdrop-blur-sm"
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
                🎯 {t.needAssistance}
              </h3>
              <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">{t.youCan}</p>
              <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">{t.callUsAt}</p>
              <div className="space-y-3 mb-4">
                <p className="font-bold text-xl text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                  📱 <a href="tel:+916355390372" className="underline hover:text-primary transition-colors duration-200">+91 63553 90372</a>
                </p>
                <p className="font-bold text-xl text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                  📱 <a href="tel:+919727202545" className="underline hover:text-primary transition-colors duration-200">+91 97272 02545</a>
                </p>
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center justify-center gap-3">
                  ✉️ <a href="mailto:jansevakarjan@gmail.com" className="underline hover:text-primary transition-colors duration-200">jansevakarjan@gmail.com</a>
                </p>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300">{t.orVisit}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced AI Chat Section */}
        <motion.section
          variants={itemVariants}
          className="max-w-6xl mx-auto px-6 mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {language === 'en' ? '🤖 AI Assistant' : '🤖 એઆઈ સહાયક'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {language === 'en' 
                ? 'Get instant help and answers to your questions 24/7'
                : 'તમારા પ્રશ્નોના તાત્કાલિક જવાબો ૨૪/૭ મેળવો'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChat(!showChat)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {showChat ? 'Hide Chat' : t.toggleChat}
            </motion.button>
          </div>
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <AIChat />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Enhanced Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950 border-t-4 border-primary/30 mt-20 rounded-t-3xl shadow-2xl backdrop-blur-lg"
        >
          <div className="max-w-7xl mx-auto py-16 px-6">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {[
                { 
                  title: t.contactUs, 
                  content: (
                    <div className="space-y-4">
                      <p className="text-gray-300 flex items-center gap-3">
                        <span className="text-blue-400">✉️</span>
                        <a href="mailto:jansevakarjan@gmail.com" className="underline hover:text-blue-400 transition-colors duration-200">jansevakarjan@gmail.com</a>
                      </p>
                      <p className="text-gray-300 flex items-center gap-3">
                        <span className="text-green-400">📱</span>
                        <a href="tel:+916355390372" className="underline hover:text-green-400 transition-colors duration-200">+91 63553 90372</a>
                      </p>
                      <p className="text-gray-300 flex items-center gap-3">
                        <span className="text-green-400">📱</span>
                        <a href="tel:+919727202545" className="underline hover:text-green-400 transition-colors duration-200">+91 97272 02545</a>
                      </p>
                    </div>
                  )
                },
                { 
                  title: t.quickLinks, 
                  content: (
                    <ul className="space-y-4">
                      <li><Link href="/about" className="text-gray-300 hover:text-blue-400 underline transition-colors duration-200 flex items-center gap-2">📖 {t.about}</Link></li>
                      <li><Link href="/services" className="text-gray-300 hover:text-blue-400 underline transition-colors duration-200 flex items-center gap-2">🛠️ {t.services}</Link></li>
                      <li><Link href="/contact" className="text-gray-300 hover:text-blue-400 underline transition-colors duration-200 flex items-center gap-2">📞 {t.contact}</Link></li>
                    </ul>
                  )
                },
                { 
                  title: t.followUs, 
                  content: (
                    <div className="space-y-6">
                      <a href="https://www.instagram.com/janseva_kendra_private/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 flex items-center gap-3 transition-colors duration-200 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2a1 1 0 0 1 0-2z" />
                          </svg>
                        </div>
                        <span className="font-medium">@janseva_kendra_private</span>
                      </a>
                      <div className="flex gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium transition-all duration-200"
                        >
                          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                        </motion.button>
                      </div>
                    </div>
                  )
                }
              ].map((section, index) => (
                <motion.div
                  key={index}
                  variants={paperVariants}
                  initial="initial"
                  whileInView="animate"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className="text-left"
                >
                  <h3 className="text-white text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{section.title}</h3>
                  {section.content}
                </motion.div>
              ))}
            </div>

            <motion.div 
              variants={paperVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="mt-12 border-t border-gray-700 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6"
            >
              <p className="text-gray-400 text-center lg:text-left">&copy; 2025 Janseva Kendra (Private). {t.allRightsReserved}</p>
              <div className="flex gap-4">
                <motion.button
                  variants={paperVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowChat(!showChat)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  {showChat ? 'Close Chat' : 'Open Chat'}
                </motion.button>
                <motion.button
                  variants={paperVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 transition-all duration-300"
                >
                  {language === 'en' ? '🇮🇳 ગુજરાતી' : '🇺🇸 English'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.footer>
      </main>
    </>
  );
}
