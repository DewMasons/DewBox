import React from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const Modal = ({ onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div
                className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes className="text-xl" />
                </button>
                {children}
            </motion.div>
        </div>
    );
};

export default Modal;