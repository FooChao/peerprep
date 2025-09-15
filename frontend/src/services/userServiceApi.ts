// API Configuration for PeerPrep Frontend
// Based on docker-compose.yml configuration with API Gateway

// Base URL - All API calls go through the API Gateway on port 80
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost'        // Through API Gateway (Docker)
  : 'http://localhost:4000';  // Direct to user-service (Local dev)

// API Endpoints
const API_ENDPOINTS = {
  // users
  USER_SERVICE: `${BASE_URL}/api/users`,
  // auth
  AUTH_SERVICE: `${BASE_URL}/api/auth`,
}

/**
 * @param token JWT token string
 * @returns Pesponse container the user name
 */
const verifyToken = async (token: string) => {
  const response = await fetch(`${API_ENDPOINTS.AUTH_SERVICE}/verify-token`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response;
}

/**
 * Logs in a user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns Response containing access token and user data
 */
const login = async (email: string, password:string) => {
  const response = await fetch(`${API_ENDPOINTS.AUTH_SERVICE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  return response;
}

const signup = async (username:string, email: string, password:string) => {
  const response = await fetch(`${API_ENDPOINTS.USER_SERVICE}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password })
  });
  return response;
}

// Export configuration
export { verifyToken, login, signup };

