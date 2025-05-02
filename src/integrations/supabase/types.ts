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
      bolt_scores: {
        Row: {
          created_at: string
          id: string
          score_seconds: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          score_seconds: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          score_seconds?: number
          user_id?: string
        }
        Relationships: []
      }
      breathing_goals: {
        Row: {
          description: string | null
          display_name: string
          id: string
          slug: string
        }
        Insert: {
          description?: string | null
          display_name: string
          id?: string
          slug: string
        }
        Update: {
          description?: string | null
          display_name?: string
          id?: string
          slug?: string
        }
        Relationships: []
      }
      breathing_pattern_status: {
        Row: {
          last_run: string | null
          pattern_id: string
          total_runs: number | null
          user_id: string
        }
        Insert: {
          last_run?: string | null
          pattern_id: string
          total_runs?: number | null
          user_id: string
        }
        Update: {
          last_run?: string | null
          pattern_id?: string
          total_runs?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breathing_pattern_status_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "breathing_patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      breathing_pattern_steps: {
        Row: {
          pattern_id: string
          position: number
          repetitions: number | null
          step_id: string | null
        }
        Insert: {
          pattern_id: string
          position: number
          repetitions?: number | null
          step_id?: string | null
        }
        Update: {
          pattern_id?: string
          position?: number
          repetitions?: number | null
          step_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pattern_steps_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "breathing_patterns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pattern_steps_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "breathing_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      breathing_patterns: {
        Row: {
          created_at: string | null
          created_by: string | null
          cycle_secs: number | null
          description: string | null
          goal_id: string | null
          id: string
          name: string
          recommended_minutes: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          cycle_secs?: number | null
          description?: string | null
          goal_id?: string | null
          id?: string
          name: string
          recommended_minutes?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          cycle_secs?: number | null
          description?: string | null
          goal_id?: string | null
          id?: string
          name?: string
          recommended_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patterns_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "breathing_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      breathing_steps: {
        Row: {
          created_at: string | null
          cue_text: string | null
          exhale_method: string
          exhale_secs: number
          hold_in_secs: number
          hold_out_secs: number
          id: string
          inhale_method: string
          inhale_secs: number
        }
        Insert: {
          created_at?: string | null
          cue_text?: string | null
          exhale_method: string
          exhale_secs: number
          hold_in_secs: number
          hold_out_secs: number
          id?: string
          inhale_method: string
          inhale_secs: number
        }
        Update: {
          created_at?: string | null
          cue_text?: string | null
          exhale_method?: string
          exhale_secs?: number
          hold_in_secs?: number
          hold_out_secs?: number
          id?: string
          inhale_method?: string
          inhale_secs?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      routine_items: {
        Row: {
          created_at: string | null
          id: string
          pattern_id: string | null
          position: number
          routine_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pattern_id?: string | null
          position: number
          routine_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pattern_id?: string | null
          position?: number
          routine_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routine_items_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "breathing_patterns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_items_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          created_at: string | null
          goal_id: string | null
          id: string
          name: string
          recommended_minutes: number | null
          total_minutes: number | null
        }
        Insert: {
          created_at?: string | null
          goal_id?: string | null
          id?: string
          name: string
          recommended_minutes?: number | null
          total_minutes?: number | null
        }
        Update: {
          created_at?: string | null
          goal_id?: string | null
          id?: string
          name?: string
          recommended_minutes?: number | null
          total_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "routines_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "breathing_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_routine_status: {
        Row: {
          completed_count: number | null
          last_completed_at: string | null
          routine_id: string
          total_minutes: number | null
          user_id: string
        }
        Insert: {
          completed_count?: number | null
          last_completed_at?: string | null
          routine_id: string
          total_minutes?: number | null
          user_id: string
        }
        Update: {
          completed_count?: number | null
          last_completed_at?: string | null
          routine_id?: string
          total_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_routine_status_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_total_runs: {
        Args: { p_routine_id: string; p_user_id: string }
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
