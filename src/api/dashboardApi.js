import apiClient from './axios';

export const getDashboardStats = async () => {
  const response = await apiClient.get('/dashboard');
  return response.data;
};
