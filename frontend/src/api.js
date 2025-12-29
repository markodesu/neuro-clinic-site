// API configuration
// For Create React App, use REACT_APP_API_URL environment variable
// For local development, it will use the proxy (empty string)
// For production, set REACT_APP_API_URL=https://your-backend.up.railway.app
const API_URL = process.env.REACT_APP_API_URL || "";

export default API_URL;

