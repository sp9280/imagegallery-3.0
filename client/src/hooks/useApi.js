// client/src/hooks/useApi.js
import { useState, useCallback } from "react";
import api from "../services/api";

/**
 * Custom hook for handling API calls with loading and error state
 * Example usage:
 *   const { request, loading, error } = useApi();
 *   const data = await request(() => api.get('/media'));
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      return response.data;
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Request failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
};
