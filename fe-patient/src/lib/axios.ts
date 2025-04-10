import axios from 'axios';

// Create axios instance with base URL pointing to backend API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL for the backend API
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable CORS support
  withCredentials: false,
  timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to attach the auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Debug token information
    console.log('Token available:', !!token);
    if (!token) {
      console.warn('No token found in localStorage. User might not be authenticated.');
    }
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request headers');
    }
    
    console.log('Making API request to:', config.method?.toUpperCase(), config.url);
    console.log('Request config:', {
      method: config.method,
      url: config.url,
      hasAuthHeader: !!config.headers.Authorization,
      data: config.data ? 'data present' : 'no data',
    });
    
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.status}]:`, {
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      dataSize: response.data ? (Array.isArray(response.data) ? response.data.length : 'object') : 'empty'
    });
    return response;
  },
  (error) => {
    console.error('API response error:', error.response || error);
    
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Request URL:', error.config.url);
      console.error('Request method:', error.config.method?.toUpperCase());
      
      // Handle authentication errors
      if (error.response.status === 401) {
        console.error('Authentication error: Token may be invalid or expired');
        
        // Check if this is the login endpoint - don't redirect in that case
        const isLoginRequest = error.config.url?.includes('/users/login');
        
        if (!isLoginRequest) {
          // Save current path for redirect after login (if we're in the browser)
          if (typeof window !== 'undefined') {
            console.log('Saving current path for redirect after login');
            localStorage.setItem('lastPath', window.location.pathname);
            
            // Clear invalid token to force re-login
            localStorage.removeItem('token');
          }
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      console.error('Request details:', {
        url: error.config.url,
        method: error.config.method?.toUpperCase(),
        baseURL: error.config.baseURL
      });
      console.error('Possible network issue or backend server is not running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 