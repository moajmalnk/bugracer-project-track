import { apiClient } from '@/lib/axios';

export interface WeeklyStats {
  bugs: number;
  fixes: number;
  date: string;
}

export interface ProjectStats {
  project_id: string;
  project_name: string;
  total_bugs: number;
  fixed_bugs: number;
  pending_bugs: number;
}

export interface UserStats {
  total_reported: number;
  total_fixed: number;
  recent_activity: {
    action: string;
    bug_id: string;
    created_at: string;
  }[];
}

export const dashboardService = {
  // Get weekly bug activity
  getWeeklyActivity: async () => {
    const response = await apiClient.get('/activities/weekly');
    return response.data;
  },

  // Get project statistics
  getProjectStats: async () => {
    const response = await apiClient.get('/projects/stats');
    return response.data;
  },

  // Get user statistics
  getUserStats: async (userId: string) => {
    const response = await apiClient.get(`/users/stats/${userId}`);
    return response.data;
  },

  // Get bug status distribution
  getBugStatusDistribution: async () => {
    const response = await apiClient.get('/bugs/status-distribution');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit: number = 5) => {
    const response = await apiClient.get(`/activities/recent?limit=${limit}`);
    return response.data;
  }
}; 