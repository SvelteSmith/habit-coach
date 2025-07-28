import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Database types for habits
export interface Habit {
  id: string
  user_id: string
  title: string
  subtitle: string
  icon: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: Habit
        Insert: Omit<Habit, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}