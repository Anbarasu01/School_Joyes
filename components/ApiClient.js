import axios from 'axios';

// Base URL of the API

// http://192.250.228.164:5000/
//https://Suguna.in

const BASE_URL = 'http://192.250.228.164:5000';

// Create an axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Error in request:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Error in response:', error);
    return Promise.reject(error);
  }
);

// Export the apiClient instance
export default apiClient;
