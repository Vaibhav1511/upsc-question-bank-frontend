import axios from 'axios';

const api = axios.create({
  baseURL: 'https://upsc-question-bank-backend.onrender.com',
});

export default api;
