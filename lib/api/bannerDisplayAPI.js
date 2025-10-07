import api from '../api-service';

export const bannerDisplayAPI = {
  // Get active banners for display (public endpoint)
  getActiveBanners: async (position = 'top') => {
    try {
      const response = await api.get(`/banners/active?position=${position}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active banners:', error);
      return { success: false, data: [] };
    }
  },

  // Get all active banners for different positions
  getAllActiveBanners: async () => {
    try {
      const response = await api.get('/banners/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching all active banners:', error);
      return { success: false, data: [] };
    }
  },

  // Track banner impression (for analytics)
  trackImpression: async bannerId => {
    try {
      await api.post(`/banners/${bannerId}/impression`);
    } catch (error) {
      console.error('Error tracking banner impression:', error);
    }
  },

  // Track banner click (for analytics)
  trackClick: async bannerId => {
    try {
      await api.post(`/banners/${bannerId}/click`);
    } catch (error) {
      console.error('Error tracking banner click:', error);
    }
  }
};
