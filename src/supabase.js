import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xtlqttulooidepaprifp.supabase.co";  // SupabaseのURL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bHF0dHVsb29pZGVwYXByaWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjIzNTIsImV4cCI6MjA1NzYzODM1Mn0.HZjsPPbyREhJI1zLCD_i_o1pmNl40-p2SrZw0MlS2Cg";  // Supabaseの公開APIキー

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
