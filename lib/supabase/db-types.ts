export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  ovk: {
    Tables: {
      answer_options: {
        Row: {
          created_at: string
          creator_id: string | null
          id: number
          poll_id: number
          text: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          id?: number
          poll_id: number
          text: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          id?: number
          poll_id?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_options_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_options_poll_id_fkey"
            columns: ["poll_id"]
            referencedRelation: "polls"
            referencedColumns: ["id"]
          }
        ]
      }
      answers: {
        Row: {
          answer_option_id: number
          created_at: string
          id: number
          poll_id: number
          user_id: string
        }
        Insert: {
          answer_option_id: number
          created_at?: string
          id?: number
          poll_id: number
          user_id: string
        }
        Update: {
          answer_option_id?: number
          created_at?: string
          id?: number
          poll_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_poll_id_fkey"
            columns: ["poll_id"]
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          logo_url: string
          name: string
          start_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          logo_url: string
          name: string
          start_at: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          logo_url?: string
          name?: string
          start_at?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          created_at: string
          event_id: number
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: number
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participants_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      polls: {
        Row: {
          created_at: string
          creator_id: string | null
          display_mode: string
          duration: number | null
          end_at: string | null
          event_id: number
          id: number
          is_finished: boolean
          question: string
          start_at: string | null
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          display_mode?: string
          duration?: number | null
          end_at?: string | null
          event_id: number
          id?: number
          is_finished?: boolean
          question: string
          start_at?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          display_mode?: string
          duration?: number | null
          end_at?: string | null
          event_id?: number
          id?: number
          is_finished?: boolean
          question?: string
          start_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "polls_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          academic_group: string | null
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string
          id: number
          last_name: string
          second_name: string | null
          user_id: string
        }
        Insert: {
          academic_group?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: number
          last_name: string
          second_name?: string | null
          user_id: string
        }
        Update: {
          academic_group?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          second_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      resources: {
        Row: {
          created_at: string
          event_id: number | null
          id: number
          name: string
          svg_icon: string
          url: string
        }
        Insert: {
          created_at?: string
          event_id?: number | null
          id?: number
          name: string
          svg_icon: string
          url: string
        }
        Update: {
          created_at?: string
          event_id?: number | null
          id?: number
          name?: string
          svg_icon?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      superusers: {
        Row: {
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "superusers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users_permissions: {
        Row: {
          created_at: string
          event_id: number
          id: number
          is_access_moderator: boolean
          is_voting_moderator: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: number
          id?: number
          is_access_moderator?: boolean
          is_voting_moderator?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: number
          id?: number
          is_access_moderator?: boolean
          is_voting_moderator?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_permissions_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_permissions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_event_id_by_answer_option_id: {
        Args: {
          _answer_option_id: number
        }
        Returns: number
      }
      is_access_moderator: {
        Args: {
          _user_id: string
          _event_id: number
        }
        Returns: boolean
      }
      is_superuser: {
        Args: {
          _user_id: string
        }
        Returns: boolean
      }
      is_voting_moderator: {
        Args: {
          _user_id: string
          _event_id: number
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: {
          p_usename: string
        }
        Returns: {
          username: string
          password: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgroonga: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      command:
        | {
            Args: {
              groongacommand: string
            }
            Returns: string
          }
        | {
            Args: {
              groongacommand: string
              arguments: string[]
            }
            Returns: string
          }
      command_escape_value: {
        Args: {
          value: string
        }
        Returns: string
      }
      escape:
        | {
            Args: {
              value: string
            }
            Returns: string
          }
        | {
            Args: {
              value: string
              special_characters: string
            }
            Returns: string
          }
        | {
            Args: {
              value: boolean
            }
            Returns: string
          }
        | {
            Args: {
              value: number
            }
            Returns: string
          }
        | {
            Args: {
              value: number
            }
            Returns: string
          }
        | {
            Args: {
              value: number
            }
            Returns: string
          }
        | {
            Args: {
              value: number
            }
            Returns: string
          }
        | {
            Args: {
              value: number
            }
            Returns: string
          }
        | {
            Args: {
              value: string
            }
            Returns: string
          }
        | {
            Args: {
              value: string
            }
            Returns: string
          }
      flush: {
        Args: {
          indexname: unknown
        }
        Returns: boolean
      }
      highlight_html: {
        Args: {
          target: string
          keywords: string[]
        }
        Returns: string
      }
      match_positions_byte: {
        Args: {
          target: string
          keywords: string[]
        }
        Returns: unknown
      }
      match_positions_character: {
        Args: {
          target: string
          keywords: string[]
        }
        Returns: unknown
      }
      match_term:
        | {
            Args: {
              target: string
              term: string
            }
            Returns: boolean
          }
        | {
            Args: {
              target: string[]
              term: string
            }
            Returns: boolean
          }
        | {
            Args: {
              target: string
              term: string
            }
            Returns: boolean
          }
        | {
            Args: {
              target: string[]
              term: string
            }
            Returns: boolean
          }
      query_escape: {
        Args: {
          query: string
        }
        Returns: string
      }
      query_expand: {
        Args: {
          tablename: unknown
          termcolumnname: string
          synonymscolumnname: string
          query: string
        }
        Returns: string
      }
      query_extract_keywords: {
        Args: {
          query: string
        }
        Returns: unknown
      }
      score: {
        Args: {
          row: Record<string, unknown>
        }
        Returns: number
      }
      snippet_html: {
        Args: {
          target: string
          keywords: string[]
          width?: number
        }
        Returns: unknown
      }
      table_name: {
        Args: {
          indexname: unknown
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chats: {
        Row: {
          id: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          id: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      test_tenant: {
        Row: {
          details: string | null
          id: number
        }
        Insert: {
          details?: string | null
          id?: number
        }
        Update: {
          details?: string | null
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      debts_cache: {
        Row: {
          exists: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  rtu_mirea: {
    Tables: {
      analytics: {
        Row: {
          by_departments: Json | null
          by_institutes: Json
          created_at: string
          debtors: number
          debts: number
          id: number
        }
        Insert: {
          by_departments?: Json | null
          by_institutes: Json
          created_at?: string
          debtors: number
          debts: number
          id?: number
        }
        Update: {
          by_departments?: Json | null
          by_institutes?: Json
          created_at?: string
          debtors?: number
          debts?: number
          id?: number
        }
        Relationships: []
      }
      debts_disciplines: {
        Row: {
          department: string | null
          id: number
          name: string
          name_uuid: string | null
          student_uuid: string
        }
        Insert: {
          department?: string | null
          id?: number
          name: string
          name_uuid?: string | null
          student_uuid: string
        }
        Update: {
          department?: string | null
          id?: number
          name?: string
          name_uuid?: string | null
          student_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "debts_disciplines_student_uuid_fkey"
            columns: ["student_uuid"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      employees: {
        Row: {
          department: string
          human_uuid: string
          id: number
          post: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          department: string
          human_uuid: string
          id?: number
          post: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          department?: string
          human_uuid?: string
          id?: number
          post?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      extended_permissions: {
        Row: {
          created_at: string
          department: string | null
          human_uuid: string
          id: number
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          human_uuid: string
          id?: number
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          human_uuid: string
          id?: number
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "extended_permissions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          human_uuid: string
          id: string
          last_name: string
          second_name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          human_uuid: string
          id: string
          last_name: string
          second_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          human_uuid?: string
          id?: string
          last_name?: string
          second_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      retakes: {
        Row: {
          created_at: string
          creator_id: string
          date: string
          description: string | null
          discipline: string
          id: number
          is_online: boolean
          need_statement: boolean
          place: string
          teachers: string
          time_end: string
          time_start: string
        }
        Insert: {
          created_at?: string
          creator_id?: string
          date: string
          description?: string | null
          discipline: string
          id?: number
          is_online?: boolean
          need_statement?: boolean
          place: string
          teachers: string
          time_end: string
          time_start: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          date?: string
          description?: string | null
          discipline?: string
          id?: number
          is_online?: boolean
          need_statement?: boolean
          place?: string
          teachers?: string
          time_end?: string
          time_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "retakes_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      social_networks: {
        Row: {
          created_at: string
          external_id: string
          id: number
          student_id: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          external_id: string
          id?: number
          student_id?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          external_id?: string
          id?: number
          student_id?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_networks_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_networks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      students: {
        Row: {
          academic_email: string | null
          academic_group: string | null
          direction_code: string | null
          email: string | null
          first_name: string
          id: string
          institute: string | null
          last_name: string
          personal_number: string | null
          second_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          academic_email?: string | null
          academic_group?: string | null
          direction_code?: string | null
          email?: string | null
          first_name: string
          id: string
          institute?: string | null
          last_name: string
          personal_number?: string | null
          second_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_email?: string | null
          academic_group?: string | null
          direction_code?: string | null
          email?: string | null
          first_name?: string
          id?: string
          institute?: string | null
          last_name?: string
          personal_number?: string | null
          second_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      test: {
        Row: {
          discipline: string | null
          discipline_guid: string | null
          exam_type: string | null
          id: number
          labor: number | null
          mark_coef: number | null
          student_guid: string | null
          term: number | null
        }
        Insert: {
          discipline?: string | null
          discipline_guid?: string | null
          exam_type?: string | null
          id?: number
          labor?: number | null
          mark_coef?: number | null
          student_guid?: string | null
          term?: number | null
        }
        Update: {
          discipline?: string | null
          discipline_guid?: string | null
          exam_type?: string | null
          id?: number
          labor?: number | null
          mark_coef?: number | null
          student_guid?: string | null
          term?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_debtors_by_institute: {
        Args: {
          _institute: string
        }
        Returns: number
      }
      get_debtors_count: {
        Args: {
          _department?: string
        }
        Returns: number
      }
      get_debts_by_institute: {
        Args: {
          _institute: string
        }
        Returns: number
      }
      get_debts_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_expelled_by_institute: {
        Args: {
          _institute: string
        }
        Returns: number
      }
      get_students_by_institute: {
        Args: {
          _institute: string
        }
        Returns: number
      }
      get_unique_academic_groups_by_department: {
        Args: {
          _department: string
        }
        Returns: string[]
      }
      get_unique_disciplines: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_unique_disciplines_by_department: {
        Args: {
          _department: string
        }
        Returns: string[]
      }
      get_unique_disciplines_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_user_department: {
        Args: {
          _user_id: string
        }
        Returns: string
      }
      is_employee: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      search_employees_by_name: {
        Args: {
          _name: string
        }
        Returns: {
          department: string
          human_uuid: string
          id: number
          post: string
          updated_at: string
          user_id: string | null
        }[]
      }
      search_students: {
        Args: {
          _limit: number
          _offset: number
          _name?: string
          _academic_groups?: string[]
          _debts_disciplines?: string[]
          _department?: string
        }
        Returns: {
          academic_email: string | null
          academic_group: string | null
          direction_code: string | null
          email: string | null
          first_name: string
          id: string
          institute: string | null
          last_name: string
          personal_number: string | null
          second_name: string | null
          status: string | null
          updated_at: string | null
        }[]
      }
      search_students_count: {
        Args: {
          _name?: string
          _academic_groups?: string[]
          _debts_disciplines?: string[]
          _department?: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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
