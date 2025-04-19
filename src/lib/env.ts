// Environment configuration
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'https://bugbackend.moajmalnk.in/api',
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
