
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { ENV } from './env';

const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY;

// Add better error handling for the Supabase client creation
let supabase: ReturnType<typeof createClient<Database>>;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    throw new Error('Missing Supabase credentials');
  }
  
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  
  // Check connection
  supabase.from('profiles').select('count', { count: 'exact', head: true })
    .then(() => {
      console.log('Supabase connection successful');
    })
    .catch(error => {
      console.error('Supabase connection error:', error);
    });
    
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create a fallback client that will work offline
  supabase = createClient<Database>(
    'https://placeholder-url.supabase.co', 
    'placeholder-key',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: false,
      },
    }
  );
}

export { supabase };
