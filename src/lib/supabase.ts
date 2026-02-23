import { createClient } from '@supabase/supabase-js'

const supabaseUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? window.location.origin + '/supabase'
  : import.meta.env.VITE_SUPABASE_URL || ''

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
