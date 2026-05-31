import apiClient from './axios';

export const getExpenses = async () => {
  const response = await apiClient.get('/expenses');
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await apiClient.post('/expenses', expenseData);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await apiClient.delete(`/expenses/${id}`);
  return response.data;
};
