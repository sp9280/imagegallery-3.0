// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }
  }, []);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    try {
      if (userData) localStorage.setItem("user", JSON.stringify(userData));
      if (jwt) localStorage.setItem("token", jwt);
    } catch (e) {
      console.error("Error persisting user data:", e);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // Validate and refresh profile details in background
      api.get("/user/profile")
        .then((res) => {
          const profileUser = res.data?.data?.user;
          if (profileUser) {
            setUser(profileUser);
            try {
              localStorage.setItem("user", JSON.stringify(profileUser));
            } catch (e) {}
          }
        })
        .catch((err) => {
          // If token is explicitly unauthorized/forbidden, log out
          if (err.response?.status === 401 || err.response?.status === 403) {
            logout();
          }
        });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
