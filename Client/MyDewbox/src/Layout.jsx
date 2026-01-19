import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X, PiggyBank, Users, CreditCard, Wallet, Briefcase, TrendingUp, Building2, ShoppingBag } from "lucide-react";
import iPhone16Mockup from "./components/iPhone16Mockup";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Scroll progress for the hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Hero content opacity and scale (keep visible longer)
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);
  const heroContentScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.95]);

  // Card animations - keep phone visible longer
  const cardScale = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [1, 1, 0.85, 0.75]);
  const cardY = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, 0, -50, -150]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.5, 0.9, 1], [1, 1, 0.7, 0]);

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Optimized animated gradient background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient - Blue spectrum */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-600"></div>
        
        {/* Optimized animated blobs - Reduced to 2 for performance */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 -left-20 w-96 h-96 bg-gradient-to-br from-sky-300 to-cyan-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60"
        />
        
        {/* Lighter glassmorphism overlay for better performance */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/5"></div>
      </div>
      {/* Navigation Bar - Optimized glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <span className="text-2xl font-bold text-white">C</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white tracking-tight leading-none">
                    COOPEX
                  </span>
                  <span className="text-xs text-white/80 font-medium">
                    my dewbox
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <a
                href="#features"
                className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Personal
              </a>
              <a
                href="#services"
                className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Business
              </a>
              <a
                href="#about"
                className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Company
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={handleSignIn}
                className="px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 rounded-full transition-all duration-200 border border-white/30"
              >
                Log in
              </button>
              <button
                onClick={handleGetStarted}
                className="px-6 py-2.5 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-white/95 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="text-white" size={24} />
              ) : (
                <Menu className="text-white" size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-3">
                <a
                  href="#features"
                  className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Personal
                </a>
                <a
                  href="#services"
                  className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Business
                </a>
                <a
                  href="#about"
                  className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Company
                </a>
                <div className="pt-4 space-y-3 border-t border-gray-200">
                  <button
                    onClick={handleSignIn}
                    className="w-full px-6 py-3 text-gray-700 font-semibold border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-all"
                  >
                    Log in
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
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
        className="relative h-[200vh]"
      >
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 sm:pt-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                style={{ 
                  opacity: heroContentOpacity,
                  scale: heroContentScale
                }}
                className="text-white z-20"
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

              {/* Right Content - iPhone 16 mockup with actual app */}
              <motion.div
                style={{ 
                  scale: cardScale,
                  y: cardY,
                  opacity: cardOpacity
                }}
                className="relative flex justify-center items-center min-h-[500px] z-20"
              >
                <iPhone16Mockup variant="home" />
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

      {/* Next Section with seamless transition */}
      <motion.section
        id="features"
        style={{
          opacity: nextSectionOpacity,
          y: nextSectionY
        }}
        className="relative min-h-screen flex items-center justify-center py-20"
      >
        {/* Optimized seamless glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/15 to-white/25 backdrop-blur-sm"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              watch your contributions grow — all with COOPEX my dewbox.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-white/40"
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
              className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300 md:scale-105 border border-white/50"
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
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
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-white/40"
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

      {/* Services Section with seamless transition */}
      <section id="services" className="relative py-20">
        {/* Optimized seamless glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/15 to-transparent backdrop-blur-sm"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-white/40 hover:bg-white/70"
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

      {/* Footer - Optimized */}
      <footer className="relative bg-gray-900/90 backdrop-blur-sm text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="block">COOPEX</span>
                <span className="text-sm font-medium text-gray-400">my dewbox</span>
              </h3>
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
