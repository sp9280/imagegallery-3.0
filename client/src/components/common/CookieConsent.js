import React, { useState, useEffect } from "react";
import axios from "axios";

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

  useEffect(() => {
    checkVisitorStatus();
  }, []);

  const checkVisitorStatus = async () => {
    try {
      // Check local storage first
      const localConsent = localStorage.getItem("cookieConsent");
      if (localConsent) {
        setLoading(false);
        setShow(false);
        return;
      }

      // Check visitor status from server (IP-based)
      const response = await axios.get(`${API_BASE}/visitor/status`);
      const { hasAcceptedTerms, isNewVisitor } = response.data.data;

      // Show banner only for new visitors or those who haven't accepted
      if (isNewVisitor || !hasAcceptedTerms) {
        setShow(true);
      }
    } catch (error) {
      console.error("Error checking visitor status:", error);
      // If error, check localStorage and show if not set
      const localConsent = localStorage.getItem("cookieConsent");
      if (!localConsent) {
        setShow(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const acceptAllCookies = async () => {
    try {
      // Accept all cookies (analytics, marketing, etc.)
      localStorage.setItem("cookieConsent", "all");
      localStorage.setItem("cookieAnalytics", "true");
      localStorage.setItem("cookieMarketing", "true");
      
      // Record acceptance on server
      await axios.post(`${API_BASE}/visitor/accept-terms`);
      
      setShow(false);
    } catch (error) {
      console.error("Error accepting cookies:", error);
      // Still close the banner locally
      setShow(false);
    }
  };

  const rejectCookies = async () => {
    try {
      // Reject optional cookies, accept only essential
      localStorage.setItem("cookieConsent", "essential");
      localStorage.setItem("cookieAnalytics", "false");
      localStorage.setItem("cookieMarketing", "false");
      
      // Record rejection on server
      await axios.post(`${API_BASE}/visitor/accept-terms`);
      
      setShow(false);
    } catch (error) {
      console.error("Error rejecting cookies:", error);
      // Still close the banner locally
      setShow(false);
    }
  };

  if (loading || !show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 z-[10000] shadow-2xl border-t-4 border-orange-500 animate-slide-up">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              🍪 Cookie & Privacy Policy
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              We use cookies to enhance your experience, analyze site traffic, and provide personalized content. 
              By clicking <strong>"Accept All"</strong>, you consent to all cookies. 
              Click <strong>"Essential Only"</strong> to accept only necessary cookies required for the site to function.
            </p>
            <div className="mt-2">
              <a 
                href="/privacy" 
                className="text-xs text-orange-400 hover:text-orange-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Privacy Policy
              </a>
              {" • "}
              <a 
                href="/terms" 
                className="text-xs text-orange-400 hover:text-orange-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={acceptAllCookies}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg transition-all transform hover:scale-105 whitespace-nowrap"
            >
              Accept All
            </button>
            <button
              onClick={rejectCookies}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-lg transition-all border border-gray-600 hover:border-gray-500 whitespace-nowrap"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
