
// Read environment variables with defaults
export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

// Validate required environment variables
export const validateEnv = () => {
  const missingVars = [];
  
  if (!ENV.SUPABASE_URL) missingVars.push('VITE_SUPABASE_URL');
  if (!ENV.SUPABASE_ANON_KEY) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};
