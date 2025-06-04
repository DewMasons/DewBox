import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import clsx from "clsx";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Contribute from "./pages/Contribute";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Homepage from "./pages/Home";

const queryClient = new QueryClient();

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-1">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <motion.main
            className={clsx(
              "flex-1 p-8",
              "bg-white",
              "rounded-lg shadow-lg m-6",
              "border border-gray-200"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="contribute" element={<Contribute />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.main>
        </div>
        <Footer />
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
};

export default Dashboard;