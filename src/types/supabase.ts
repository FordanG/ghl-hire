export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          permissions: Json | null
          profile_id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permissions?: Json | null
          profile_id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permissions?: Json | null
          profile_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_roles_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      application_projects: {
        Row: {
          application_id: string
          created_at: string | null
          id: string
          project_id: string
        }
        Insert: {
          application_id: string
          created_at?: string | null
          id?: string
          project_id: string
        }
        Update: {
          application_id?: string
          created_at?: string | null
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_projects_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      application_sources: {
        Row: {
          application_id: string
          created_at: string | null
          id: string
          referrer: string | null
          source: string | null
          user_agent: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          id?: string
          referrer?: string | null
          source?: string | null
          user_agent?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          id?: string
          referrer?: string | null
          source?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_sources_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string | null
          cover_letter: string | null
          id: string
          job_id: string
          notes: string | null
          profile_id: string
          resume_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          job_id: string
          notes?: string | null
          profile_id: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          profile_id?: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          blog_post_id: string
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          parent_comment_id: string | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          blog_post_id: string
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          parent_comment_id?: string | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          blog_post_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          parent_comment_id?: string | null
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string
          content: string
          cover_image: string | null
          created_at: string | null
          excerpt: string
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_time_minutes: number | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          cover_image?: string | null
          created_at?: string | null
          excerpt: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          company_name: string
          created_at: string | null
          description: string | null
          email: string
          id: string
          industry: string | null
          is_verified: boolean | null
          location: string | null
          logo_url: string | null
          size: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          location?: string | null
          logo_url?: string | null
          size?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          location?: string | null
          logo_url?: string | null
          size?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      content_reports: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          description: string | null
          id: string
          reason: string
          reporter_profile_id: string | null
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          reporter_profile_id?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          reporter_profile_id?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_reporter_profile_id_fkey"
            columns: ["reporter_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          bounced_at: string | null
          clicked_at: string | null
          created_at: string | null
          email_address: string
          email_type: string
          error_message: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          resend_id: string | null
          status: string | null
          subject: string | null
          user_id: string | null
        }
        Insert: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string | null
          email_address: string
          email_type: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          resend_id?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string | null
          email_address?: string
          email_type?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          resend_id?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_cents: number
          billing_period_end: string | null
          billing_period_start: string | null
          company_id: string
          created_at: string | null
          currency: string
          due_date: string | null
          id: string
          invoice_number: string
          line_items: Json | null
          metadata: Json | null
          paid_at: string | null
          pdf_url: string | null
          status: string
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_cents: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          company_id: string
          created_at?: string | null
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          line_items?: Json | null
          metadata?: Json | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_cents?: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          company_id?: string
          created_at?: string | null
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          line_items?: Json | null
          metadata?: Json | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      job_alerts: {
        Row: {
          created_at: string | null
          experience_level: string | null
          frequency: string
          id: string
          is_active: boolean | null
          job_type: string | null
          keywords: string[] | null
          last_sent_at: string | null
          location: string | null
          profile_id: string
          remote_only: boolean | null
          salary_min: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          experience_level?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          keywords?: string[] | null
          last_sent_at?: string | null
          location?: string | null
          profile_id: string
          remote_only?: boolean | null
          salary_min?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          experience_level?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          keywords?: string[] | null
          last_sent_at?: string | null
          location?: string | null
          profile_id?: string
          remote_only?: boolean | null
          salary_min?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_alerts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_analytics: {
        Row: {
          applications_count: number | null
          clicks_count: number | null
          created_at: string | null
          date: string
          id: string
          job_id: string
          saves_count: number | null
          unique_visitors_count: number | null
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          applications_count?: number | null
          clicks_count?: number | null
          created_at?: string | null
          date?: string
          id?: string
          job_id: string
          saves_count?: number | null
          unique_visitors_count?: number | null
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          applications_count?: number | null
          clicks_count?: number | null
          created_at?: string | null
          date?: string
          id?: string
          job_id?: string
          saves_count?: number | null
          unique_visitors_count?: number | null
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_analytics_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_view_events: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          profile_id: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          profile_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          profile_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_view_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_view_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          applications_count: number | null
          benefits: string | null
          company_id: string
          created_at: string | null
          description: string
          experience_level: string | null
          expires_at: string | null
          id: string
          is_featured: boolean | null
          job_type: string
          location: string
          remote: boolean | null
          requirements: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          status: string | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          applications_count?: number | null
          benefits?: string | null
          company_id: string
          created_at?: string | null
          description: string
          experience_level?: string | null
          expires_at?: string | null
          id?: string
          is_featured?: boolean | null
          job_type: string
          location: string
          remote?: boolean | null
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          applications_count?: number | null
          benefits?: string | null
          company_id?: string
          created_at?: string | null
          description?: string
          experience_level?: string | null
          expires_at?: string | null
          id?: string
          is_featured?: boolean | null
          job_type?: string
          location?: string
          remote?: boolean | null
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_actions: {
        Row: {
          action_type: string
          created_at: string | null
          duration_days: number | null
          id: string
          moderator_profile_id: string
          reason: string
          report_id: string | null
          target_profile_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          duration_days?: number | null
          id?: string
          moderator_profile_id: string
          reason: string
          report_id?: string | null
          target_profile_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          duration_days?: number | null
          id?: string
          moderator_profile_id?: string
          reason?: string
          report_id?: string | null
          target_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_actions_moderator_profile_id_fkey"
            columns: ["moderator_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "content_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          digest_frequency: string | null
          email_application_updates: boolean | null
          email_job_alerts: boolean | null
          email_marketing: boolean | null
          email_messages: boolean | null
          email_new_matches: boolean | null
          id: string
          inapp_application_updates: boolean | null
          inapp_job_alerts: boolean | null
          inapp_messages: boolean | null
          inapp_new_matches: boolean | null
          inapp_system: boolean | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          digest_frequency?: string | null
          email_application_updates?: boolean | null
          email_job_alerts?: boolean | null
          email_marketing?: boolean | null
          email_messages?: boolean | null
          email_new_matches?: boolean | null
          id?: string
          inapp_application_updates?: boolean | null
          inapp_job_alerts?: boolean | null
          inapp_messages?: boolean | null
          inapp_new_matches?: boolean | null
          inapp_system?: boolean | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          digest_frequency?: string | null
          email_application_updates?: boolean | null
          email_job_alerts?: boolean | null
          email_marketing?: boolean | null
          email_messages?: boolean | null
          email_new_matches?: boolean | null
          id?: string
          inapp_application_updates?: boolean | null
          inapp_job_alerts?: boolean | null
          inapp_messages?: boolean | null
          inapp_new_matches?: boolean | null
          inapp_system?: boolean | null
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          profile_id: string
          read_at: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          profile_id: string
          read_at?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          profile_id?: string
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount_cents: number
          company_id: string
          created_at: string | null
          currency: string
          description: string | null
          failed_at: string | null
          failure_code: string | null
          failure_message: string | null
          id: string
          maya_checkout_id: string | null
          maya_payment_id: string | null
          metadata: Json | null
          paid_at: string | null
          payment_method: string | null
          reference_number: string | null
          refunded_at: string | null
          status: string
          subscription_id: string | null
          transaction_type: string
        }
        Insert: {
          amount_cents: number
          company_id: string
          created_at?: string | null
          currency?: string
          description?: string | null
          failed_at?: string | null
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          maya_checkout_id?: string | null
          maya_payment_id?: string | null
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          reference_number?: string | null
          refunded_at?: string | null
          status?: string
          subscription_id?: string | null
          transaction_type: string
        }
        Update: {
          amount_cents?: number
          company_id?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          failed_at?: string | null
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          maya_checkout_id?: string | null
          maya_payment_id?: string | null
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          reference_number?: string | null
          refunded_at?: string | null
          status?: string
          subscription_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_analytics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          total_active_jobs: number | null
          total_applications: number | null
          total_employers: number | null
          total_job_seekers: number | null
          total_jobs_posted: number | null
          total_new_users: number | null
          total_page_views: number | null
          total_unique_visitors: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          total_active_jobs?: number | null
          total_applications?: number | null
          total_employers?: number | null
          total_job_seekers?: number | null
          total_jobs_posted?: number | null
          total_new_users?: number | null
          total_page_views?: number | null
          total_unique_visitors?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          total_active_jobs?: number | null
          total_applications?: number | null
          total_employers?: number | null
          total_job_seekers?: number | null
          total_jobs_posted?: number | null
          total_new_users?: number | null
          total_page_views?: number | null
          total_unique_visitors?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string
          experience_years: number | null
          full_name: string
          id: string
          is_available: boolean | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
          profile_photo_url: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email: string
          experience_years?: number | null
          full_name: string
          id?: string
          is_available?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          profile_photo_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          is_available?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          profile_photo_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          profile_id: string
          technologies: string[] | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          profile_id: string
          technologies?: string[] | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          profile_id?: string
          technologies?: string[] | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          author_id: string | null
          category: string
          created_at: string | null
          description: string
          download_count: number | null
          file_url: string | null
          id: string
          is_premium: boolean | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          resource_type: string
          slug: string
          status: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          url: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          created_at?: string | null
          description: string
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_premium?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          resource_type: string
          slug: string
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          created_at?: string | null
          description?: string
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_premium?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          resource_type?: string
          slug?: string
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          id: string
          job_id: string
          profile_id: string
          saved_at: string | null
        }
        Insert: {
          id?: string
          job_id: string
          profile_id: string
          saved_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          profile_id?: string
          saved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_interval: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          company_id: string
          created_at: string | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          ended_at: string | null
          featured_job_limit: number | null
          id: string
          job_post_limit: number | null
          maya_customer_id: string | null
          maya_plan_id: string | null
          maya_subscription_id: string | null
          metadata: Json | null
          plan_type: string
          price_cents: number | null
          status: string
          team_member_limit: number | null
          trial_end: string | null
          updated_at: string | null
        }
        Insert: {
          billing_interval?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          company_id: string
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          featured_job_limit?: number | null
          id?: string
          job_post_limit?: number | null
          maya_customer_id?: string | null
          maya_plan_id?: string | null
          maya_subscription_id?: string | null
          metadata?: Json | null
          plan_type?: string
          price_cents?: number | null
          status?: string
          team_member_limit?: number | null
          trial_end?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_interval?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          company_id?: string
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          featured_job_limit?: number | null
          id?: string
          job_post_limit?: number | null
          maya_customer_id?: string | null
          maya_plan_id?: string | null
          maya_subscription_id?: string | null
          metadata?: Json | null
          plan_type?: string
          price_cents?: number | null
          status?: string
          team_member_limit?: number | null
          trial_end?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          closed_at: string | null
          created_at: string | null
          description: string
          external_ticket_id: string | null
          id: string
          metadata: Json | null
          n8n_workflow_id: string | null
          priority: string
          profile_id: string | null
          resolved_at: string | null
          status: string
          subject: string
          ticket_number: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category: string
          closed_at?: string | null
          created_at?: string | null
          description: string
          external_ticket_id?: string | null
          id?: string
          metadata?: Json | null
          n8n_workflow_id?: string | null
          priority?: string
          profile_id?: string | null
          resolved_at?: string | null
          status?: string
          subject: string
          ticket_number: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string
          closed_at?: string | null
          created_at?: string | null
          description?: string
          external_ticket_id?: string | null
          id?: string
          metadata?: Json | null
          n8n_workflow_id?: string | null
          priority?: string
          profile_id?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string
          ticket_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          profile_id: string | null
          ticket_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          profile_id?: string | null
          ticket_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          profile_id?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aggregate_platform_analytics: { Args: never; Returns: undefined }
      can_company_post_job: { Args: { p_company_id: string }; Returns: boolean }
      create_notification: {
        Args: {
          p_data?: Json
          p_link?: string
          p_message: string
          p_profile_id: string
          p_title: string
          p_type: string
        }
        Returns: string
      }
      find_job_by_slug: {
        Args: { slug_prefix: string }
        Returns: {
          applications_count: number
          benefits: string
          company_description: string
          company_id: string
          company_industry: string
          company_logo_url: string
          company_name: string
          company_size: string
          company_website: string
          created_at: string
          description: string
          experience_level: string
          expires_at: string
          id: string
          is_featured: boolean
          job_type: string
          location: string
          remote: boolean
          requirements: string
          salary_currency: string
          salary_max: number
          salary_min: number
          status: string
          title: string
          updated_at: string
          views_count: number
        }[]
      }
      generate_invoice_number: { Args: never; Returns: string }
      generate_ticket_number: { Args: never; Returns: string }
      get_email_stats: {
        Args: { p_days?: number; p_user_id?: string }
        Returns: {
          click_rate: number
          open_rate: number
          total_bounced: number
          total_clicked: number
          total_delivered: number
          total_opened: number
          total_sent: number
        }[]
      }
      increment_job_views: { Args: { job_id: string }; Returns: undefined }
      is_admin_or_moderator: { Args: { p_user_id: string }; Returns: boolean }
      mark_all_notifications_read: {
        Args: { p_profile_id: string }
        Returns: undefined
      }
      mark_notification_read: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      resolve_content_report: {
        Args: {
          p_action_type: string
          p_moderator_profile_id: string
          p_reason: string
          p_report_id: string
          p_resolution_note?: string
        }
        Returns: undefined
      }
      update_job_analytics: {
        Args: { p_event_type: string; p_job_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
