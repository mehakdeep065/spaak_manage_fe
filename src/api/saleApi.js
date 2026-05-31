import apiClient from './axios';

export const getSales = async () => {
  const response = await apiClient.get('/sales');
  return response.data;
};

export const createSale = async (saleData) => {
  const response = await apiClient.post('/sales', saleData);
  return response.data;
};

export const deleteSale = async (id) => {
  const response = await apiClient.delete(`/sales/${id}`);
  return response.data;
};
