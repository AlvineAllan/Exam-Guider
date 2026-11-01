// frontend/src/api/questions.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const generateQuestions = async (materialId, options = {}) => {
  const res = await axios.post(
    `${API_URL}/api/questions/generate/${materialId}`,
    options // { difficulty, numQuestions }
  );
  return res.data;
};

export const getQuestionSets = async () => {
  const res = await axios.get(`${API_URL}/api/questions/sets`);
  return res.data;
};

export const getQuestionSet = async (id) => {
  const res = await axios.get(`${API_URL}/api/questions/sets/${id}`);
  return res.data;
};