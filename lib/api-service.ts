import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- Auto-logout timer management ---
let logoutTimer: ReturnType<typeof setTimeout> | null = null;
function setAutoLogout(token: string) {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    if (exp) {
      const msUntilExpiry = exp * 1000 - Date.now();
      if (logoutTimer) clearTimeout(logoutTimer);
      if (msUntilExpiry > 0) {
        logoutTimer = setTimeout(() => {
          authAPI.logout();
          // window.location.href = '/login?expired=1';
        }, msUntilExpiry);
      } else {
        // Token already expired
        authAPI.logout();
        // window.location.href = '/login?expired=1';
      }
    }
  } catch {
    // Invalid token, force logout
    authAPI.logout();
    // window.location.href = '/login?expired=1';
  }
}

// Add token to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      authAPI.logout();
      // window.location.href = '/login?expired=1';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    console.log({ credentials });

    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAutoLogout(response.data.token);
    }
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAutoLogout(response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      logoutTimer = null;
    }
  },

  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      if (exp && Date.now() >= exp * 1000) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (logoutTimer) {
          clearTimeout(logoutTimer);
          logoutTimer = null;
        }
        return false;
      }
      setAutoLogout(token); // Refresh auto-logout timer on check
      return true;
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
      }
      return false;
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', {
      token,
      password
    });
    return response.data;
  }
};

