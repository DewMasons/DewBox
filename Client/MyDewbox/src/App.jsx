import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import RoutesConfig from "./routes";
import { useThemeInit } from "./hooks/useThemeInit";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
    mutations: {
      // Error handling done at component level
    }
  }
});

const App = () => {
  // Initialize theme on app load
  useThemeInit();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="template-wrapper"
    >
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <RoutesConfig />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocesLoss
            draggable
            pauseOnHover
          />
        </ErrorBoundary>
      </QueryClientProvider>
    </motion.div>
  );
};

export default App;