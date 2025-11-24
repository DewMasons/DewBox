import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, CreditCard, User, CheckCircle, Shield, ArrowRight } from 'lucide-react';

/**
 * AuthCarousel - Professional Pixel 9 Pro mockup with Stripe-style edge light sweep
 * Phone stays stationary while content animates inside
 */
const AuthCarousel = () => {
  const [currentScene, setCurrentScene] = useState(0);

  // Define 6 professional authentication scenes matching site design
  const scenes = [
    {
      id: 'signup',
      title: 'Create your account',
      subtitle: 'Start your financial journey',
      icon: Mail,
      content: (
        <div className="space-y-2.5">
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs placeholder-gray-400"
              readOnly
              value="john@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs"
              readOnly
              value="password123"
            />
          </div>
          <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-xs shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-1.5">
            Continue
            <ArrowRight size={12} />
          </button>
          <p className="text-center text-[10px] text-gray-500">
            Already have an account? <span className="text-cyan-600 font-semibold">Sign in</span>
          </p>
        </div>
      )
    },
    {
      id: 'otp',
      title: 'Verify your email',
      subtitle: 'We sent a code to your email',
      icon: Shield,
      content: (
        <div className="space-y-3">
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                className="w-8 h-10 text-center text-sm font-bold bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-cyan-500"
                readOnly
                value={i <= 4 ? (i % 2 === 0 ? '5' : '3') : ''}
              />
            ))}
          </div>
          <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-xs shadow-lg shadow-cyan-500/30">
            Verify Code
          </button>
          <p className="text-center text-[10px] text-gray-500">
            Didn't receive code? <span className="text-cyan-600 font-semibold">Resend</span>
          </p>
        </div>
      )
    },
    {
      id: 'payment',
      title: 'Add payment method',
      subtitle: 'Secure your transactions',
      icon: CreditCard,
      content: (
        <div className="space-y-2.5">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div className="w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded"></div>
              <span className="text-[10px] font-medium">VISA</span>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono tracking-wider">•••• •••• •••• 4242</p>
              <div className="flex justify-between text-[10px]">
                <div>
                  <p className="text-gray-400 text-[8px]">VALID THRU</p>
                  <p className="font-medium">12/25</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-[8px]">CVV</p>
                  <p className="font-medium">•••</p>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-xs shadow-lg shadow-cyan-500/30">
            Add Card
          </button>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Complete your profile',
      subtitle: 'Tell us about yourself',
      icon: User,
      content: (
        <div className="space-y-2.5">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <User className="w-8 h-8 text-cyan-600" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs"
              readOnly
              value="John Doe"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs"
              readOnly
              value="+1 234 567 8900"
            />
          </div>
          <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-xs shadow-lg shadow-cyan-500/30">
            Continue
          </button>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Notification preferences',
      subtitle: 'Stay updated your way',
      icon: CheckCircle,
      content: (
        <div className="space-y-2">
          {[
            { label: 'Email notifications', enabled: true },
            { label: 'Push notifications', enabled: true },
            { label: 'SMS alerts', enabled: false }
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xs font-medium text-gray-700">{pref.label}</span>
              <div className={`w-9 h-5 rounded-full relative transition-colors ${pref.enabled ? 'bg-cyan-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${pref.enabled ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
          ))}
          <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-xs shadow-lg shadow-cyan-500/30 mt-3">
            Save Preferences
          </button>
        </div>
      )
    },
    {
      id: 'success',
      title: 'You are all set!',
      subtitle: 'Welcome to MyDewbox',
      icon: CheckCircle,
      content: (
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-0.5">Account Created!</h3>
            <p className="text-xs text-gray-600">Your account is ready to use</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-3">
            <p className="text-[10px] text-gray-700 leading-relaxed">
              Start exploring MyDewbox features and manage your finances with ease.
            </p>
          </div>
          <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-xs shadow-lg shadow-cyan-500/30">
            Get Started
          </button>
        </div>
      )
    }
  ];

  // Auto-advance scenes every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [scenes.length]);

  const currentSceneData = scenes[currentScene];
  const Icon = currentSceneData.icon;

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Pixel 9 Pro mockup - 280x450 with edge light sweep */}
      <div className="relative">
        {/* Phone shadow */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-blue-600/20 blur-2xl scale-95 rounded-[2rem]"></div>
        
        {/* Four-sided light convergence effect */}
        <div className="absolute -inset-[3px] rounded-[2rem] overflow-hidden z-0">
          {/* Top light beam */}
          <motion.div
            key={`top-${currentScene}`}
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.9), transparent)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.5] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Right light beam */}
          <motion.div
            key={`right-${currentScene}`}
            className="absolute top-0 right-0 bottom-0 w-1"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.9), transparent)',
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: [0, 1, 0.5] }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          />
          
          {/* Bottom light beam */}
          <motion.div
            key={`bottom-${currentScene}`}
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.9), transparent)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.5] }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          />
          
          {/* Left light beam */}
          <motion.div
            key={`left-${currentScene}`}
            className="absolute top-0 left-0 bottom-0 w-1"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.9), transparent)',
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: [0, 1, 0.5] }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          />
          
          {/* Rotating swirl after convergence */}
          <motion.div
            key={`swirl-${currentScene}`}
            className="absolute inset-0"
            style={{
              background: 'conic-gradient(from 0deg, transparent 70%, rgba(6, 182, 212, 0.7) 80%, rgba(59, 130, 246, 0.7) 90%, transparent 100%)',
            }}
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ 
              rotate: 360,
              opacity: [0, 0, 1, 1, 0]
            }}
            transition={{
              duration: 2.5,
              delay: 0.8,
              ease: "linear",
            }}
          />
        </div>

        {/* Soft outer glow */}
        <motion.div
          key={`glow-${currentScene}`}
          className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: [0, 0.6, 0.3],
            scale: [0.95, 1.02, 1],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
        
        {/* Phone body - Ultra-thin borders - Fades in after light convergence */}
        <motion.div
          key={`phone-${currentScene}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="relative bg-gradient-to-b from-gray-900 to-black rounded-[2rem] p-[2px] shadow-2xl z-10" 
          style={{ width: '280px', height: '450px' }}
        >
          {/* Camera bar (Pixel 9 Pro style) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full z-20"></div>
          
          {/* Screen */}
          <div className="relative bg-white rounded-[1.9rem] overflow-hidden h-full">
            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-white z-30 flex items-center justify-between px-5 pt-0.5">
              <span className="text-[9px] font-semibold text-gray-900">9:41</span>
              <div className="flex items-center gap-0.5">
                <svg className="w-2.5 h-2.5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              </div>
            </div>

            {/* MyDewbox Logo Header */}
            <div className="absolute top-8 left-0 right-0 z-30 flex justify-center">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-md border border-gray-100">
                <img src="/dmlogo_3wF_icon.ico" alt="DM" className="w-4 h-4" />
                <span className="text-[10px] font-bold text-gray-900">MyDewbox</span>
              </div>
            </div>

            {/* Scene content with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 bg-white"
              >
                {/* Scene content */}
                <div className="h-full flex flex-col p-4 pt-16">
                  {/* Icon */}
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-center mb-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-0.5">
                      {currentSceneData.title}
                    </h2>
                    <p className="text-[10px] text-gray-500">
                      {currentSceneData.subtitle}
                    </p>
                  </div>

                  {/* Scene-specific content */}
                  <div className="flex-1">
                    {currentSceneData.content}
                  </div>

                  {/* Progress indicator */}
                  <div className="flex justify-center gap-1 mt-3">
                    {scenes.map((_, i) => (
                      <motion.div
                        key={i}
                        initial={false}
                        animate={{
                          width: i === currentScene ? 16 : 4,
                          backgroundColor: i === currentScene ? 'rgb(6, 182, 212)' : 'rgb(229, 231, 235)'
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-1 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthCarousel;
