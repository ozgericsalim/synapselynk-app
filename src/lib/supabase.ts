import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ryipzgkrwnmggaptcnfy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXB6Z2tyd25tZ2dhcHRjbmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NjE3MTUsImV4cCI6MjA4NzMzNzcxNX0.PoKmC7PC1aqsKXc-snIb4VJmjGmk3Q0FRvxY2P2PD5w'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
