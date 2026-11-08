// Enhanced Footer with Modern Design - Professional (No Emojis)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiHeart, FiGithub, FiTwitter, FiInstagram, FiFacebook, 
  FiMail, FiImage, FiSend, FiArrowUp 
} from 'react-icons/fi';

const EnhancedFooter = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: FiGithub, href: '#', label: 'GitHub', color: 'hover:bg-gray-700' },
    { icon: FiTwitter, href: '#', label: 'Twitter', color: 'hover:bg-blue-500' },
    { icon: FiInstagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: FiFacebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: FiMail, href: 'mailto:contact@imagegallery.com', label: 'Email', color: 'hover:bg-red-500' }
  ];

  const footerLinks = {
    'Product': [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Gallery', href: '/' },
      { label: 'Mobile App', href: '/mobile' }
    ],
    'Company': [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Partners', href: '/partners' }
    ],
    'Resources': [
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'API Docs', href: '/api' }
    ],
    'Legal': [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Licenses', href: '/licenses' }
    ]
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white mt-24 overflow-hidden neon-border-top">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-teal-500"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none floating"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none floating" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              {/* Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-cyan-500 to-purple-500 p-2.5 rounded-xl shadow-lg floating">
                    <FiImage className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black gradient-text neon-text">
                    ImageGallery
                  </h3>
                  <p className="text-xs text-gray-400">Professional Platform</p>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                A stunning, professional image gallery platform where creativity meets technology. 
                Share your world, discover amazing visuals, and connect with creators worldwide.
              </p>

              {/* Social Links */}
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 bg-gray-800 rounded-xl transition-all duration-300 hover-lift ${social.color}`}
                    title={social.label}
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.05 }}
            >
              <h4 className="text-base font-bold mb-4 text-white">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-200 text-sm hover:translate-x-1 inline-block group"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl p-8 mb-12 overflow-hidden glass-card"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-teal-600 opacity-90"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm"
            >
              <FiMail className="text-white" size={32} />
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">Stay Updated!</h3>
            <p className="text-white/90 mb-6 text-sm md:text-base">
              Get the latest features, tips, and inspiration delivered to your inbox
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 bg-white outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-creative flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <FiSend size={16} />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400"
        >
          <div className="flex items-center gap-2">
            <p className="flex items-center gap-2">
              © {currentYear} ImageGallery. Made with 
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                className="inline-block"
              >
                <FiHeart className="text-red-500" />
              </motion.span>
              by creative developers
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
            
            {/* Scroll to Top Button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 rounded-lg transition-all hover-lift"
              title="Scroll to top"
            >
              <FiArrowUp size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;