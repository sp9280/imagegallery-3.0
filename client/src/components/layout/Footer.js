// client/src/components/layout/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About ImageGallery</h3>
          <p>
            ImageGallery is a modern media-sharing platform that allows users to
            upload, explore, and share beautiful images across the globe.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#help">Help & Support</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#twitter" className="social-link">Twitter</a>
            <a href="#instagram" className="social-link">Instagram</a>
            <a href="#github" className="social-link">GitHub</a>
          </div>
        </div>
      </div>

      <div className="visitors-info">
        © {new Date().getFullYear()} ImageGallery. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
