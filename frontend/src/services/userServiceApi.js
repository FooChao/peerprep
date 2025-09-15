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

// Export configuration
export { BASE_URL, API_ENDPOINTS };

