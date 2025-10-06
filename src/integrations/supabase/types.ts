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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      hero_slides: {
        Row: {
          created_at: string
          duration_seconds: number
          id: string
          image_url: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          id?: string
          image_url: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          id?: string
          image_url?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      product_specs: {
        Row: {
          created_at: string
          id: string
          label: string
          product_id: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          product_id: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          product_id?: string
          sort_order?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_specs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          discount_percent: number
          id: string
          image_url: string | null
          name: string
          price_exchange_mrp: number | null
          price_mrp: number
          price_without_exchange: number | null
          segment_id: string
          show_exchange_price: boolean | null
          show_special_price: boolean | null
          show_without_exchange_price: boolean | null
          sort_order: number
          special_price: number | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percent?: number
          id?: string
          image_url?: string | null
          name: string
          price_exchange_mrp?: number | null
          price_mrp: number
          price_without_exchange?: number | null
          segment_id: string
          show_exchange_price?: boolean | null
          show_special_price?: boolean | null
          show_without_exchange_price?: boolean | null
          sort_order?: number
          special_price?: number | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percent?: number
          id?: string
          image_url?: string | null
          name?: string
          price_exchange_mrp?: number | null
          price_mrp?: number
          price_without_exchange?: number | null
          segment_id?: string
          show_exchange_price?: boolean | null
          show_special_price?: boolean | null
          show_without_exchange_price?: boolean | null
          sort_order?: number
          special_price?: number | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "products_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          name: string
          rating: number
          sort_order: number
          text: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          rating?: number
          sort_order?: number
          text: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          rating?: number
          sort_order?: number
          text?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      segments: {
        Row: {
          created_at: string
          id: string
          key: string
          name: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          name: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          name?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_us: string | null
          address: string | null
          base_font_size: number | null
          canonical_url: string | null
          city: string | null
          contact_info: string | null
          email: string | null
          facebook_url: string | null
          festive_enabled: boolean | null
          festive_image_url: string | null
          hero_background_image: string | null
          hero_gradient_animated: boolean | null
          hero_gradient_animation_duration: number
          hero_gradient_duration: number
          hero_gradient_visible: boolean | null
          hero_subtitle: string | null
          hero_title: string | null
          instagram_url: string | null
          key: string
          logo_url: string | null
          map_embed_src: string | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          site_name: string
          tagline: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          about_us?: string | null
          address?: string | null
          base_font_size?: number | null
          canonical_url?: string | null
          city?: string | null
          contact_info?: string | null
          email?: string | null
          facebook_url?: string | null
          festive_enabled?: boolean | null
          festive_image_url?: string | null
          hero_background_image?: string | null
          hero_gradient_animated?: boolean | null
          hero_gradient_animation_duration?: number
          hero_gradient_duration?: number
          hero_gradient_visible?: boolean | null
          hero_subtitle?: string | null
          hero_title?: string | null
          instagram_url?: string | null
          key?: string
          logo_url?: string | null
          map_embed_src?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_name?: string
          tagline?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          about_us?: string | null
          address?: string | null
          base_font_size?: number | null
          canonical_url?: string | null
          city?: string | null
          contact_info?: string | null
          email?: string | null
          facebook_url?: string | null
          festive_enabled?: boolean | null
          festive_image_url?: string | null
          hero_background_image?: string | null
          hero_gradient_animated?: boolean | null
          hero_gradient_animation_duration?: number
          hero_gradient_duration?: number
          hero_gradient_visible?: boolean | null
          hero_subtitle?: string | null
          hero_title?: string | null
          instagram_url?: string | null
          key?: string
          logo_url?: string | null
          map_embed_src?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_name?: string
          tagline?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
