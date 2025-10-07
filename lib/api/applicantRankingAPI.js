import api from '../api-service';

const applicantRankingAPI = {
  // Get rankings for a specific job
  getJobRankings: async (jobId, params = {}) => {
    try {
      const response = await api.get(`/rankings/job/${jobId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching job rankings:', error);
      throw error;
    }
  },

  // Get overall rankings across all jobs
  getOverallRankings: async (params = {}) => {
    try {
      const response = await api.get('/rankings/overall', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching overall rankings:', error);
      throw error;
    }
  },

  // Recalculate rankings for a specific job
  recalculateJobRankings: async jobId => {
    try {
      const response = await api.post(`/rankings/recalculate/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error recalculating rankings:', error);
      throw error;
    }
  },

  // Update ranking status
  updateRankingStatus: async (rankingId, status, adminNotes = '') => {
    try {
      const response = await api.put(`/rankings/${rankingId}/status`, {
        status,
        adminNotes
      });
      return response.data;
    } catch (error) {
      console.error('Error updating ranking status:', error);
      throw error;
    }
  },

  // Manually adjust ranking
  adjustRanking: async (rankingId, adjustments) => {
    try {
      const response = await api.put(
        `/rankings/${rankingId}/adjust`,
        adjustments
      );
      return response.data;
    } catch (error) {
      console.error('Error adjusting ranking:', error);
      throw error;
    }
  },

  // Get ranking statistics
  getRankingStats: async (params = {}) => {
    try {
      const response = await api.get('/rankings/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching ranking stats:', error);
      throw error;
    }
  },

  // Export rankings to CSV
  exportRankingsCSV: async (params = {}) => {
    try {
      const response = await api.get('/rankings/export/csv', {
        params,
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applicant-rankings-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting rankings:', error);
      throw error;
    }
  },

  // Get available jobs for ranking
  getAvailableJobs: async () => {
    try {
      const response = await api.get('/rankings/jobs/available');
      return response.data;
    } catch (error) {
      console.error('Error fetching available jobs:', error);
      throw error;
    }
  }
};

export default applicantRankingAPI;
