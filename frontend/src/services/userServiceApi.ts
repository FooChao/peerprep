/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-16
 * Purpose: To fix Docker networking bug where middleware (server-side) and browser (client-side) need different API endpoints for same service.
 * Author Review: I validated correctness, security, and performance of the dynamic client creation approach.
 * Other Notes: This file was previously edited on 2025-10-13 to refactor API client to use a single reusable instance now that frontend is separated from API gateway.
 */

// API Configuration for PeerPrep Frontend
import axios from "axios";
import config from "../../../config/config.json" assert { type: "json" };

const API_GATEWAY_BASE_URL : string = config.API_GATEWAY_BASE_URL || "http://localhost";

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

/**
 * Single Reusable Axios Client
 *
 * Now that the frontend is separated from the API gateway, we can use a single,
 * reusable axios instance. The frontend always communicates with the API gateway
 * at the same URL regardless of execution context (server-side vs client-side).
 */
const apiClient = axios.create({
  baseURL: `${API_GATEWAY_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// API Endpoints
const API_ENDPOINTS = {
  // users
  USER_SERVICE: "/users",
  // auth
  AUTH_SERVICE: "/auth",
  // verification
  VERIFICATION_SERVICE: "/verification",
};

/**
 * @param token JWT token string
 * @returns Response containing the user name
 */
const verifyToken = async (token: string) => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.AUTH_SERVICE}/verify-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};

/**
 * Logs in a user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns Response containing access token and user data
 */
const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(
      `${API_ENDPOINTS.AUTH_SERVICE}/login`,
      {
        email,
        password,
      },
    );
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

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
      password,
    });
    return response;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

const verifyUserEmail = async (
  token: string,
  username: string,
  email: string,
) => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.VERIFICATION_SERVICE}/verify?token=${encodeURIComponent(token)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`,
    );
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

const resendEmailVerification = async (username: string, email: string) => {
  try {
    const response = await apiClient.post(
      `${API_ENDPOINTS.VERIFICATION_SERVICE}/resend?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`,
    );
    return response;
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw error;
  }
};

// Export configuration
export { verifyToken, login, signup, verifyUserEmail, resendEmailVerification };
