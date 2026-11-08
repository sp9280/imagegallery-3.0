// client/src/components/common/TermsModal.js
import React, { useState } from "react";
import { getCurrentTheme } from "../../styles/theme";

const TermsModal = ({ onAccept, onDecline }) => {
  const [agreed, setAgreed] = useState(false);
  const currentTheme = getCurrentTheme();

  return (
    <div className={`terms-modal-overlay ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
      <div className={`terms-modal-container ${currentTheme === 'dark' ? 'dark-modal' : ''}`}>
        <div className="terms-modal-header">
          <h2 className="terms-modal-title">Terms and Conditions & Privacy Policy</h2>
        </div>

        <div className="terms-modal-content">
          <div className="terms-section">
            <h3>Privacy Policy</h3>
            <p>
              We respect your privacy. This website tracks visitors by IP address for analytics 
              and to prevent abuse. We collect:
            </p>
            <ul>
              <li>IP addresses for visitor tracking</li>
              <li>Cookies for session management</li>
              <li>User-provided information (if you register)</li>
              <li>Comments and interactions on public content</li>
            </ul>
            <p>
              Your data is not sold to third parties and is used solely for improving your 
              experience on our platform.
            </p>
          </div>

          <div className="terms-section">
            <h3>Terms of Service</h3>
            <p>By using this website, you agree to:</p>
            <ul>
              <li>Not upload offensive, illegal, or copyrighted content without permission</li>
              <li>Respect other users and their content</li>
              <li>Not engage in spamming or malicious activities</li>
              <li>Follow community guidelines and applicable laws</li>
            </ul>
            <p>
              We reserve the right to remove content or ban users who violate these terms.
            </p>
          </div>

          <div className="terms-checkbox">
            <label>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="terms-checkbox-label">
                I have read and agree to the Terms and Conditions and Privacy Policy
              </span>
            </label>
          </div>
        </div>

        <div className="terms-modal-actions">
          <button
            className={`terms-btn terms-btn-accept ${!agreed ? 'disabled' : ''}`}
            onClick={onAccept}
            disabled={!agreed}
          >
            Accept and Continue
          </button>
          <button className="terms-btn terms-btn-decline" onClick={onDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;