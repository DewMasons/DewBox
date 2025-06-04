import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaEnvelope, FaPhone, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import Img from '../assets/DMLogo.png';
import BackgroundRotator from "./BackgroundRotator";

const AuthCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const slides = [
    {
      title: "Empowering Communities Through Innovation",
      description: "Join us in building a sustainable future together",
      image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    {
      title: "Secure Financial Solutions",
      description: "Get Your Piggy, Mobile and Web Wallets + Business Grants",
      image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    },
    {
      title: "Start Your Journey",
      description: "Microsavings, MicroInvestments, MicroCredit, eSusu",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    }
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-full h-full">
      <BackgroundRotator />
      {/* Logo and MyDewbox branding */}
      <div className="absolute top-0 left-0 w-full  z-20 p-4">
        <img src={Img} alt="MyDewbox Logo" className="h-12 w-12 mb-2 drop-shadow-lg" />
        <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-lg">MyDewbox</h1>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative h-full">
            <img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-[#FFD700] p-8">
              <h2 className="text-3xl font-bold mb-4 whitespace-nowrap">{slides[currentIndex].title}</h2>
              <p className="text-xl text-white">{slides[currentIndex].description}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Add Social Media Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4">
        <div className="flex justify-center space-x-6">
          <a href="https://wa.me/+2348153478944" target="_blank" rel="noopener noreferrer" 
             className="text-green-500 hover:text-green-400 transition-colors">
            <FaWhatsapp size={24} />
          </a>
          <a href="mailto:sunkkyoludimu@gmail.com" 
             className="text-blue-500 hover:text-blue-400 transition-colors">
            <FaEnvelope size={24} />
          </a>
          <a href="tel:+2348153478944" target="_blank" rel="noopener noreferrer"
             className="text-yellow-500 hover:text-yellow-400 transition-colors">
            <FaPhone size={24} />
          </a>
          <a href="https://web.facebook.com/search/top?q=yomi%20oludimu&__stsd__=eyJwcmltYXJ5Ijp7InR5cGUiOiJUWVBFQUhFQURfUEVPUExFX0VOVElUSUVTIn19" target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 hover:text-blue-500 transition-colors">
            <FaFacebook size={24} />
          </a>
          <a href="https://instagram.com/mydewbox" target="_blank" rel="noopener noreferrer" 
             className="text-pink-600 hover:text-pink-500 transition-colors">
            <FaInstagram size={24} />
          </a>
          <a href="https://youtube.com/mydewbox" target="_blank" rel="noopener noreferrer" 
             className="text-red-600 hover:text-red-500 transition-colors">
            <FaYoutube size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthCarousel;