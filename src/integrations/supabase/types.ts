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
    }
    Views: {
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
    }
    Functions: {
      cleanup_old_analytics: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_qr_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
    }
    Enums: {
      organization_type: "pharmaceutical" | "agriculture"
      user_role: "admin" | "producer"
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
      user_role: ["admin", "producer"],
    },
  },
} as const
