// client/src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

/**
 * Provides auth utilities and context data
 * Example:
 *   const { user, loginUser, logout } = useAuth();
 */
export const useAuth = () => {
  const { user, token, login, logout } = useContext(AuthContext);

  const loginUser = async (identifier, password) => {
    try {
      const res = await api.post("/auth/login", { identifier, password });
      if (res.data.status === "success") {
        login(res.data.data.token, res.data.data.user);
        return { success: true, user: res.data.data.user };
      }
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: err.response?.data?.message || "Login failed" };
    }
  };

  const registerUser = async (username, email, password) => {
    try {
      const res = await api.post("/auth/register", { username, email, password });
      if (res.data.status === "success") {
        login(res.data.data.token, res.data.data.user);
        return { success: true, user: res.data.data.user };
      }
    } catch (err) {
      console.error("Registration failed:", err);
      return { success: false, error: err.response?.data?.message || "Registration failed" };
    }
  };

  return {
    user,
    token,
    loginUser,
    registerUser,
    logout,
  };
};
