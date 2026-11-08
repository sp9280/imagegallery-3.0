// client/src/services/visitorService.js
import api from './api';

const visitorService = {
  // Check if visitor has accepted terms
  checkTermsAcceptance: async () => {
    try {
      const response = await api.get('/visitor/status');
      return response.data;
    } catch (error) {
      console.error('Error checking terms acceptance:', error);
      return { data: { hasAcceptedTerms: false, isNewVisitor: true } };
    }
  },

  // Accept terms and conditions
  acceptTerms: async () => {
    try {
      const response = await api.post('/visitor/accept-terms');
      return response.data;
    } catch (error) {
      console.error('Error accepting terms:', error);
      throw error;
    }
  },

  // Reject terms (for show only - backend still marks as accepted)
  rejectTerms: async () => {
    try {
      const response = await api.post('/visitor/reject-terms');
      return response.data;
    } catch (error) {
      console.error('Error processing terms rejection:', error);
      throw error;
    }
  },

  // Get visitor statistics (admin only)
  getStatistics: async () => {
    const response = await api.get('/visitor/stats');
    return response.data;
  },
};

export default visitorService;