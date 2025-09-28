import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xtxuoqcunnlccnujbbhk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0eHVvcWN1bm5sY2NudWpiYmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NzI3NDMsImV4cCI6MjA3NDU0ODc0M30.MQ96oAiZNnJXNQJmordG78C_s8c6wSGGtTzgva00-nQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          revenue: number
          source: string
          video_progress: number
          video_completed: boolean
          video_dropped_at: number | null
          conversion_stage: string
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          revenue: number
          source?: string
          video_progress?: number
          video_completed?: boolean
          video_dropped_at?: number | null
          conversion_stage?: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          revenue?: number
          source?: string
          video_progress?: number
          video_completed?: boolean
          video_dropped_at?: number | null
          conversion_stage?: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
        }
      }
      video_events: {
        Row: {
          id: string
          lead_id: string
          event_type: string
          timestamp: number
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          event_type: string
          timestamp: number
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          event_type?: string
          timestamp?: number
          created_at?: string
        }
      }
    }
  }
}