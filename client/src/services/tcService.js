// client/src/services/tcService.js
import api from "./api";

const tcService = {
  /**
   * Check T&C acceptance status for current IP
   */
  checkTCStatus: async () => {
    try {
      const response = await api.get("/auth/tc/status");
      return response.data;
    } catch (error) {
      console.error("Failed to check T&C status:", error);
      throw error;
    }
  },

  /**
   * Accept T&C and Privacy Policy
   */
  acceptTC: async (cookiePreference = "all") => {
    try {
      const response = await api.post("/auth/tc/accept", { cookiePreference });
      return response.data;
    } catch (error) {
      console.error("Failed to accept T&C:", error);
      throw error;
    }
  },

  /**
   * Reject T&C (accept only essential cookies)
   */
  rejectTC: async () => {
    try {
      const response = await api.post("/auth/tc/reject");
      return response.data;
    } catch (error) {
      console.error("Failed to reject T&C:", error);
      throw error;
    }
  },
};

export default tcService;