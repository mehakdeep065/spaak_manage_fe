import apiClient from './axios';

export const getReminders = async () => {
  const response = await apiClient.get('/reminders');
  return response.data;
};

export const createReminder = async (reminderData) => {
  const response = await apiClient.post('/reminders', reminderData);
  return response.data;
};

export const deleteReminder = async (id) => {
  const response = await apiClient.delete(`/reminders/${id}`);
  return response.data;
};

export const completeReminder = async (id) => {
  const response = await apiClient.patch(`/reminders/${id}/complete`);
  return response.data;
};
