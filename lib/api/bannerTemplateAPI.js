import api from '../api-service';

export const bannerTemplateAPI = {
  // Get all templates
  getTemplates: async (params = {}) => {
    try {
      const response = await api.get('/banner-templates', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching banner templates:', error);
      throw error;
    }
  },

  // Get template by ID
  getTemplate: async id => {
    try {
      const response = await api.get(`/banner-templates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching banner template:', error);
      throw error;
    }
  },

  // Create new template
  createTemplate: async templateData => {
    try {
      const response = await api.post('/banner-templates', templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating banner template:', error);
      throw error;
    }
  },

  // Update template
  updateTemplate: async (id, templateData) => {
    try {
      const response = await api.put(`/banner-templates/${id}`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error updating banner template:', error);
      throw error;
    }
  },

  // Delete template
  deleteTemplate: async id => {
    try {
      const response = await api.delete(`/banner-templates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting banner template:', error);
      throw error;
    }
  },

  // Create banner from template
  createBannerFromTemplate: async templateId => {
    try {
      const response = await api.post(
        `/banner-templates/${templateId}/create-banner`
      );
      return response.data;
    } catch (error) {
      console.error('Error creating banner from template:', error);
      throw error;
    }
  },

  // Duplicate template
  duplicateTemplate: async id => {
    try {
      const response = await api.post(`/banner-templates/${id}/duplicate`);
      return response.data;
    } catch (error) {
      console.error('Error duplicating banner template:', error);
      throw error;
    }
  },

  // Get template categories
  getTemplateCategories: async () => {
    try {
      const response = await api.get('/banner-templates/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching template categories:', error);
      throw error;
    }
  }
};
