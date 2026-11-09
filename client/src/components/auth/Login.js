// client/src/components/auth/Login.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  PhotoIcon,
  LockClosedIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  KeyIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { identifier, password });
      login(res.data.data.user, res.data.data.token);
      navigate("/");
    } catch (err) {
      if (!err.response) {
        setError("Cannot connect to backend server. Please verify the server is running on port 4000.");
      } else {
        setError(err.response?.data?.message || "Invalid email/username or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (role) => {
    if (role === "admin") {
      setIdentifier("admin@example.com");
      setPassword("Admin@123");
    } else {
      setIdentifier("user@example.com");
      setPassword("User@123");
    }
    setError("");
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      {/* Ambient background glow */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] border border-slate-200/80 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-white mx-auto shadow-[0_0_25px_rgba(0,245,212,0.3)]">
            <PhotoIcon className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-[11px] font-bold text-cyan-400">
              <SparklesIcon className="w-3 h-3" />
              <span>Welcome Back Creator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Sign In to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
                ImageGallery
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Access your saved art, upload works, and connect with creators.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium animate-fade-in-down">
            {error}
          </div>
        )}

        {/* Quick Credentials Test Helper */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            <KeyIcon className="w-3.5 h-3.5" /> Quick Fill Demo Credentials
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillQuickCredentials("admin")}
              className="flex-1 py-1 px-2.5 rounded-lg text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 transition-colors"
            >
              Fill Admin
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials("user")}
              className="flex-1 py-1 px-2.5 rounded-lg text-[11px] font-semibold bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/50 hover:bg-cyan-100 transition-colors"
            >
              Fill User
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Email or Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                <EnvelopeIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="admin@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                <LockClosedIcon className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-cyan-400 dark:hover:text-cyan-400 transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,245,212,0.25)] hover:shadow-[0_0_35px_rgba(0,245,212,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Signing In..." : "Sign In to ImageGallery"}</span>
            {!loading && <ArrowRightIcon className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer Links */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-bold text-cyan-500 dark:text-cyan-400 hover:underline"
            >
              Sign up free
            </Link>
          </p>
          <Link
            to="/"
            className="inline-block text-xs font-semibold text-slate-400 hover:text-cyan-400 dark:hover:text-cyan-400 transition-colors"
          >
            ← Back to Gallery Feed
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
