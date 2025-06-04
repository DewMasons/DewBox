import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  Home,
  PiggyBank,
  CreditCard,
  User,
  LogOut,
  Menu,
  Bell
} from "lucide-react";
import { useAuthStore } from "../store/authstore";
import DMLogo from "../assets/DMLogo.png";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    localStorage.removeItem('token');
    logout();
    navigate('/signin');
  };

  const mainNavItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/dashboard/contribute", icon: PiggyBank, label: "Contribute" },
    { path: "/dashboard/transactions", icon: CreditCard, label: "Transactions" },
    { path: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Header with logo, notification, and menu */}
      {/* Removed logo and app name from mobile header, now handled by Header.jsx */}
      <div className="md:hidden flex items-center justify-end px-4 py-3 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        {/* Only menu and notification icons are now in Header.jsx */}
      </div>
      {/* Sidebar for desktop */}
      <motion.nav
        className={clsx(
          "hidden md:flex fixed top-0 left-0 h-screen w-64 p-6 bg-white border-r border-gray-200 flex-col justify-between z-30"
        )}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Removed logo and app name from sidebar */}
        <div className="flex-1 space-y-2 mt-8">
          {mainNavItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <Icon size={22} className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-all w-full mt-8"
        >
          <LogOut size={22} />
          Logout
        </button>
      </motion.nav>
      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)}></div>
            {/* Drawer */}
            <motion.div
              className="relative w-64 bg-white h-full shadow-xl flex flex-col justify-between p-6"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Removed logo and app name from drawer */}
              <div className="flex-1 space-y-2 mt-8">
                {mainNavItems.map(({ path, icon: Icon, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={22} className="shrink-0" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-all w-full mt-8"
              >
                <LogOut size={22} />
                Logout
              </button>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;