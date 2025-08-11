import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const ImageSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and window resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const images = [
    '/icons/image silde show/Googlewwww.png',
    '/icons/image silde show/googleww.png',
    '/icons/image silde show/image.png',
  ];

  useEffect(() => {
    if (!isHovered || isMobile) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Increased to 5 seconds for better viewing
      return () => clearInterval(timer);
    }
  }, [isHovered, isMobile]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isMobile ? 500 : 1000) : (isMobile ? -500 : -1000),
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? (isMobile ? 500 : 1000) : (isMobile ? -500 : -1000),
      opacity: 0,
      scale: 0.9,
    }),
  };

  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    nextSlide();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevSlide();
  };

  return (
    <div 
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Main Image Container */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            className="absolute w-full h-full"
          >
            <Image
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              priority
              className="transition-all duration-700 hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows with Hover Effect */}
      <motion.button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.1, x: -5, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isMobile ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.1, x: 5, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isMobile ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Navigation Dots with Animation */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-4">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? 'bg-primary' 
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: currentIndex === index ? 1.2 : 1,
              backgroundColor: currentIndex === index ? 'var(--primary)' : 'rgb(156, 163, 175)'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter with Animation */}
      <motion.div 
        className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/60 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentIndex + 1} / {images.length}
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 sm:h-1 bg-primary"
        initial={{ width: "0%" }}
        animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
        transition={{ duration: 0.3 }}
      />

      {/* Mobile Swipe Indicator */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
        >
          Swipe to navigate
        </motion.div>
      )}
    </div>
  );
};

export default ImageSlideshow; 