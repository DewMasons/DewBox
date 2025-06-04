import React, { useState } from "react";
import {motion, AnimatePresence} from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthCarousel from "./components/AuthCarousel";
import Modal from "./components/Modal";
import { FaCheckCircle } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Layout = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const pages = [
    {
      title: "Welcome to MyDewbox",
      src: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      content: "Empowering Communities Through Innovation",
    },
    {
      title: "Our Services",
      src: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      content: ` Get a Grant To Start or Expand A Business, 
                  Get Your Piggy, Mobile and Web Wallets`,
    },
    {
      title: "Join Us",
      src: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      content: "Microsavings, MicroInvestments, MicroCredit, eSusu, Shop, Pay: Secure and Unprecedented!",
    },
    {
      title: "Get Started with MyDewbox",
      src: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      content: "Begin your journey with MyDewbox today",
      showButtons: true
    }
  ];
  const handleSignIn = () => {
    navigate("/signin");
  };
  const handleGetStarted = () => {
    navigate("/subscribeto");
  };
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };
  return (
    <div className="min-h-screen grid md:grid-cols-2 grid-cols-1">
      {/* Left Section - Carousel */}
      <div className="hidden md:block h-screen bg-gray-50">
        <AuthCarousel />
      </div>
      {/* Right Section - Content */}
      <div className="flex flex-col p-4 md:p-8 bg-white max-h-screen overflow-y-auto">
        {/* Mobile Carousel */}
        <div className="md:hidden mb-6">
          <div className="relative bg-white rounded-lg shadow-lg p-6">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <img src={pages[currentPage].src} alt={pages[currentPage].title} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold mb-2 text-blue-700">{pages[currentPage].title}</h3>
              <p className="text-gray-600 mb-4">{pages[currentPage].content}</p>
              {pages[currentPage].showButtons && (
                <div className="flex gap-4 mt-4">
                  <button onClick={handleSignIn} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Sign In</button>
                  <button onClick={handleGetStarted} className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">Get Started</button>
                </div>
              )}
            </motion.div>
            {/* Carousel navigation */}
            <div className="flex justify-between items-center mt-4">
              <button onClick={prevPage} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {pages.map((_, idx) => (
                  <span key={idx} className={`w-2 h-2 rounded-full ${idx === currentPage ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                ))}
              </div>
              <button onClick={nextPage} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        {/* Desktop Content */}
        <div className="hidden md:block  ">
          <motion.div
            className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-10">
              <div className=" p-6 rounded-lg border-0 border-top-gray-200">
                <h2 className="text-xl md:text-2xl text-blue-600 font-bold mb-4">
                  MyDewbox Services
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong>Get a Grant To Start or Expand A Business</strong> </p>
                    <br />
                    <div class="inline-flex items-center gap-x-2"><FaCheckCircle color="blue"/> <p className="text-black">Get Your Piggy, Mobile and Web Wallets{" "}</p></div>
                    
                 
                  <div class="inline-flex items-center gap-x-2"> <FaCheckCircle color="blue"/><p className="text-gray-700">
                    Microsavings, MicroInvestments, MicroCredit, eSusu, Shop, Pay</p></div><br /><br />
                   <p className="text-gray-700"> <strong>Secure and Unprecedented!</strong>
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleSignIn}
                  className="btn btn-primary w-full md:w-auto"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="btn bg-gray-900 w-full md:w-auto"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-8">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Contact Us</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            // Handle form submission
            toast.success("Message sent successfully!");
          }} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Your email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea
                className="textarea textarea-bordered w-full h-32"
                placeholder="Your message"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
        {/* Footer */}
        <footer className="mt-auto py-4 text-center text-gray-600">
          <p>&copy; 2025 Dew Masons &amp; Kindred Limited. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;