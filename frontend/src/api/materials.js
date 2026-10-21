import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getMaterials = async () => {
  const res = await axios.get(`${API_URL}/api/materials`);
  return res.data;
};

export const createMaterial = async (title, content) => {
  const res = await axios.post(`${API_URL}/api/materials`, { title, content });
  return res.data;
};

export const getMaterial = async (id) => {
  const res = await axios.get(`${API_URL}/api/materials/${id}`);
  return res.data;
};

export const deleteMaterial = async (id) => {
  const res = await axios.delete(`${API_URL}/api/materials/${id}`);
  return res.data;
};