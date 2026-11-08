// Enhanced Toast Notifications Component
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

// Custom styled toast notifications
export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      icon: <FiCheckCircle className="text-green-500" />,
      ...options
    });
  },
  error: (message, options = {}) => {
    toast.error(message, {
      icon: <FiAlertCircle className="text-red-500" />,
      ...options
    });
  },
  info: (message, options = {}) => {
    toast.info(message, {
      icon: <FiInfo className="text-blue-500" />,
      ...options
    });
  },
  warning: (message, options = {}) => {
    toast.warning(message, {
      icon: <FiAlertCircle className="text-yellow-500" />,
      ...options
    });
  }
};

const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="toast-container"
      toastClassName="toast-item"
      bodyClassName="toast-body"
      progressClassName="toast-progress"
      closeButton={({ closeToast }) => (
        <button
          onClick={closeToast}
          className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX size={18} />
        </button>
      )}
      style={{
        fontFamily: 'inherit'
      }}
    />
  );
};

export default Toast;