// Job API calls
export const jobAPI = {
  createJob: async (jobData: any) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  getAdminJobs: async (params = {}) => {
    const response = await api.get('/jobs/admin/all', { params });
    return response.data;
  },

  getJobById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  updateJob: async (id: string, jobData: any) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  updateJobStatus: async (id: string, status: string) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getFeaturedJobs: async () => {
    const response = await api.get('/jobs/featured/list');
    return response.data;
  },

  getGovernmentJobs: async () => {
    const response = await api.get('/jobs/government/list');
    return response.data;
  },

  // Job Recommendations API
  getJobRecommendations: async (params = {}) => {
    const token = authAPI.getToken();
    const response = await api.get('/jobs/recommendations', {
      params,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  saveJob: async (jobId: string) => {
    const token = authAPI.getToken();
    const response = await api.post(
      `/jobs/${jobId}/save`,
      {},
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );
    return response.data;
  },

  unsaveJob: async (jobId: string) => {
    const token = authAPI.getToken();
    const response = await api.delete(`/jobs/${jobId}/save`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  getSavedJobs: async () => {
    const token = authAPI.getToken();
    const response = await api.get('/jobs/saved', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  }
};

// Career Path API calls
export const careerPathAPI = {
  getCareerPaths: async (params = {}) => {
    const token = authAPI.getToken();
    const response = await api.get('/career-paths', {
      params,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  getCareerPathById: async (id: string) => {
    const token = authAPI.getToken();
    const response = await api.get(`/career-paths/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  startCareerPath: async (careerPathId: string) => {
    const token = authAPI.getToken();
    const response = await api.post(
      `/career-paths/${careerPathId}/start`,
      {},
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );
    return response.data;
  },

  completeMilestone: async (milestoneId: string) => {
    const token = authAPI.getToken();
    const response = await api.post(
      `/career-paths/milestones/${milestoneId}/complete`,
      {},
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );
    return response.data;
  },

  getUserGoals: async () => {
    const token = authAPI.getToken();
    const response = await api.get('/career-paths/goals', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  createGoal: async (goalData: any) => {
    const token = authAPI.getToken();
    const response = await api.post('/career-paths/goals', goalData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  updateGoal: async (goalId: string, goalData: any) => {
    const token = authAPI.getToken();
    const response = await api.put(`/career-paths/goals/${goalId}`, goalData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  deleteGoal: async (goalId: string) => {
    const token = authAPI.getToken();
    const response = await api.delete(`/career-paths/goals/${goalId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  getCareerInsights: async () => {
    const token = authAPI.getToken();
    const response = await api.get('/career-paths/insights', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  getUserProgress: async () => {
    const token = authAPI.getToken();
    const response = await api.get('/career-paths/progress', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  }
};

// Company API calls
export const companyAPI = {
  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  getCompanyById: async (id: string) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (companyData: any) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  updateCompany: async (id: string, companyData: any) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  },

  deleteCompany: async (id: string) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },

  uploadCompanyDocument: async (id: string, file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    const response = await api.post(`/companies/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  verifyCompany: async (id: string, verificationData: { isVerified: boolean; verificationNotes?: string }) => {
    const response = await api.put(`/companies/${id}/verify`, verificationData);
    return response.data;
  },

  getScoringConfig: async (id: string) => {
    const response = await api.get(`/companies/${id}/scoring-config`);
    return response.data;
  },

  updateScoringConfig: async (id: string, scoringConfig: any) => {
    const response = await api.put(`/companies/${id}/scoring-config`, { scoringConfig });
    return response.data;
  },

  deleteScoringConfig: async (id: string) => {
    const response = await api.delete(`/companies/${id}/scoring-config`);
    return response.data;
  },

  uploadVerificationDocument: async (formData: FormData) => {
    const response = await api.post('/companies/upload-verification-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  fixScoringConfigs: async () => {
    const response = await api.post('/companies/fix-scoring-configs');
    return response.data;
  }
};

// Category API calls
export const categoryAPI = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategory: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }
};

// User API calls
export const userAPI = {
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  uploadPds: async (file: File) => {
    const formData = new FormData();
    formData.append('pds', file);
    const response = await api.post('/users/profile/pds', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  uploadProfilePicture: async (formData: FormData) => {
    const response = await api.post('/users/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getApplicants: async (params = {}) => {
    const token = authAPI.getToken();
    const response = await api.get('/users', {
      params: { role: 'applicant', ...params },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  }
};

// Document API calls
export const documentAPI = {
  uploadDocument: async (file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const token = authAPI.getToken();
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  getMyDocuments: async () => {
    const token = authAPI.getToken();
    const response = await api.get('/documents/my-documents', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  deleteDocument: async (documentId: string) => {
    const token = authAPI.getToken();
    const response = await api.delete(`/documents/${documentId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  getPdsData: async (documentId: string) => {
    const token = authAPI.getToken();
    const response = await api.get(`/documents/pds-data/${documentId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  // Debug endpoint to see all PDS data entries
  getPdsDataDebug: async () => {
    const token = authAPI.getToken();
    const response = await api.get('/documents/pds-data-debug', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  // Cleanup duplicate PDS data entries
  cleanupPdsData: async (keepOnePerDocument = true) => {
    const token = authAPI.getToken();
    const response = await api.delete('/documents/pds-data-cleanup', {
      params: { keepOnePerDocument: keepOnePerDocument.toString() },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  // Generate resume from PDS data
  generateResume: async (
    documentId: string,
    targetIndustry = 'General',
    targetRole = 'Professional'
  ) => {
    const token = authAPI.getToken();
    const response = await api.post(
      `/documents/generate-resume/${documentId}`,
      {
        targetIndustry,
        targetRole
      },
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );
    return response.data;
  },

  // Generate multiple resume variants for different industries
  generateResumeVariants: async (
    documentId: string,
    industries = ['Technology', 'Healthcare', 'Finance', 'Education']
  ) => {
    const token = authAPI.getToken();
    const response = await api.post(
      `/documents/generate-resume-variants/${documentId}`,
      {
        industries
      },
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );
    return response.data;
  },

  // Optimize resume for specific job
  optimizeResumeForJob: async (
    resumeData: any,
    jobDescription: string,
    jobTitle: string,
    companyName?: string
  ) => {
    const token = authAPI.getToken();
    const response = await api.post(
      '/documents/optimize-resume-for-job',
      {
        resumeData,
        jobDescription,
        jobTitle,
        companyName
      },
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );
    return response.data;
  },

  // Get saved resume for a document
  getSavedResume: async (documentId: string) => {
    const token = authAPI.getToken();
    const response = await api.get(`/documents/resume/${documentId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  }
};

// Application API calls
export const applicationAPI = {
  submitApplication: async (payload: any) => {
    const token = authAPI.getToken();
    const response = await api.post('/applications', payload, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },
  getMyApplications: async () => {
    const token = authAPI.getToken();
    const response = await api.get('/applications/list/my-applications', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },
  getApplicationsByApplicant: async (applicantId: string, params = {}) => {
    const token = authAPI.getToken();
    const response = await api.get('/applications', {
      params: { applicantId, ...params },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },
  getAdminApplications: async (params = {}) => {
    const token = authAPI.getToken();
    const response = await api.get('/applications', {
      params,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },
  exportJobApplicants: async (jobId: string, format = 'csv') => {
    const token = authAPI.getToken();
    const response = await api.get(`/applications/export/job/${jobId}`, {
      params: { format },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: format === 'csv' ? 'text/csv' : 'application/json'
      },
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    return response.data;
  },
  exportAllApplicants: async (params = {}, format = 'csv') => {
    const token = authAPI.getToken();
    const response = await api.get('/applications/export/all', {
      params: { ...params, format },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: format === 'csv' ? 'text/csv' : 'application/json'
      },
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    return response.data;
  },
  exportRankedApplicants: async (params = {}, format = 'csv') => {
    const token = authAPI.getToken();
    const response = await api.get('/applications/export/rankings', {
      params: { ...params, format },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: format === 'csv' ? 'text/csv' : 'application/json'
      },
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    return response.data;
  }
};

// Export the API instance for other services
export default api;
