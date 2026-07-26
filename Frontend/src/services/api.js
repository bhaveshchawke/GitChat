import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ingestRepository = async (repoUrl) => {
  try {
    const response = await apiClient.post('/repo/ingest', { repoUrl });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during ingestion.' };
  }
};

export const askCodebaseQuestion = async (repoUrl, question) => {
  try {
    const response = await apiClient.post('/chat/ask', { repoUrl, question });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching the answer.' };
  }
};
