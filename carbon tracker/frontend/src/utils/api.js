// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};

export default api;