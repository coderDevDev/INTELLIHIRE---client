import api from '../api-service';

export const bannerTagAPI = {
  // Get all active tags
  getTags: async () => {
    try {
      const response = await api.get('/banner-tags');
      return response.data;
    } catch (error) {
      console.error('Error fetching banner tags:', error);
      throw error;
    }
  },

  // Get all tags (including inactive) - Admin only
  getAllTags: async () => {
    try {
      const response = await api.get('/banner-tags/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all banner tags:', error);
      throw error;
    }
  },

  // Create new tag - Admin only
  createTag: async tagData => {
    try {
      const response = await api.post('/banner-tags', tagData);
      return response.data;
    } catch (error) {
      console.error('Error creating banner tag:', error);
      throw error;
    }
  },

  // Update tag - Admin only
  updateTag: async (id, tagData) => {
    try {
      const response = await api.put(`/banner-tags/${id}`, tagData);
      return response.data;
    } catch (error) {
      console.error('Error updating banner tag:', error);
      throw error;
    }
  },

  // Delete tag - Admin only
  deleteTag: async id => {
    try {
      const response = await api.delete(`/banner-tags/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting banner tag:', error);
      throw error;
    }
  }
};
