import api from '../api-service';

export const bannerCategoryAPI = {
  // Get all active categories
  getCategories: async () => {
    try {
      const response = await api.get('/banner-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching banner categories:', error);
      throw error;
    }
  },

  // Get all categories (including inactive) - Admin only
  getAllCategories: async () => {
    try {
      const response = await api.get('/banner-categories/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all banner categories:', error);
      throw error;
    }
  },

  // Create new category - Admin only
  createCategory: async categoryData => {
    try {
      const response = await api.post('/banner-categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating banner category:', error);
      throw error;
    }
  },

  // Update category - Admin only
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/banner-categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating banner category:', error);
      throw error;
    }
  },

  // Delete category - Admin only
  deleteCategory: async id => {
    try {
      const response = await api.delete(`/banner-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting banner category:', error);
      throw error;
    }
  }
};
