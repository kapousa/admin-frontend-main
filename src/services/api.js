import axios from 'axios';
//import { API_BASE_URL } from '../config'; // Import the API_BASE_URL

//export const API_BASE_URL = 'http://127.0.0.1:8000/admin';
//export const ATTACHMENT_URL = 'http://127.0.0.1:8000'
export const ATTACHMENT_URL = 'https://admin-backend-1sev.onrender.com' 
export const API_BASE_URL = 'https://admin-backend-1sev.onrender.com/admin';
//export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/admin';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// company services
export const getCompanies = (username, password) => {
  const encodedCredentials = btoa(`${username}:${password}`);
  return api.get('/companies', {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
};

export const getCompany = (id, username, password) => {
  const encodedCredentials = btoa(`${username}:${password}`);
  return api.get(`/companies/${id}`, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
};

export const createCompany = async (companyData, username, password) => {
  try {
    const encodedCredentials = btoa(`${username}:${password}`);
    const response = await axios.post(`${API_BASE_URL}/companies/add`, companyData, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json', // Important!
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCompany = (id, data, username, password) => {
  const encodedCredentials = btoa(`${username}:${password}`);
  return api.put(`/companies/${id}`, data, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
};

export const deleteCompany = (id, username, password) => {
  const encodedCredentials = btoa(`${username}:${password}`);
  return api.delete(`/companies/${id}`, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
};

// user services
export const createUser = async (userData, username, password) => {
  return await axios.post('/admin/users/', userData, {
    auth: { username, password },
  });
};

export const getUsers = async (username, password) => {
  const encodedCredentials = btoa(`${username}:${password}`);
  return await axios.get(`${API_BASE_URL}/users/`, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
};

export const updateUser = async (userId, userData, username, password) => {
  const encodedCredentials = btoa(`${username}:${password}`);
  return await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json', // Important!
    },
  });
};

export const deleteUser = async (userId, username, password) => {
  const encodedCredentials = btoa(`${username}:${password}`);
  return await axios.delete(`${API_BASE_URL}/users/${userId}`, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
};

export default api;