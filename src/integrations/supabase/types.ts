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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      actor_capsule_analytics: {
        Row: {
          capsule_id: string
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          capsule_id: string
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          capsule_id?: string
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actor_capsule_analytics_capsule_id_fkey"
            columns: ["capsule_id"]
            isOneToOne: false
            referencedRelation: "actor_capsules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actor_capsule_analytics_capsule_id_fkey"
            columns: ["capsule_id"]
            isOneToOne: false
            referencedRelation: "actor_capsules_public"
            referencedColumns: ["id"]
          },
        ]
      }
      actor_capsules: {
        Row: {
          accent_color: string | null
          actor_name: string
          age: number | null
          agent_contact: string | null
          bio: string | null
          created_at: string
          credits: Json | null
          email: string | null
          eye_color: string | null
          gallery_images: Json | null
          hair_color: string | null
          has_passport: boolean | null
          height: string | null
          id: string
          imdb_url: string | null
          instagram_url: string | null
          intro_video_url: string | null
          is_published: boolean | null
          languages: string[] | null
          profile_photo: string | null
          qr_scan_count: number | null
          reels: Json | null
          short_link: string | null
          skills: string[] | null
          slug: string
          tagline: string | null
          theme: string | null
          updated_at: string
          user_id: string
          videos: Json | null
          view_count: number | null
          youtube_url: string | null
        }
        Insert: {
          accent_color?: string | null
          actor_name: string
          age?: number | null
          agent_contact?: string | null
          bio?: string | null
          created_at?: string
          credits?: Json | null
          email?: string | null
          eye_color?: string | null
          gallery_images?: Json | null
          hair_color?: string | null
          has_passport?: boolean | null
          height?: string | null
          id?: string
          imdb_url?: string | null
          instagram_url?: string | null
          intro_video_url?: string | null
          is_published?: boolean | null
          languages?: string[] | null
          profile_photo?: string | null
          qr_scan_count?: number | null
          reels?: Json | null
          short_link?: string | null
          skills?: string[] | null
          slug: string
          tagline?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
          videos?: Json | null
          view_count?: number | null
          youtube_url?: string | null
        }
        Update: {
          accent_color?: string | null
          actor_name?: string
          age?: number | null
          agent_contact?: string | null
          bio?: string | null
          created_at?: string
          credits?: Json | null
          email?: string | null
          eye_color?: string | null
          gallery_images?: Json | null
          hair_color?: string | null
          has_passport?: boolean | null
          height?: string | null
          id?: string
          imdb_url?: string | null
          instagram_url?: string | null
          intro_video_url?: string | null
          is_published?: boolean | null
          languages?: string[] | null
          profile_photo?: string | null
          qr_scan_count?: number | null
          reels?: Json | null
          short_link?: string | null
          skills?: string[] | null
          slug?: string
          tagline?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
          videos?: Json | null
          view_count?: number | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      aggregations: {
        Row: {
          aggregation_date: string | null
          batch_id: string | null
          child_id: string
          child_type: string
          created_at: string | null
          disaggregation_date: string | null
          id: string
          metadata: Json | null
          parent_id: string
          parent_type: string
          status: string | null
        }
        Insert: {
          aggregation_date?: string | null
          batch_id?: string | null
          child_id: string
          child_type: string
          created_at?: string | null
          disaggregation_date?: string | null
          id?: string
          metadata?: Json | null
          parent_id: string
          parent_type: string
          status?: string | null
        }
        Update: {
          aggregation_date?: string | null
          batch_id?: string | null
          child_id?: string
          child_type?: string
          created_at?: string | null
          disaggregation_date?: string | null
          id?: string
          metadata?: Json | null
          parent_id?: string
          parent_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aggregations_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      allowed_emails: {
        Row: {
          added_by: string | null
          created_at: string | null
          email: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          email: string
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          email?: string
        }
        Relationships: []
      }
      batch_events: {
        Row: {
          actor_name: string | null
          actor_role: string | null
          batch_id: string
          blockchain_hash: string | null
          created_at: string
          description: string | null
          event_type: string
          id: string
          images: Json | null
          location: string | null
          metadata: Json | null
          timestamp: string
          title: string
        }
        Insert: {
          actor_name?: string | null
          actor_role?: string | null
          batch_id: string
          blockchain_hash?: string | null
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          images?: Json | null
          location?: string | null
          metadata?: Json | null
          timestamp?: string
          title: string
        }
        Update: {
          actor_name?: string | null
          actor_role?: string | null
          batch_id?: string
          blockchain_hash?: string | null
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          images?: Json | null
          location?: string | null
          metadata?: Json | null
          timestamp?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_events_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          batch_number: string
          created_at: string
          description: string | null
          farmer_producer: string | null
          harvest_date: string | null
          id: string
          images: Json | null
          metadata: Json | null
          organization_id: string
          origin_location: string | null
          product_name: string
          product_type: string
          qr_code: string | null
          quantity: number | null
          status: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          batch_number: string
          created_at?: string
          description?: string | null
          farmer_producer?: string | null
          harvest_date?: string | null
          id?: string
          images?: Json | null
          metadata?: Json | null
          organization_id: string
          origin_location?: string | null
          product_name: string
          product_type?: string
          qr_code?: string | null
          quantity?: number | null
          status?: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          batch_number?: string
          created_at?: string
          description?: string | null
          farmer_producer?: string | null
          harvest_date?: string | null
          id?: string
          images?: Json | null
          metadata?: Json | null
          organization_id?: string
          origin_location?: string | null
          product_name?: string
          product_type?: string
          qr_code?: string | null
          quantity?: number | null
          status?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations_public"
            referencedColumns: ["id"]
          },
        ]
      }
      capsule_analytics: {
        Row: {
          capsule_id: string
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          capsule_id: string
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          capsule_id?: string
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "capsule_analytics_capsule_id_fkey"
            columns: ["capsule_id"]
            isOneToOne: false
            referencedRelation: "capsules"
            referencedColumns: ["id"]
          },
        ]
      }
      capsules: {
        Row: {
          accent_color: string | null
          accent_color_dark: string | null
          created_at: string
          cta_text: string | null
          cta_url: string | null
          id: string
          images: Json | null
          is_published: boolean | null
          qr_scan_count: number | null
          quote: string | null
          short_link: string | null
          slug: string
          story: string
          tags: string[] | null
          theme: string | null
          timeline: Json | null
          title: string
          updated_at: string
          user_id: string
          verified_by: string
          video_type: string | null
          video_url: string | null
          view_count: number | null
          voice_note_url: string | null
        }
        Insert: {
          accent_color?: string | null
          accent_color_dark?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          id?: string
          images?: Json | null
          is_published?: boolean | null
          qr_scan_count?: number | null
          quote?: string | null
          short_link?: string | null
          slug: string
          story: string
          tags?: string[] | null
          theme?: string | null
          timeline?: Json | null
          title: string
          updated_at?: string
          user_id: string
          verified_by: string
          video_type?: string | null
          video_url?: string | null
          view_count?: number | null
          voice_note_url?: string | null
        }
        Update: {
          accent_color?: string | null
          accent_color_dark?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          id?: string
          images?: Json | null
          is_published?: boolean | null
          qr_scan_count?: number | null
          quote?: string | null
          short_link?: string | null
          slug?: string
          story?: string
          tags?: string[] | null
          theme?: string | null
          timeline?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
          verified_by?: string
          video_type?: string | null
          video_url?: string | null
          view_count?: number | null
          voice_note_url?: string | null
        }
        Relationships: []
      }
      coldchain_events: {
        Row: {
          batch_id: string | null
          blockchain_tx_id: string | null
          created_at: string | null
          event_hash: string | null
          excursion_details: string | null
          excursion_flag: boolean | null
          humidity: number | null
          id: string
          location_gln: string | null
          metadata: Json | null
          recorded_at: string
          sensor_id: string | null
          shipment_id: string
          temp_avg: number | null
          temp_max: number
          temp_min: number
        }
        Insert: {
          batch_id?: string | null
          blockchain_tx_id?: string | null
          created_at?: string | null
          event_hash?: string | null
          excursion_details?: string | null
          excursion_flag?: boolean | null
          humidity?: number | null
          id?: string
          location_gln?: string | null
          metadata?: Json | null
          recorded_at?: string
          sensor_id?: string | null
          shipment_id: string
          temp_avg?: number | null
          temp_max: number
          temp_min: number
        }
        Update: {
          batch_id?: string | null
          blockchain_tx_id?: string | null
          created_at?: string | null
          event_hash?: string | null
          excursion_details?: string | null
          excursion_flag?: boolean | null
          humidity?: number | null
          id?: string
          location_gln?: string | null
          metadata?: Json | null
          recorded_at?: string
          sensor_id?: string | null
          shipment_id?: string
          temp_avg?: number | null
          temp_max?: number
          temp_min?: number
        }
        Relationships: [
          {
            foreignKeyName: "coldchain_events_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_reports: {
        Row: {
          compliance_score: number
          created_at: string | null
          details: Json | null
          id: string
          period: string
          timestamp: string | null
          title: string
          violations: number
        }
        Insert: {
          compliance_score: number
          created_at?: string | null
          details?: Json | null
          id?: string
          period: string
          timestamp?: string | null
          title: string
          violations?: number
        }
        Update: {
          compliance_score?: number
          created_at?: string | null
          details?: Json | null
          id?: string
          period?: string
          timestamp?: string | null
          title?: string
          violations?: number
        }
        Relationships: []
      }
      contact_form_rate_limit: {
        Row: {
          created_at: string | null
          first_submission_at: string | null
          ip_address: string
          last_submission_at: string | null
          submission_count: number | null
        }
        Insert: {
          created_at?: string | null
          first_submission_at?: string | null
          ip_address: string
          last_submission_at?: string | null
          submission_count?: number | null
        }
        Update: {
          created_at?: string | null
          first_submission_at?: string | null
          ip_address?: string
          last_submission_at?: string | null
          submission_count?: number | null
        }
        Relationships: []
      }
      drug_batches: {
        Row: {
          batch_number: string
          created_at: string | null
          drug_id: string
          expiry_date: string
          id: string
          manufacturer_id: string
          production_date: string
          quantity: number
          status: string
          updated_at: string | null
        }
        Insert: {
          batch_number: string
          created_at?: string | null
          drug_id: string
          expiry_date: string
          id?: string
          manufacturer_id: string
          production_date: string
          quantity: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          batch_number?: string
          created_at?: string | null
          drug_id?: string
          expiry_date?: string
          id?: string
          manufacturer_id?: string
          production_date?: string
          quantity?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drug_batches_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
        ]
      }
      drugs: {
        Row: {
          created_at: string | null
          description: string | null
          dosage: string
          gtin: string
          id: string
          manufacturer_id: string
          manufacturer_name: string
          product_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dosage: string
          gtin: string
          id?: string
          manufacturer_id: string
          manufacturer_name: string
          product_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dosage?: string
          gtin?: string
          id?: string
          manufacturer_id?: string
          manufacturer_name?: string
          product_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      erp_batches: {
        Row: {
          batch_id: string
          created_at: string | null
          drug_name: string
          facility: string | null
          id: string
          metadata: Json | null
          original_created_at: string | null
          quantity: number
          scanned_at: string | null
          scanned_by: string | null
          status: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          drug_name: string
          facility?: string | null
          id?: string
          metadata?: Json | null
          original_created_at?: string | null
          quantity: number
          scanned_at?: string | null
          scanned_by?: string | null
          status?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          drug_name?: string
          facility?: string | null
          id?: string
          metadata?: Json | null
          original_created_at?: string | null
          quantity?: number
          scanned_at?: string | null
          scanned_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      event_images: {
        Row: {
          batch_id: string
          created_at: string
          event_id: string | null
          file_size: number | null
          id: string
          image_hash: string | null
          image_path: string
          image_url: string
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          mime_type: string | null
          note: string | null
          step_name: string
          timestamp: string
          uploaded_by: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string
          event_id?: string | null
          file_size?: number | null
          id?: string
          image_hash?: string | null
          image_path: string
          image_url: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          mime_type?: string | null
          note?: string | null
          step_name: string
          timestamp?: string
          uploaded_by?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string
          event_id?: string | null
          file_size?: number | null
          id?: string
          image_hash?: string | null
          image_path?: string
          image_url?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          mime_type?: string | null
          note?: string | null
          step_name?: string
          timestamp?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_images_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_images_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "batch_events"
            referencedColumns: ["id"]
          },
        ]
      }
      kadha_analytics: {
        Row: {
          capsule_id: string
          created_at: string | null
          event_type: string
          id: string
          ip_address: string | null
          location_data: Json | null
          metadata: Json | null
          referrer: string | null
          scroll_depth: number | null
          session_id: string | null
          user_agent: string | null
          view_duration: number | null
        }
        Insert: {
          capsule_id: string
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          location_data?: Json | null
          metadata?: Json | null
          referrer?: string | null
          scroll_depth?: number | null
          session_id?: string | null
          user_agent?: string | null
          view_duration?: number | null
        }
        Update: {
          capsule_id?: string
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          location_data?: Json | null
          metadata?: Json | null
          referrer?: string | null
          scroll_depth?: number | null
          session_id?: string | null
          user_agent?: string | null
          view_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kadha_analytics_capsule_id_fkey"
            columns: ["capsule_id"]
            isOneToOne: false
            referencedRelation: "kadha_capsules"
            referencedColumns: ["id"]
          },
        ]
      }
      kadha_capsule_versions: {
        Row: {
          capsule_id: string
          change_notes: string | null
          content_snapshot: Json
          created_at: string | null
          created_by: string
          id: string
          version_number: number
        }
        Insert: {
          capsule_id: string
          change_notes?: string | null
          content_snapshot: Json
          created_at?: string | null
          created_by: string
          id?: string
          version_number: number
        }
        Update: {
          capsule_id?: string
          change_notes?: string | null
          content_snapshot?: Json
          created_at?: string | null
          created_by?: string
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "kadha_capsule_versions_capsule_id_fkey"
            columns: ["capsule_id"]
            isOneToOne: false
            referencedRelation: "kadha_capsules"
            referencedColumns: ["id"]
          },
        ]
      }
      kadha_capsules: {
        Row: {
          batch_id: string
          brand_message: string | null
          created_at: string | null
          created_by: string
          gmp_certifications: Json | null
          id: string
          is_active: boolean | null
          is_published: boolean | null
          key_ingredients: string | null
          metadata: Json | null
          organization_id: string
          origin_story: string
          product_name: string
          published_at: string | null
          qr_code: string | null
          scan_count: number | null
          short_link: string | null
          supporting_images: Json | null
          updated_at: string | null
          version_number: number | null
        }
        Insert: {
          batch_id: string
          brand_message?: string | null
          created_at?: string | null
          created_by: string
          gmp_certifications?: Json | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          key_ingredients?: string | null
          metadata?: Json | null
          organization_id: string
          origin_story: string
          product_name: string
          published_at?: string | null
          qr_code?: string | null
          scan_count?: number | null
          short_link?: string | null
          supporting_images?: Json | null
          updated_at?: string | null
          version_number?: number | null
        }
        Update: {
          batch_id?: string
          brand_message?: string | null
          created_at?: string | null
          created_by?: string
          gmp_certifications?: Json | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          key_ingredients?: string | null
          metadata?: Json | null
          organization_id?: string
          origin_story?: string
          product_name?: string
          published_at?: string | null
          qr_code?: string | null
          scan_count?: number | null
          short_link?: string | null
          supporting_images?: Json | null
          updated_at?: string | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kadha_capsules_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kadha_capsules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kadha_capsules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations_public"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string | null
          facility_type: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          organization_id: string
          state: string
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string | null
          facility_type: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          organization_id: string
          state: string
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string | null
          facility_type?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          organization_id?: string
          state?: string
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          assigned_user_email: string | null
          assigned_user_id: string | null
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          industry: string
          logo_url: string | null
          name: string
          organization_type:
            | Database["public"]["Enums"]["organization_type"]
            | null
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_user_email?: string | null
          assigned_user_id?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string
          logo_url?: string | null
          name: string
          organization_type?:
            | Database["public"]["Enums"]["organization_type"]
            | null
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_user_email?: string | null
          assigned_user_id?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string
          logo_url?: string | null
          name?: string
          organization_type?:
            | Database["public"]["Enums"]["organization_type"]
            | null
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      pharma_batches: {
        Row: {
          batch_number: string
          created_at: string
          description: string | null
          harvest_date: string | null
          id: string
          images: Json | null
          metadata: Json | null
          organization_id: string
          origin_location: string | null
          product_name: string
          product_type: string
          qr_code: string | null
          quantity: number | null
          status: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          batch_number: string
          created_at?: string
          description?: string | null
          harvest_date?: string | null
          id?: string
          images?: Json | null
          metadata?: Json | null
          organization_id: string
          origin_location?: string | null
          product_name: string
          product_type?: string
          qr_code?: string | null
          quantity?: number | null
          status?: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          batch_number?: string
          created_at?: string
          description?: string | null
          harvest_date?: string | null
          id?: string
          images?: Json | null
          metadata?: Json | null
          organization_id?: string
          origin_location?: string | null
          product_name?: string
          product_type?: string
          qr_code?: string | null
          quantity?: number | null
          status?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharma_batches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "pharma_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharma_batches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "pharma_organizations_public"
            referencedColumns: ["id"]
          },
        ]
      }
      pharma_kadha_analytics: {
        Row: {
          capsule_id: string
          created_at: string | null
          event_type: string
          id: string
          ip_address: string | null
          location_data: Json | null
          metadata: Json | null
          referrer: string | null
          scroll_depth: number | null
          session_id: string | null
          user_agent: string | null
          view_duration: number | null
        }
        Insert: {
          capsule_id: string
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          location_data?: Json | null
          metadata?: Json | null
          referrer?: string | null
          scroll_depth?: number | null
          session_id?: string | null
          user_agent?: string | null
          view_duration?: number | null
        }
        Update: {
          capsule_id?: string
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          location_data?: Json | null
          metadata?: Json | null
          referrer?: string | null
          scroll_depth?: number | null
          session_id?: string | null
          user_agent?: string | null
          view_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pharma_kadha_analytics_capsule_id_fkey"
            columns: ["capsule_id"]
            isOneToOne: false
            referencedRelation: "pharma_kadha_capsules"
            referencedColumns: ["id"]
          },
        ]
      }
      pharma_kadha_capsules: {
        Row: {
          batch_id: string
          brand_message: string | null
          created_at: string | null
          created_by: string
          gmp_certifications: Json | null
          id: string
          is_active: boolean | null
          is_published: boolean | null
          key_ingredients: string | null
          metadata: Json | null
          organization_id: string
          origin_story: string
          product_name: string
          published_at: string | null
          qr_code: string | null
          scan_count: number | null
          short_link: string | null
          supporting_images: Json | null
          updated_at: string | null
          version_number: number | null
        }
        Insert: {
          batch_id: string
          brand_message?: string | null
          created_at?: string | null
          created_by: string
          gmp_certifications?: Json | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          key_ingredients?: string | null
          metadata?: Json | null
          organization_id: string
          origin_story: string
          product_name: string
          published_at?: string | null
          qr_code?: string | null
          scan_count?: number | null
          short_link?: string | null
          supporting_images?: Json | null
          updated_at?: string | null
          version_number?: number | null
        }
        Update: {
          batch_id?: string
          brand_message?: string | null
          created_at?: string | null
          created_by?: string
          gmp_certifications?: Json | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          key_ingredients?: string | null
          metadata?: Json | null
          organization_id?: string
          origin_story?: string
          product_name?: string
          published_at?: string | null
          qr_code?: string | null
          scan_count?: number | null
          short_link?: string | null
          supporting_images?: Json | null
          updated_at?: string | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pharma_kadha_capsules_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "pharma_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharma_kadha_capsules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "pharma_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharma_kadha_capsules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "pharma_organizations_public"
            referencedColumns: ["id"]
          },
        ]
      }
      pharma_organizations: {
        Row: {
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          industry: string
          logo_url: string | null
          name: string
          organization_type: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string
          logo_url?: string | null
          name: string
          organization_type?: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string
          logo_url?: string | null
          name?: string
          organization_type?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      qr_analytics: {
        Row: {
          batch_id: string
          id: string
          ip_address: string | null
          location_data: Json | null
          metadata: Json | null
          scan_timestamp: string
          user_agent: string | null
        }
        Insert: {
          batch_id: string
          id?: string
          ip_address?: string | null
          location_data?: Json | null
          metadata?: Json | null
          scan_timestamp?: string
          user_agent?: string | null
        }
        Update: {
          batch_id?: string
          id?: string
          ip_address?: string | null
          location_data?: Json | null
          metadata?: Json | null
          scan_timestamp?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_analytics_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      recall_affected_items: {
        Row: {
          action_taken_at: string | null
          created_at: string | null
          current_location: string | null
          id: string
          item_id: string
          item_type: string
          lot_number: string | null
          metadata: Json | null
          notification_sent_at: string | null
          owner_gln: string | null
          recall_id: string
          sgtin: string | null
          status: string | null
        }
        Insert: {
          action_taken_at?: string | null
          created_at?: string | null
          current_location?: string | null
          id?: string
          item_id: string
          item_type: string
          lot_number?: string | null
          metadata?: Json | null
          notification_sent_at?: string | null
          owner_gln?: string | null
          recall_id: string
          sgtin?: string | null
          status?: string | null
        }
        Update: {
          action_taken_at?: string | null
          created_at?: string | null
          current_location?: string | null
          id?: string
          item_id?: string
          item_type?: string
          lot_number?: string | null
          metadata?: Json | null
          notification_sent_at?: string | null
          owner_gln?: string | null
          recall_id?: string
          sgtin?: string | null
          status?: string | null
        }
        Relationships: []
      }
      recall_events: {
        Row: {
          actor_name: string | null
          actor_role: string | null
          description: string | null
          event_type: string
          id: string
          metadata: Json | null
          recall_id: string
          timestamp: string | null
        }
        Insert: {
          actor_name?: string | null
          actor_role?: string | null
          description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          recall_id: string
          timestamp?: string | null
        }
        Update: {
          actor_name?: string | null
          actor_role?: string | null
          description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          recall_id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      serial_numbers: {
        Row: {
          batch_id: string | null
          created_at: string | null
          current_owner_id: string
          current_owner_name: string
          current_owner_role: string
          drug_id: string
          id: string
          sgtin: string
          status: string
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          current_owner_id: string
          current_owner_name: string
          current_owner_role: string
          drug_id: string
          id?: string
          sgtin: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          current_owner_id?: string
          current_owner_name?: string
          current_owner_role?: string
          drug_id?: string
          id?: string
          sgtin?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "serial_numbers_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "drug_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "serial_numbers_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          actual_arrival: string | null
          batch_id: string | null
          blockchain_tx_id: string | null
          created_at: string | null
          departure_date: string | null
          expected_arrival: string | null
          from_gln: string
          from_location: string | null
          id: string
          route_info: Json | null
          shipment_doc_hash: string | null
          shipment_number: string
          status: string | null
          temperature_controlled: boolean | null
          to_gln: string
          to_location: string | null
          updated_at: string | null
        }
        Insert: {
          actual_arrival?: string | null
          batch_id?: string | null
          blockchain_tx_id?: string | null
          created_at?: string | null
          departure_date?: string | null
          expected_arrival?: string | null
          from_gln: string
          from_location?: string | null
          id?: string
          route_info?: Json | null
          shipment_doc_hash?: string | null
          shipment_number: string
          status?: string | null
          temperature_controlled?: boolean | null
          to_gln: string
          to_location?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_arrival?: string | null
          batch_id?: string | null
          blockchain_tx_id?: string | null
          created_at?: string | null
          departure_date?: string | null
          expected_arrival?: string | null
          from_gln?: string
          from_location?: string | null
          id?: string
          route_info?: Json | null
          shipment_doc_hash?: string | null
          shipment_number?: string
          status?: string | null
          temperature_controlled?: boolean | null
          to_gln?: string
          to_location?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_events: {
        Row: {
          actor_id: string
          actor_name: string
          actor_role: string
          batch_id: string | null
          created_at: string | null
          details: Json | null
          drug_id: string
          event_type: string
          id: string
          location: string | null
          timestamp: string | null
        }
        Insert: {
          actor_id: string
          actor_name: string
          actor_role: string
          batch_id?: string | null
          created_at?: string | null
          details?: Json | null
          drug_id: string
          event_type: string
          id?: string
          location?: string | null
          timestamp?: string | null
        }
        Update: {
          actor_id?: string
          actor_name?: string
          actor_role?: string
          batch_id?: string | null
          created_at?: string | null
          details?: Json | null
          drug_id?: string
          event_type?: string
          id?: string
          location?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "drug_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      actor_capsules_public: {
        Row: {
          accent_color: string | null
          actor_name: string | null
          age: number | null
          bio: string | null
          created_at: string | null
          credits: Json | null
          eye_color: string | null
          gallery_images: Json | null
          hair_color: string | null
          has_passport: boolean | null
          height: string | null
          id: string | null
          imdb_url: string | null
          instagram_url: string | null
          intro_video_url: string | null
          is_published: boolean | null
          languages: string[] | null
          profile_photo: string | null
          qr_scan_count: number | null
          reels: Json | null
          short_link: string | null
          skills: string[] | null
          slug: string | null
          tagline: string | null
          theme: string | null
          updated_at: string | null
          videos: Json | null
          view_count: number | null
          youtube_url: string | null
        }
        Insert: {
          accent_color?: string | null
          actor_name?: string | null
          age?: number | null
          bio?: string | null
          created_at?: string | null
          credits?: Json | null
          eye_color?: string | null
          gallery_images?: Json | null
          hair_color?: string | null
          has_passport?: boolean | null
          height?: string | null
          id?: string | null
          imdb_url?: string | null
          instagram_url?: string | null
          intro_video_url?: string | null
          is_published?: boolean | null
          languages?: string[] | null
          profile_photo?: string | null
          qr_scan_count?: number | null
          reels?: Json | null
          short_link?: string | null
          skills?: string[] | null
          slug?: string | null
          tagline?: string | null
          theme?: string | null
          updated_at?: string | null
          videos?: Json | null
          view_count?: number | null
          youtube_url?: string | null
        }
        Update: {
          accent_color?: string | null
          actor_name?: string | null
          age?: number | null
          bio?: string | null
          created_at?: string | null
          credits?: Json | null
          eye_color?: string | null
          gallery_images?: Json | null
          hair_color?: string | null
          has_passport?: boolean | null
          height?: string | null
          id?: string | null
          imdb_url?: string | null
          instagram_url?: string | null
          intro_video_url?: string | null
          is_published?: boolean | null
          languages?: string[] | null
          profile_photo?: string | null
          qr_scan_count?: number | null
          reels?: Json | null
          short_link?: string | null
          skills?: string[] | null
          slug?: string | null
          tagline?: string | null
          theme?: string | null
          updated_at?: string | null
          videos?: Json | null
          view_count?: number | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      organizations_public: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          industry: string | null
          logo_url: string | null
          name: string | null
          organization_type:
            | Database["public"]["Enums"]["organization_type"]
            | null
          slug: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          industry?: string | null
          logo_url?: string | null
          name?: string | null
          organization_type?:
            | Database["public"]["Enums"]["organization_type"]
            | null
          slug?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          industry?: string | null
          logo_url?: string | null
          name?: string | null
          organization_type?:
            | Database["public"]["Enums"]["organization_type"]
            | null
          slug?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pharma_organizations_public: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          industry: string | null
          logo_url: string | null
          name: string | null
          organization_type: string | null
          slug: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          industry?: string | null
          logo_url?: string | null
          name?: string | null
          organization_type?: string | null
          slug?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          industry?: string | null
          logo_url?: string | null
          name?: string | null
          organization_type?: string | null
          slug?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_contact_rate_limit: { Args: { ip: string }; Returns: boolean }
      cleanup_analytics_pii: { Args: never; Returns: number }
      cleanup_old_analytics: { Args: never; Returns: number }
      cleanup_old_qr_analytics: { Args: never; Returns: undefined }
      get_analytics_summary: {
        Args: { p_batch_id?: string }
        Returns: {
          batch_id: string
          browser_family: string
          city: string
          country_code: string
          device_type: string
          id: string
          scan_date: string
          scan_hour: number
          scan_timestamp: string
        }[]
      }
      get_current_user_role: { Args: never; Returns: string }
      get_public_batch_events: {
        Args: { p_batch_id: string }
        Returns: {
          batch_id: string
          description: string
          event_timestamp: string
          event_type: string
          id: string
          location: string
          title: string
        }[]
      }
      get_public_batch_info: {
        Args: { p_batch_id: string }
        Returns: {
          batch_number: string
          description: string
          harvest_period: string
          id: string
          origin_region: string
          product_name: string
          product_type: string
          status: string
          unit: string
        }[]
      }
      get_public_event_images: {
        Args: { p_batch_id?: string }
        Returns: {
          batch_id: string
          created_at: string
          event_id: string
          event_timestamp: string
          id: string
          image_path: string
          image_url: string
          note: string
          step_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_actor_capsule_qr_scan_count: {
        Args: { capsule_id: string }
        Returns: undefined
      }
      increment_actor_capsule_view_count: {
        Args: { capsule_id: string }
        Returns: undefined
      }
      increment_capsule_qr_scan_count: {
        Args: { capsule_id: string }
        Returns: undefined
      }
      increment_capsule_view_count: {
        Args: { capsule_id: string }
        Returns: undefined
      }
      is_email_allowed: { Args: { check_email: string }; Returns: boolean }
    }
    Enums: {
      organization_type: "pharmaceutical" | "agriculture"
      user_role: "admin" | "producer" | "brand_manager"
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
    Enums: {
      organization_type: ["pharmaceutical", "agriculture"],
      user_role: ["admin", "producer", "brand_manager"],
    },
  },
} as const
