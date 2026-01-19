import { motion } from 'framer-motion';
import { Home, TrendingUp, Wallet, User, PiggyBank, Target, Award, Calendar } from 'lucide-react';

/**
 * iPhone 16 Mockup Component - Smaller size for layout
 * Displays a realistic iPhone 16 with the actual MyDewbox app interface inside
 */
const iPhone16Mockup = ({ variant = 'home' }) => {
  // Different app screens to show
  const screens = {
    home: (
      <div className="h-full bg-gray-50 overflow-y-auto">
        {/* Status Bar */}
        <div className="bg-white px-3 pt-2 pb-1.5 flex items-center justify-between">
          <span className="text-[6px] font-semibold text-gray-900">9:41</span>
          <div className="flex items-center gap-0.5">
            <svg className="w-2 h-2 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <div className="w-3 h-1.5 border border-gray-900 rounded-[1px] relative">
              <div className="absolute inset-0.5 bg-gray-900 rounded-[0.5px]"></div>
            </div>
          </div>
        </div>

        {/* App Header */}
        <div className="bg-white px-3 pb-2">
          <h1 className="text-[8px] font-bold text-gray-900">Welcome back, John! 👋</h1>
          <p className="text-[5px] text-gray-500">3 months contribution streak! 🔥</p>
        </div>

        {/* Content */}
        <div className="p-2 space-y-1.5">
          {/* Wallet Balance Card with glassmorphism */}
          <div 
            className="relative rounded-xl p-3 text-white shadow-lg overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(29, 78, 216, 0.95))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)'
            }}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-0.5 mb-1.5">
                <Wallet size={7} />
                <span className="text-[5px] opacity-80">Wallet Balance</span>
              </div>
              <div className="text-[13px] font-bold mb-0.5">₦125,450</div>
              <div className="text-[4px] opacity-70">Available to spend or contribute</div>
              
              <div className="grid grid-cols-2 gap-1 mt-2">
                <div className="bg-white/15 backdrop-blur-sm rounded-lg p-1.5 border border-white/20">
                  <div className="text-[4px] mb-0.5">Add Money</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-lg p-1.5 border border-white/20">
                  <div className="text-[4px] mb-0.5">Contribute</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {/* Piggy Card with glassmorphism */}
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-2 shadow-sm border border-white/40">
              <div className="flex items-center gap-0.5 mb-1">
                <div className="w-4 h-4 rounded-md bg-amber-100 flex items-center justify-center">
                  <PiggyBank className="text-amber-600" size={8} />
                </div>
              </div>
              <div className="text-[4px] text-gray-500 mb-0.5">Piggy</div>
              <div className="text-[8px] font-bold text-gray-900">₦45,800</div>
              <div className="w-full h-0.5 bg-gray-200 rounded-full mt-1">
                <div className="w-[60%] h-full bg-amber-500 rounded-full"></div>
              </div>
            </div>

            {/* ICA Card with glassmorphism */}
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-2 shadow-sm border border-white/40">
              <div className="flex items-center gap-0.5 mb-1">
                <div className="w-4 h-4 rounded-md bg-blue-100 flex items-center justify-center">
                  <Target className="text-blue-600" size={8} />
                </div>
              </div>
              <div className="text-[4px] text-gray-500 mb-0.5">ICA Progress</div>
              <div className="text-[8px] font-bold text-gray-900">₦180,000</div>
              <div className="w-full h-0.5 bg-gray-200 rounded-full mt-1">
                <div className="w-[80%] h-full bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Total Contributions with glassmorphism */}
          <div className="bg-white/80 backdrop-blur-xl rounded-lg p-2 shadow-sm border border-white/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[5px] text-gray-500">Total Contributions</span>
              <TrendingUp className="text-green-500" size={7} />
            </div>
            <div className="text-[10px] font-bold text-gray-900 mb-1.5">₦225,800</div>
            <div className="space-y-0.5">
              <div className="flex justify-between text-[5px]">
                <span className="text-gray-500">This month</span>
                <span className="font-semibold text-gray-900">₦15,000</span>
              </div>
              <div className="flex justify-between text-[5px]">
                <span className="text-gray-500">Average</span>
                <span className="font-semibold text-gray-900">₦12,500</span>
              </div>
            </div>
          </div>

          {/* Streak Card with glassmorphism */}
          <div 
            className="relative rounded-lg p-2 text-white shadow-sm overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.95), rgba(239, 68, 68, 0.95))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10 flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Award className="text-white" size={10} />
              </div>
              <div>
                <div className="text-[5px] opacity-80">Contribution Streak</div>
                <div className="text-[9px] font-bold">3 Months</div>
              </div>
            </div>
          </div>

          {/* Next Payment with glassmorphism */}
          <div className="bg-white/80 backdrop-blur-xl rounded-lg p-2 shadow-sm border border-white/40">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-purple-100 flex items-center justify-center">
                <Calendar className="text-purple-600" size={9} />
              </div>
              <div>
                <div className="text-[4px] text-gray-500">Next Contribution Due</div>
                <div className="text-[6px] font-semibold text-gray-900">February 1, 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-1.5">
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-0.5">
              <Home size={10} className="text-blue-600" />
              <span className="text-[4px] font-medium text-blue-600">Home</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <TrendingUp size={10} className="text-gray-400" />
              <span className="text-[4px] text-gray-400">Contribute</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Wallet size={10} className="text-gray-400" />
              <span className="text-[4px] text-gray-400">Wallet</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <User size={10} className="text-gray-400" />
              <span className="text-[4px] text-gray-400">Profile</span>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="relative">
      {/* Phone shadow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-blue-600/20 blur-2xl scale-95 rounded-[2.5rem]"></div>
      
      {/* Four-sided light convergence effect */}
      <div className="absolute -inset-[2px] rounded-[2.5rem] overflow-hidden z-0">
        {/* Top light beam */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.9), transparent)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: [0, 1, 0.5] }}
          transition={{ duration: 0.8, ease: "easeOut", repeat: Infinity, repeatDelay: 3 }}
        />
        
        {/* Right light beam */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-0.5"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.9), transparent)',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: [0, 1, 0.5] }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut", repeat: Infinity, repeatDelay: 3 }}
        />
        
        {/* Bottom light beam */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.9), transparent)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: [0, 1, 0.5] }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut", repeat: Infinity, repeatDelay: 3 }}
        />
        
        {/* Left light beam */}
        <motion.div
          className="absolute top-0 left-0 bottom-0 w-0.5"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.9), transparent)',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: [0, 1, 0.5] }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut", repeat: Infinity, repeatDelay: 3 }}
        />
        
        {/* Rotating swirl after convergence */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'conic-gradient(from 0deg, transparent 70%, rgba(59, 130, 246, 0.7) 80%, rgba(96, 165, 250, 0.7) 90%, transparent 100%)',
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
            repeat: Infinity,
            repeatDelay: 0.7
          }}
        />
      </div>

      {/* Soft outer glow */}
      <motion.div
        className="absolute -inset-1.5 rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 to-blue-600/20 blur-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: [0, 0.6, 0.3],
          scale: [0.95, 1.02, 1],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2.5
        }}
      />
      
      {/* iPhone 16 body - Titanium frame with glassmorphism - Smaller size */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut", repeat: Infinity, repeatDelay: 3.2 }}
        className="relative rounded-[2.5rem] p-[2px] shadow-2xl z-10" 
        style={{ 
          width: '240px', 
          height: '440px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.18)'
        }}
      >
        {/* Titanium frame with glassmorphism */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-gray-800/90 via-gray-900/90 to-black/90 backdrop-blur-xl"></div>
        
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-black/95 backdrop-blur-md rounded-full z-20 flex items-center justify-center border border-white/5">
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
        </div>
        
        {/* Screen with glassmorphism */}
        <div className="relative bg-white/95 backdrop-blur-2xl rounded-[2.4rem] overflow-hidden h-full border border-white/20">
          {screens[variant]}
        </div>
      </motion.div>
    </div>
  );
};

export default iPhone16Mockup;
