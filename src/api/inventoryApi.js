import apiClient from './axios';

export const getInventory = async () => {
  const response = await apiClient.get('/inventories');
  return response.data;
};

export const createInventoryItem = async (itemData) => {
  const response = await apiClient.post('/inventories', itemData);
  return response.data;
};

export const deleteInventoryItem = async (id) => {
  const response = await apiClient.delete(`/inventories/${id}`);
  return response.data;
};
