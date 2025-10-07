import api from '../api-service';

export const statsAPI = {
  // Get hero section statistics
  getHeroStats: async () => {
    try {
      const response = await api.get('/stats/hero');
      return response.data;
    } catch (error) {
      console.error('Error fetching hero stats:', error);
      return {
        success: false,
        data: {
          activeJobs: 0,
          jobSeekers: 0,
          successRate: 0,
          totalApplications: 0,
          successfulApplications: 0
        }
      };
    }
  }
};
