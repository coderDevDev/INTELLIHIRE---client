import api from '../api-service';

export const bannerAPI = {
  // Get all banners (admin only)
  getBanners: async (params = {}) => {
    try {
      const response = await api.get('/banners', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  },

  // Get active banners for display
  getActiveBanners: async () => {
    try {
      const response = await api.get('/banners/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active banners:', error);
      throw error;
    }
  },

  // Create new banner
  createBanner: async bannerData => {
    try {
      const response = await api.post('/banners', bannerData);
      return response.data;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },

  // Update banner
  updateBanner: async (id, bannerData) => {
    try {
      const response = await api.put(`/banners/${id}`, bannerData);
      return response.data;
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },

  // Update banner status
  updateBannerStatus: async (id, status) => {
    try {
      const response = await api.patch(`/banners/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating banner status:', error);
      throw error;
    }
  },

  // Delete banner
  deleteBanner: async id => {
    try {
      const response = await api.delete(`/banners/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  },

  // Upload banner image
  uploadBannerImage: async file => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/banners/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading banner image:', error);
      throw error;
    }
  },

  // Get banner analytics
  getBannerAnalytics: async id => {
    try {
      const response = await api.get(`/banners/${id}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching banner analytics:', error);
      throw error;
    }
  },

  // Track banner click
  trackClick: async id => {
    try {
      const response = await api.post(`/banners/${id}/click`);
      return response.data;
    } catch (error) {
      console.error('Error tracking banner click:', error);
      throw error;
    }
  },

  // Track banner impression
  trackImpression: async id => {
    try {
      const response = await api.post(`/banners/${id}/impression`);
      return response.data;
    } catch (error) {
      console.error('Error tracking banner impression:', error);
      throw error;
    }
  }
};
