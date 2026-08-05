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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      booking_allocations: {
        Row: {
          allocation_index: number
          booked_room_category: string
          booked_room_type: string
          booking_id: string
          booking_room_id: string | null
          client_id: string
          created_at: string
          id: string
          occupancy: number | null
          requests: string[]
          room_type: string
          status: string
          updated_at: string
          upgrade_request: Json | null
        }
        Insert: {
          allocation_index: number
          booked_room_category?: string
          booked_room_type: string
          booking_id: string
          booking_room_id?: string | null
          client_id: string
          created_at?: string
          id?: string
          occupancy?: number | null
          requests?: string[]
          room_type: string
          status?: string
          updated_at?: string
          upgrade_request?: Json | null
        }
        Update: {
          allocation_index?: number
          booked_room_category?: string
          booked_room_type?: string
          booking_id?: string
          booking_room_id?: string | null
          client_id?: string
          created_at?: string
          id?: string
          occupancy?: number | null
          requests?: string[]
          room_type?: string
          status?: string
          updated_at?: string
          upgrade_request?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_allocations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_allocations_booking_room_id_fkey"
            columns: ["booking_room_id"]
            isOneToOne: false
            referencedRelation: "booking_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_guests: {
        Row: {
          allocation_id: string | null
          booking_id: string
          client_id: string
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          nationality: string | null
          phone: string | null
          position: number
          requirements: string[]
          special_requests: string | null
          updated_at: string
        }
        Insert: {
          allocation_id?: string | null
          booking_id: string
          client_id: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          nationality?: string | null
          phone?: string | null
          position?: number
          requirements?: string[]
          special_requests?: string | null
          updated_at?: string
        }
        Update: {
          allocation_id?: string | null
          booking_id?: string
          client_id?: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          nationality?: string | null
          phone?: string | null
          position?: number
          requirements?: string[]
          special_requests?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_guests_allocation_id_fkey"
            columns: ["allocation_id"]
            isOneToOne: false
            referencedRelation: "booking_allocations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_guests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_rooming_lists: {
        Row: {
          booking_id: string
          change_log: Json
          created_at: string
          group_requests: string[]
          saved_at: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          booking_id: string
          change_log?: Json
          created_at?: string
          group_requests?: string[]
          saved_at?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string
          change_log?: Json
          created_at?: string
          group_requests?: string[]
          saved_at?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_rooming_lists_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_rooms: {
        Row: {
          booking_id: string
          check_in: string | null
          check_out: string | null
          created_at: string
          id: string
          meal_plan: string | null
          notes: string | null
          occupancy: number | null
          quantity: number
          room_category: string
          room_type: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          id?: string
          meal_plan?: string | null
          notes?: string | null
          occupancy?: number | null
          quantity?: number
          room_category?: string
          room_type: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          id?: string
          meal_plan?: string | null
          notes?: string | null
          occupancy?: number | null
          quantity?: number
          room_category?: string
          room_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_rooms_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_type: Database["public"]["Enums"]["booking_type"]
          cancelled_at: string | null
          city: string | null
          contact: Json
          country: string | null
          created_at: string
          delegates: number | null
          destination: string
          end_date: string | null
          guests: number | null
          hotel_name: string | null
          hotel_reference: string | null
          hotel_reference_source: string | null
          id: string
          image_key: string | null
          meeting_spaces: number | null
          name: string
          nights: number
          reference: string
          request: Json
          rooms: number | null
          start_date: string | null
          status: string
          status_note: string | null
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_type?: Database["public"]["Enums"]["booking_type"]
          cancelled_at?: string | null
          city?: string | null
          contact?: Json
          country?: string | null
          created_at?: string
          delegates?: number | null
          destination?: string
          end_date?: string | null
          guests?: number | null
          hotel_name?: string | null
          hotel_reference?: string | null
          hotel_reference_source?: string | null
          id?: string
          image_key?: string | null
          meeting_spaces?: number | null
          name?: string
          nights?: number
          reference?: string
          request?: Json
          rooms?: number | null
          start_date?: string | null
          status?: string
          status_note?: string | null
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_type?: Database["public"]["Enums"]["booking_type"]
          cancelled_at?: string | null
          city?: string | null
          contact?: Json
          country?: string | null
          created_at?: string
          delegates?: number | null
          destination?: string
          end_date?: string | null
          guests?: number | null
          hotel_name?: string | null
          hotel_reference?: string | null
          hotel_reference_source?: string | null
          id?: string
          image_key?: string | null
          meeting_spaces?: number | null
          name?: string
          nights?: number
          reference?: string
          request?: Json
          rooms?: number | null
          start_date?: string | null
          status?: string
          status_note?: string | null
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          country: string | null
          created_at: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_edits: {
        Row: {
          created_at: string
          edit: Json
          element_path: string
          id: string
          route: string
          signature: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          edit?: Json
          element_path: string
          id?: string
          route: string
          signature?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          edit?: Json
          element_path?: string
          id?: string
          route?: string
          signature?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_read_booking: { Args: { _booking_id: string }; Returns: boolean }
      generate_booking_reference: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_booking: { Args: { _booking_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "staff" | "customer"
      booking_type: "leisure" | "me"
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
      app_role: ["admin", "staff", "customer"],
      booking_type: ["leisure", "me"],
    },
  },
} as const
