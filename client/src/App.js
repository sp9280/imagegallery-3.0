// client/src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { GalleryProvider } from "./context/GalleryContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Toast from "./components/common/Toast";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Upload from "./components/gallery/Upload";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import AdminPanel from "./components/admin/AdminPanel";
import TermsAndConditions from "./components/common/TermsAndConditions";
import ManageUsers from "./components/admin/ManageUsers";
import Dashboard from "./components/admin/Dashboard";
import Layout from "./components/layout/Layout";
// import "./styles/style.css"; // Removing old global styles in favor of Tailwind
import "./styles/enhanced.css";
import { initTheme } from "./styles/theme";

// Initialize theme on app start
initTheme();

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories/:category" element={<Categories />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Protected Routes (Authenticated users only) */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .catch(err => console.log('Service worker registration failed:', err));
    }
  }, []);

  return (
    <AuthProvider>
      <GalleryProvider>
        <Router>
          <Layout>
            <Toast />
            <TermsAndConditions />
            <AnimatedRoutes />
          </Layout>
        </Router>
      </GalleryProvider>
    </AuthProvider>
  );
};

export default App;
