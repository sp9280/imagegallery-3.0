// client/src/components/auth/Login.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

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
      // Redirect to upload page after successful login
      navigate("/upload");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
            <h1 className="gradient-text">Welcome Back</h1>
            <p>Login to your ImageGallery account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email/Username Input */}
            <div className="form-group">
              <label className="form-label">
                Email or Username
              </label>
              <input
                type="text"
                placeholder="Enter your email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="form-input input-creative"
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <div></div>
            <span>or</span>
            <div></div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="signup-link">
                Sign up here
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

export default Login;
