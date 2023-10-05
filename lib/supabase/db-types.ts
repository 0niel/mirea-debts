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
      [_ in never]: never
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
      [_ in never]: never
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
  rtu_mirea: {
    Tables: {
      debts_disciplines: {
        Row: {
          id: number
          name: string
          name_uuid: string | null
          student_uuid: string
        }
        Insert: {
          id?: number
          name: string
          name_uuid?: string | null
          student_uuid: string
        }
        Update: {
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
            referencedColumns: ["student_uuid"]
          }
        ]
      }
      statistics: {
        Row: {
          created_at: string
          debtors: number
          debts: number
          id: number
        }
        Insert: {
          created_at?: string
          debtors: number
          debts: number
          id?: number
        }
        Update: {
          created_at?: string
          debtors?: number
          debts?: number
          id?: number
        }
        Relationships: []
      }
      students: {
        Row: {
          academic_group: string | null
          directionCode: string | null
          first_name: string
          id: number
          institute: string | null
          last_name: string
          personal_number: string | null
          second_name: string | null
          status: string | null
          student_uuid: string
        }
        Insert: {
          academic_group?: string | null
          directionCode?: string | null
          first_name: string
          id?: number
          institute?: string | null
          last_name: string
          personal_number?: string | null
          second_name?: string | null
          status?: string | null
          student_uuid: string
        }
        Update: {
          academic_group?: string | null
          directionCode?: string | null
          first_name?: string
          id?: number
          institute?: string | null
          last_name?: string
          personal_number?: string | null
          second_name?: string | null
          status?: string | null
          student_uuid?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_debts_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_unique_debtors_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_unique_disciplines: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>
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
