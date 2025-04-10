
// Read environment variables with defaults
export const ENV = {
  SUPABASE_URL: 'https://jgdsbfbbmudrjmbstoh.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnZHNiZmJibXVkcmptYnN0b2giLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwNDczMTA4MCwiZXhwIjoyMDIwMzA3MDgwfQ.rmZ_yevdJJR38rhJAmpcaIfEMd-LRjNxdEILr7uw98'
};

// Validate required environment variables
export const validateEnv = () => {
  const missingVars = [];
  
  if (!ENV.SUPABASE_URL) missingVars.push('SUPABASE_URL');
  if (!ENV.SUPABASE_ANON_KEY) missingVars.push('SUPABASE_ANON_KEY');
  
  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};
