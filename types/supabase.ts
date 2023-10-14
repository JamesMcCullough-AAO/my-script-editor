export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      shared_scripts: {
        Row: {
          character_notes: Json | null
          created_at: string
          html: string
          id: string
          notes: string | null
          title: string
        }
        Insert: {
          character_notes?: Json | null
          created_at?: string
          html: string
          id?: string
          notes?: string | null
          title: string
        }
        Update: {
          character_notes?: Json | null
          created_at?: string
          html?: string
          id?: string
          notes?: string | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
