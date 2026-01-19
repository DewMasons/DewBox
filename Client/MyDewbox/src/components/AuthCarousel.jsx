import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, TrendingUp, Wallet, User, PiggyBank, Target, Award, Calendar, ArrowRight, Bell } from 'lucide-react';

/**
 * AuthCarousel - iPhone 16 mockup cycling through actual app screens
 */
const AuthCarousel = () => {
  const [currentScene, setCurrentScene] = useState(0);

  // Define app screens to cycle through
  const scenes = [
    {
      id: 'home',
      title: 'Home Dashboard',
      screen: (
        <div className="h-full bg-gray-50 overflow-hidden pb-16">
          {/* Status Bar */}
          <div className="bg-white px-3 pt-2 pb-1.5 flex items-center justify-between">
            <span className="text-[7px] font-semibold text-gray-900">9:41</span>
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
            <h1 className="text-[9px] font-bold text-gray-900">Welcome back, John! 👋</h1>
            <p className="text-[6px] text-gray-500">3 months contribution streak! 🔥</p>
          </div>

          {/* Content */}
          <div className="p-2.5 space-y-1.5">
            {/* Wallet Balance Card with glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
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
                  <Wallet size={8} />
                  <span className="text-[6px] opacity-80">Wallet Balance</span>
                </div>
                <div className="text-[15px] font-bold mb-0.5">₦125,450</div>
                <div className="text-[5px] opacity-70">Available to spend or contribute</div>
                
                <div className="grid grid-cols-2 gap-1 mt-2">
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-1.5 border border-white/20">
                    <div className="text-[5px] mb-0.5">Add Money</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-1.5 border border-white/20">
                    <div className="text-[5px] mb-0.5">Contribute</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-xl rounded-lg p-2 shadow-sm border border-white/40"
              >
                <div className="flex items-center gap-0.5 mb-1">
                  <div className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center">
                    <PiggyBank className="text-amber-600" size={10} />
                  </div>
                </div>
                <div className="text-[5px] text-gray-500 mb-0.5">Piggy</div>
                <div className="text-[9px] font-bold text-gray-900">₦45,800</div>
                <div className="w-full h-0.5 bg-gray-200 rounded-full mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="h-full bg-amber-500 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-lg p-2 shadow-sm border border-white/40"
              >
                <div className="flex items-center gap-0.5 mb-1">
                  <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center">
                    <Target className="text-blue-600" size={10} />
                  </div>
                </div>
                <div className="text-[5px] text-gray-500 mb-0.5">ICA Progress</div>
                <div className="text-[9px] font-bold text-gray-900">₦180,000</div>
                <div className="w-full h-0.5 bg-gray-200 rounded-full mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full bg-blue-600 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            </div>

            {/* Total Contributions with glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-lg p-2 shadow-sm border border-white/40"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[6px] text-gray-500">Total Contributions</span>
                <TrendingUp className="text-green-500" size={8} />
              </div>
              <div className="text-[11px] font-bold text-gray-900 mb-1.5">₦225,800</div>
              <div className="space-y-0.5">
                <div className="flex justify-between text-[6px]">
                  <span className="text-gray-500">This month</span>
                  <span className="font-semibold text-gray-900">₦15,000</span>
                </div>
                <div className="flex justify-between text-[6px]">
                  <span className="text-gray-500">Average</span>
                  <span className="font-semibold text-gray-900">₦12,500</span>
                </div>
              </div>
            </motion.div>

            {/* Streak Card with glassmorphism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
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
                  <Award className="text-white" size={11} />
                </div>
                <div>
                  <div className="text-[6px] opacity-80">Contribution Streak</div>
                  <div className="text-[10px] font-bold">3 Months</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-1.5">
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-0.5">
                <Home size={11} className="text-blue-600" />
                <span className="text-[5px] font-medium text-blue-600">Home</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <TrendingUp size={11} className="text-gray-400" />
                <span className="text-[5px] text-gray-400">Contribute</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Wallet size={11} className="text-gray-400" />
                <span className="text-[5px] text-gray-400">Wallet</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <User size={11} className="text-gray-400" />
                <span className="text-[5px] text-gray-400">Profile</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'contribute',
      title: 'Contribute',
      screen: (
        <div className="h-full bg-gray-50 overflow-hidden pb-16">
          <div className="bg-white px-3 pt-2 pb-1.5 flex items-center justify-between">
            <span className="text-[7px] font-semibold text-gray-900">9:41</span>
            <div className="flex items-center gap-0.5">
              <svg className="w-2 h-2 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <div className="w-3 h-1.5 border border-gray-900 rounded-[1px] relative">
                <div className="absolute inset-0.5 bg-gray-900 rounded-[0.5px]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white px-3 pb-2">
            <h1 className="text-[9px] font-bold text-gray-900">Make a Contribution</h1>
            <p className="text-[6px] text-gray-500">Choose your contribution type</p>
          </div>

          <div className="p-2.5 space-y-1.5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-3 shadow-sm border-2 border-amber-500"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                  <PiggyBank className="text-amber-600" size={12} />
                </div>
                <div>
                  <div className="text-[7px] font-bold text-gray-900">Piggy Contribution</div>
                  <div className="text-[5px] text-gray-500">Monthly savings</div>
                </div>
              </div>
              <div className="text-[13px] font-bold text-gray-900 mb-1.5">₦5,000</div>
              <button className="w-full py-1.5 bg-amber-500 text-white rounded-lg text-[7px] font-semibold flex items-center justify-center gap-0.5">
                Contribute Now
                <ArrowRight size={8} />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-3 shadow-sm"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Target className="text-blue-600" size={12} />
                </div>
                <div>
                  <div className="text-[7px] font-bold text-gray-900">ICA Contribution</div>
                  <div className="text-[5px] text-gray-500">Yearly investment</div>
                </div>
              </div>
              <div className="text-[13px] font-bold text-gray-900 mb-1.5">₦15,000</div>
              <button className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-[7px] font-semibold flex items-center justify-center gap-0.5">
                Contribute Now
                <ArrowRight size={8} />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-3 border border-purple-200"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Bell className="text-purple-600" size={12} />
                <div className="text-[7px] font-bold text-gray-900">Enable Auto-Pay</div>
              </div>
              <p className="text-[5px] text-gray-600 mb-1.5">Never miss a contribution with automatic payments</p>
              <button className="w-full py-1 bg-purple-600 text-white rounded-md text-[6px] font-semibold">
                Set Up Now
              </button>
            </motion.div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-1.5">
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-0.5">
                <Home size={11} className="text-gray-400" />
                <span className="text-[5px] text-gray-400">Home</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <TrendingUp size={11} className="text-blue-600" />
                <span className="text-[5px] font-medium text-blue-600">Contribute</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Wallet size={11} className="text-gray-400" />
                <span className="text-[5px] text-gray-400">Wallet</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <User size={11} className="text-gray-400" />
                <span className="text-[5px] text-gray-400">Profile</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'wallet',
      title: 'Wallet',
      screen: (
        <div className="h-full bg-gray-50 overflow-hidden pb-16">
          <div className="bg-white px-4 pt-3 pb-2 flex items-center justify-between">
            <span className="text-[8px] font-semibold text-gray-900">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-2.5 h-2.5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <div className="w-4 h-2 border border-gray-900 rounded-[2px] relative">
                <div className="absolute inset-0.5 bg-gray-900 rounded-[1px]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white px-4 pb-3">
            <h1 className="text-[11px] font-bold text-gray-900">My Wallet</h1>
            <p className="text-[7px] text-gray-500">Manage your funds</p>
          </div>

          <div className="p-3 space-y-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 text-white shadow-lg"
            >
              <div className="text-[7px] opacity-80 mb-1">Main Balance</div>
              <div className="text-[22px] font-bold mb-3">₦125,450</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                  <div className="text-[6px] font-semibold">Add</div>
                </button>
                <button className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                  <div className="text-[6px] font-semibold">Send</div>
                </button>
                <button className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                  <div className="text-[6px] font-semibold">Withdraw</div>
                </button>
              </div>
            </motion.div>

            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-[8px] font-bold text-gray-900 mb-2">Recent Transactions</div>
              <div className="space-y-2">
                {[
                  { name: 'Piggy Contribution', amount: '+₦5,000', time: 'Today', color: 'green' },
                  { name: 'Wallet Funding', amount: '+₦20,000', time: 'Yesterday', color: 'green' },
                  { name: 'ICA Contribution', amount: '+₦15,000', time: '2 days ago', color: 'green' }
                ].map((tx, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="text-[7px] font-semibold text-gray-900">{tx.name}</div>
                      <div className="text-[6px] text-gray-500">{tx.time}</div>
                    </div>
                    <div className={`text-[8px] font-bold ${tx.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-0.5">
                <Home size={14} className="text-gray-400" />
                <span className="text-[6px] text-gray-400">Home</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <TrendingUp size={14} className="text-gray-400" />
                <span className="text-[6px] text-gray-400">Contribute</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Wallet size={14} className="text-blue-600" />
                <span className="text-[6px] font-medium text-blue-600">Wallet</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <User size={14} className="text-gray-400" />
                <span className="text-[6px] text-gray-400">Profile</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Auto-advance scenes every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [scenes.length]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div className="relative">
        {/* Simple shadow */}
        <div className="absolute inset-0 bg-slate-900/10 blur-3xl scale-95 rounded-[3rem]"></div>
        
        {/* Professional phone mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[3rem] shadow-2xl" 
          style={{ 
            width: '280px', 
            height: '560px',
            background: '#1a1a1a'
          }}
        >
          {/* Simple top notch - no dynamic island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-20"></div>
          
          {/* Screen */}
          <div className="absolute inset-[3px] bg-white rounded-[2.8rem] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {scenes[currentScene].screen}
              </motion.div>
            </AnimatePresence>

            {/* Simple progress dots */}
            <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-30">
              {scenes.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentScene 
                      ? 'w-6 bg-blue-600' 
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthCarousel;
