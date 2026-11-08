// client/src/components/common/TermsAndConditions.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getCurrentTheme } from "../../styles/theme";
import visitorService from "../../services/visitorService";

const TermsAndConditions = () => {
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentTheme = getCurrentTheme();

  useEffect(() => {
    // Only check for public (non-authenticated) visitors
    if (!user) {
      checkTCStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [show]);

  const checkTCStatus = async () => {
    try {
      const response = await visitorService.checkTermsAcceptance();
      const { hasAcceptedTerms } = response.data;
      
      // Show modal if not accepted
      if (!hasAcceptedTerms) {
        setShow(true);
      }
    } catch (error) {
      console.error("Error checking T&C status:", error);
      // If error, show modal to be safe for new visitors
      setShow(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      await visitorService.acceptTerms();
      setShow(false);
      // Also accept cookie consent
      localStorage.setItem("cookieConsent", "accepted");
    } catch (error) {
      console.error("Failed to accept T&C:", error);
      alert("Failed to save your preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      // Call reject endpoint (which still accepts but with essential cookies only)
      await visitorService.rejectTerms();
      setShow(false);
      // Accept only essential cookies
      localStorage.setItem("cookieConsent", "essential");
    } catch (error) {
      console.error("Failed to process T&C:", error);
      alert("Failed to save your preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  // Prevent any clicks from propagating
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1rem',
        overflow: 'auto'
      }}
      onClick={stopPropagation}
    >
      <div 
        style={{
          backgroundColor: currentTheme === 'dark' ? '#1f2937' : 'white',
          borderRadius: '1rem',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          margin: 'auto',
          position: 'relative'
        }}
        onClick={stopPropagation}
      >
        {/* Header */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            padding: '1.5rem 2rem',
            color: 'white',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem'
          }}
        >
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>
            📋 Terms & Conditions & Privacy Policy
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            Please read carefully before using our service
          </p>
        </div>

        {/* Content */}
        <div 
          style={{
            padding: '2rem',
            overflowY: 'auto',
            flex: 1,
            color: currentTheme === 'dark' ? '#d1d5db' : '#374151'
          }}
        >
          {/* Terms Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#f97316' }}>
              📋 Terms of Service
            </h3>
            <p style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>
              By using ImageGallery, you agree to these terms:
            </p>
            <ul style={{ listStyle: 'disc', marginLeft: '1.5rem', marginBottom: '0.75rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>You must be at least 13 years old</li>
              <li style={{ marginBottom: '0.5rem' }}>You are responsible for your account credentials</li>
              <li style={{ marginBottom: '0.5rem' }}>You agree not to upload illegal or offensive content</li>
              <li style={{ marginBottom: '0.5rem' }}>We reserve the right to remove content that violates these terms</li>
              <li style={{ marginBottom: '0.5rem' }}>Your uploads may be visible to other users (unless marked private)</li>
              <li style={{ marginBottom: '0.5rem' }}>You retain ownership of your uploaded content</li>
            </ul>
          </div>

          {/* Privacy Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#f97316' }}>
              🔒 Privacy Policy
            </h3>
            <p style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>
              We collect and use your data as follows:
            </p>
            <ul style={{ listStyle: 'disc', marginLeft: '1.5rem', marginBottom: '0.75rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Personal Data:</strong> Username, email, profile information (registered users)</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Content Data:</strong> Uploaded images/videos and metadata</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>IP Tracking:</strong> We track visitor IP addresses to count visits and prevent abuse</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Usage Data:</strong> Browser info, viewing history, interaction with media</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Comments:</strong> Public comments include your IP address for moderation</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Cookies:</strong> Session and preference cookies for functionality</li>
              <li style={{ marginBottom: '0.5rem' }}>We do not sell your data to third parties</li>
              <li style={{ marginBottom: '0.5rem' }}>Your data is protected with industry-standard security measures</li>
            </ul>
          </div>

          {/* Cookies Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#f97316' }}>
              🍪 Cookie Policy
            </h3>
            <p style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>
              <strong>Essential Cookies (always enabled):</strong> Authentication, security, site functionality
            </p>
            <p style={{ lineHeight: 1.6 }}>
              <strong>Optional Cookies (requires consent):</strong> Analytics, personalization, advertisements
            </p>
          </div>

          {/* Important Notice */}
          <div 
            style={{
              backgroundColor: currentTheme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#dbeafe',
              borderLeft: '4px solid #3b82f6',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginTop: '1rem'
            }}
          >
            <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: currentTheme === 'dark' ? '#93c5fd' : '#1e40af' }}>
              📌 You must accept these terms to use our website.
            </p>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: currentTheme === 'dark' ? '#bfdbfe' : '#1e3a8a' }}>
              <strong>Accept:</strong> All features + analytics cookies<br/>
              <strong>Reject:</strong> All features + essential cookies only
            </p>
            <p style={{ fontSize: '0.875rem', margin: 0, color: currentTheme === 'dark' ? '#bfdbfe' : '#1e3a8a' }}>
              We track visitor IPs for analytics, abuse prevention, and visit counting. Your privacy is respected.
            </p>
          </div>
        </div>

        {/* Footer with Buttons */}
        <div 
          style={{
            padding: '1.5rem 2rem',
            borderTop: `2px solid ${currentTheme === 'dark' ? '#475569' : '#fed7aa'}`,
            display: 'flex',
            gap: '1rem',
            backgroundColor: currentTheme === 'dark' ? '#374151' : '#f9fafb',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem'
          }}
        >
          <button
            onClick={handleReject}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.875rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              color: 'white',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? "Processing..." : "Reject"}
          </button>
          <button
            onClick={handleAccept}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.875rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
              color: 'white',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? "Processing..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;