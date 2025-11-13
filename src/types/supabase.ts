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
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string | null
          location: string | null
          bio: string | null
          resume_url: string | null
          skills: string[] | null
          experience_years: number | null
          linkedin_url: string | null
          portfolio_url: string | null
          profile_photo_url: string | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone?: string | null
          location?: string | null
          bio?: string | null
          resume_url?: string | null
          skills?: string[] | null
          experience_years?: number | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          profile_photo_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          location?: string | null
          bio?: string | null
          resume_url?: string | null
          skills?: string[] | null
          experience_years?: number | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          profile_photo_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          user_id: string
          company_name: string
          email: string
          logo_url: string | null
          website: string | null
          description: string | null
          size: string | null
          industry: string | null
          location: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          email: string
          logo_url?: string | null
          website?: string | null
          description?: string | null
          size?: string | null
          industry?: string | null
          location?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          email?: string
          logo_url?: string | null
          website?: string | null
          description?: string | null
          size?: string | null
          industry?: string | null
          location?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          company_id: string
          title: string
          description: string
          requirements: string | null
          benefits: string | null
          location: string
          job_type: string
          experience_level: string | null
          salary_min: number | null
          salary_max: number | null
          salary_currency: string
          remote: boolean
          status: string
          views_count: number
          applications_count: number
          is_featured: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          title: string
          description: string
          requirements?: string | null
          benefits?: string | null
          location: string
          job_type: string
          experience_level?: string | null
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string
          remote?: boolean
          status?: string
          views_count?: number
          applications_count?: number
          is_featured?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          title?: string
          description?: string
          requirements?: string | null
          benefits?: string | null
          location?: string
          job_type?: string
          experience_level?: string | null
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string
          remote?: boolean
          status?: string
          views_count?: number
          applications_count?: number
          is_featured?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          profile_id: string
          cover_letter: string | null
          resume_url: string | null
          status: string
          notes: string | null
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          profile_id: string
          cover_letter?: string | null
          resume_url?: string | null
          status?: string
          notes?: string | null
          applied_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          profile_id?: string
          cover_letter?: string | null
          resume_url?: string | null
          status?: string
          notes?: string | null
          applied_at?: string
          updated_at?: string
        }
      }
      saved_jobs: {
        Row: {
          id: string
          profile_id: string
          job_id: string
          saved_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          job_id: string
          saved_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          job_id?: string
          saved_at?: string
        }
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
  }
}
