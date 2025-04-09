export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
