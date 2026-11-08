import api from "./api";

/**
 * Authentication service for handling login, register, logout, etc.
 */
class AuthService {
  async login(identifier, password) {
    try {
      const response = await api.post("/auth/login", { identifier, password });
      if (response.data.status === "success") {
        const { user, token } = response.data.data;
        localStorage.setItem("token", token);
        return { success: true, user, token };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  }

  async register(username, email, password) {
    try {
      const response = await api.post("/auth/register", { username, email, password });
      if (response.data.status === "success") {
        const { user, token } = response.data.data;
        localStorage.setItem("token", token);
        return { success: true, user, token };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Registration failed" };
    }
  }

  logout() {
    localStorage.removeItem("token");
  }

  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me");
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to get current user");
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }
}

export default new AuthService();
