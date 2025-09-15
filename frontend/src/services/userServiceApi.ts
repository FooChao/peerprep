// API Configuration for PeerPrep Frontend
// Based on docker-compose.yml configuration with API Gateway
import axios from 'axios';

// TypeScript interfaces for API responses
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

// Base URL - All API calls go through the API Gateway on port 80
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost/api'        // Through API Gateway (Docker)
  : 'http://localhost:4000';  // Direct to user-service (Local dev)

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// API Endpoints
const API_ENDPOINTS = {
  // users
  USER_SERVICE: '/users',
  // auth
  AUTH_SERVICE: '/auth',
}

/**
 * @param token JWT token string
 * @returns Response containing the user name
 */
const verifyToken = async (token: string) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.AUTH_SERVICE}/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

/**
 * Logs in a user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns Response containing access token and user data
 */
const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.AUTH_SERVICE}/login`, {
      email,
      password
    });
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

/**
 * Signs up a new user
 * @param username User's username
 * @param email User's email address
 * @param password User's password
 * @returns Response containing user data
 */
const signup = async (username: string, email: string, password: string) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.USER_SERVICE}/`, {
      username,
      email,
      password
    });
    return response;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

// Export configuration
export { verifyToken, login, signup };

