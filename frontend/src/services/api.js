import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const getCards = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (taskData) => {
  const payload = {
    Title: taskData.title || taskData.Title,
    Description: taskData.description || taskData.Description,
    Author: taskData.author || taskData.Author,
    Status: (taskData.status || taskData.Status || "todo").toLowerCase(),
    StartDate: taskData.start_date || taskData.StartDate,
    DueDate: taskData.due_date || taskData.DueDate,
    Progress: taskData.progress ?? 0,
  };

  const response = await api.post('/tasks', payload);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const payload = {
    Title: taskData.title || taskData.Title,
    Description: taskData.description || taskData.Description,
    Author: taskData.author || taskData.Author,
    Status: (taskData.status || taskData.Status || "todo").toLowerCase(),
    StartDate: taskData.start_date || taskData.StartDate,
    DueDate: taskData.due_date || taskData.DueDate,
    Progress: taskData.progress ?? 0,
  };

  const response = await api.put(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export default api;