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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
