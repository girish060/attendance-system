import { createClient } from '@supabase/supabase-js';

// Force the correct Supabase URL - no environment variable override
const supabaseUrl = 'https://flsxjijsyvvgbcpodpin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsc3hqaWpzeXZ2Z2JjcG9kcGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTI4MjIsImV4cCI6MjA3NTE2ODgyMn0.MU_iSQy4kcN4U69cgYE95EYeMxSOsUFPq_IBadAc1R8';

console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 Using API Key:', supabaseAnonKey.substring(0, 20) + '...');

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using default Supabase credentials. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'user';
  department: string | null;
  employee_id: string;
  created_at: string;
  updated_at: string;
};

export type Attendance = {
  id: string;
  user_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  check_in_time: string;
  notes: string;
  marked_by: string;
  created_at: string;
  updated_at: string;
};

export type Department = {
  id: string;
  name: string;
  created_at: string;
};
