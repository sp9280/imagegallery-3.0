// client/src/components/auth/Register.js
import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [verificationData, setVerificationData] = useState({
    code: "",
  });
  const [step, setStep] = useState("register"); // "register" or "verify"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleVerificationChange = (e) =>
    setVerificationData({ ...verificationData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      if (res.data.status === "success") {
        setStep("verify");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-email", {
        email: formData.email,
        code: verificationData.code
      });
      if (res.data.status === "success") {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card glass-card">
          {/* Header */}
          <div className="login-header">
            <h1 className="gradient-text">Create Account</h1>
            <p>Join ImageGallery and start sharing</p>
          </div>

          {/* Form */}
          {step === "register" ? (
            <form onSubmit={handleSubmit} className="login-form">
              {/* Username Input */}
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="form-input input-creative"
                />
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input input-creative"
                />
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input input-creative"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Show" : "Hide"}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn btn-creative"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="login-form">
              {/* Verification Code Input */}
              <div className="form-group">
                <label className="form-label">Verification Code</label>
                <input
                  type="text"
                  name="code"
                  placeholder="Enter 6-digit code from email"
                  value={verificationData.code}
                  onChange={handleVerificationChange}
                  required
                  maxLength="6"
                  className="form-input input-creative"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Check your email for the verification code
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn btn-creative"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>

              {/* Back to Register */}
              <button
                type="button"
                onClick={() => setStep("register")}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← Back to Registration
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="login-divider">
            <div></div>
            <span>or</span>
            <div></div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="signup-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="back-to-home-container">
          <Link to="/" className="back-to-home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
