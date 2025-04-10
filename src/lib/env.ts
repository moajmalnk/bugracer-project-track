
// Environment configuration
export const ENV = {
  API_URL: 'http://localhost:8000/api', // This will be your PHP backend URL later
};

// Validate required environment variables
export const validateEnv = () => {
  const missingVars = [];
  
  if (!ENV.API_URL) missingVars.push('API_URL');
  
  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};
