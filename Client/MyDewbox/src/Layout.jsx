import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X, PiggyBank, Users, CreditCard, Wallet, Briefcase, TrendingUp, Building2, ShoppingBag } from "lucide-react";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Scroll progress for the hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Background color transition from neon blue to silver/white (Revolut effect)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgb(0, 191, 255)", "rgb(192, 192, 192)", "rgb(255, 255, 255)"]
  );

  // Hero content opacity and scale (pinning effect)
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 0]);
  const heroContentScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Card animations - pinned then zooms
  const cardScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0.7, 0.5]);
  const cardY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0, -100, -300]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [1, 1, 0.5, 0]);

  // Next section fade in
  const nextSectionOpacity = useTransform(scrollYProgress, [0.5, 0.8, 1], [0, 0.5, 1]);
  const nextSectionY = useTransform(scrollYProgress, [0.5, 1], [100, 0]);

  // Navbar scroll state
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleGetStarted = () => {
    navigate("/subscribeto");
  };

  return (
    <div className="bg-white">
      {/* Navigation Bar - Always Transparent */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-white">
                MyDewbox
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-white/90 hover:text-cyan-300 transition-colors"
              >
                Personal
              </a>
              <a
                href="#services"
                className="text-sm font-medium text-white/90 hover:text-cyan-300 transition-colors"
              >
                Business
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-white/90 hover:text-cyan-300 transition-colors"
              >
                Company
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleSignIn}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                Log in
              </button>
              <button
                onClick={handleGetStarted}
                className="px-6 py-2.5 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-cyan-50 transition-all duration-200 shadow-lg"
              >
                Sign up
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="text-white" size={24} />
              ) : (
                <Menu className="text-white" size={24} />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <a
                  href="#features"
                  className="block text-gray-700 font-medium hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Personal
                </a>
                <a
                  href="#services"
                  className="block text-gray-700 font-medium hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Business
                </a>
                <a
                  href="#about"
                  className="block text-gray-700 font-medium hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Company
                </a>
                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleSignIn}
                    className="w-full px-6 py-3 text-gray-700 font-semibold border border-gray-300 rounded-full hover:bg-gray-50 transition"
                  >
                    Log in
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="w-full px-6 py-3 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 transition"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with Pinning Effect */}
      <motion.section
        ref={heroRef}
        style={{ backgroundColor }}
        className="relative h-[200vh]"
      >
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ opacity: heroContentOpacity }}
              className="absolute -top-1/2 -right-1/2 w-full h-full bg-cyan-400/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ opacity: heroContentOpacity }}
              className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-blue-400/20 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 sm:pt-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                style={{ 
                  opacity: heroContentOpacity,
                  scale: heroContentScale
                }}
                className="text-white"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Contribute together,{" "}
                  <span className="block">grow together</span>
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-lg">
                  Join a community of contributors. Build wealth through eSusu, micro-contributions, 
                  and smart financial habits. Start your journey today.
                </p>
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gray-900 text-white rounded-full text-base font-semibold hover:bg-gray-800 transition-all duration-200 shadow-xl inline-flex items-center gap-2"
                >
                  Download the app
                  <ArrowRight size={20} />
                </button>
              </motion.div>

              {/* Right Content - Phone mockup with light convergence effect */}
              <motion.div
                style={{ 
                  scale: cardScale,
                  y: cardY,
                  opacity: cardOpacity
                }}
                className="relative flex justify-center items-center"
              >
                <div className="relative">
                  {/* Four-sided light convergence effect */}
                  <div className="absolute -inset-[2px] rounded-[2rem] overflow-hidden z-0">
                    {/* Top light beam */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-0.5"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.9), transparent)',
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
                        background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.9), transparent)',
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
                        repeat: Infinity,
                        repeatDelay: 0.7
                      }}
                    />
                  </div>

                  {/* Soft outer glow */}
                  <motion.div
                    className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-lg"
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

                  {/* Mock Phone Card - materializes after light convergence */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8, ease: "easeOut", repeat: Infinity, repeatDelay: 3.2 }}
                    className="relative w-full max-w-sm z-10"
                  >
                    <div className="bg-white rounded-3xl shadow-2xl p-6">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-sm text-gray-500">Main Wallet</p>
                          <p className="text-3xl font-bold text-gray-900">₦125,450</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl"></div>
                      </div>

                      {/* Accounts Button */}
                      <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-6 hover:bg-gray-200 transition">
                        My Wallets
                      </button>

                      {/* Transaction */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                            <PiggyBank className="text-cyan-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Piggy Contributions
                            </p>
                            <p className="text-xs text-gray-500">Today, 09:15</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-cyan-600">
                          +₦5,000
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            style={{ opacity: heroContentOpacity }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/50 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Next Section */}
      <motion.section
        id="features"
        style={{
          opacity: nextSectionOpacity,
          y: nextSectionY
        }}
        className="min-h-screen flex items-center justify-center bg-gray-50 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Your salary, reimagined
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Spend smartly, send quickly, sort your salary automatically, and
              watch your contributions grow — all with MyDewbox.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <PiggyBank className="text-gray-600" size={80} strokeWidth={1.5} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">₦45,800</p>
                    <p className="text-sm text-gray-500">Piggy Contributions</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
                    <span className="text-gray-600">Auto-contribute</span>
                  </div>
                  <span className="text-cyan-600 font-medium">+₦5,000</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 md:scale-105"
            >
              <div className="relative h-64 bg-gradient-to-br from-cyan-400 to-blue-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="text-white" size={80} strokeWidth={1.5} />
                </div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium shadow-lg">
                    Join eSusu
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">₦180,000</p>
                    <p className="text-sm text-gray-500">ICA Balance</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-cyan-100 rounded-full"></div>
                    <span className="text-gray-600">Monthly Contribution</span>
                  </div>
                  <span className="text-cyan-600 font-medium">+₦15,000</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 bg-gradient-to-br from-gray-300 to-gray-400">
                <div className="absolute inset-0 flex items-center justify-center">
                  <CreditCard className="text-gray-600" size={80} strokeWidth={1.5} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">₦50,000</p>
                    <p className="text-sm text-gray-500">Available Loan</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
                    <span className="text-gray-600">Quick Access</span>
                  </div>
                  <span className="text-cyan-600 font-medium">Apply Now</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-base font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your finances in one place
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Business Grants",
                description:
                  "Get a grant to start or expand your business with our support",
                icon: Briefcase,
              },
              {
                title: "Digital Wallets",
                description:
                  "Access your Piggy, Mobile and Web Wallets anytime, anywhere",
                icon: Wallet,
              },
              {
                title: "Micro-contributions",
                description:
                  "Contribute small amounts regularly and watch your money grow",
                icon: PiggyBank,
              },
              {
                title: "MicroInvestments",
                description:
                  "Start investing with small amounts and build your portfolio",
                icon: TrendingUp,
              },
              {
                title: "eSusu",
                description:
                  "Join our rotating savings program and access funds when needed",
                icon: Users,
              },
              {
                title: "Shop & Pay",
                description:
                  "Secure payments and shopping with unprecedented convenience",
                icon: ShoppingBag,
              },
            ].map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="text-cyan-600" size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MyDewbox</h3>
              <p className="text-gray-400 text-sm">
                Empowering communities through innovative financial solutions
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Personal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Business
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; 2025 Dew Masons & Kindred Limited. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
