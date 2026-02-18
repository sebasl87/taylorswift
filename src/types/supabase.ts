export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      news_articles: {
        Row: {
          id: string
          title_es: string
          title_en: string
          description_es: string
          description_en: string
          image_url: string | null
          image_alt_es: string | null
          image_alt_en: string | null
          image_caption_es: string | null
          image_caption_en: string | null
          published_date: string
          link_url: string | null
          link_target: '_blank' | '_self' | null
          comments_active: boolean | null
          youtube_video_id: string | null
          is_automated: boolean | null
          source_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title_es: string
          title_en: string
          description_es: string
          description_en: string
          image_url?: string | null
          image_alt_es?: string | null
          image_alt_en?: string | null
          image_caption_es?: string | null
          image_caption_en?: string | null
          published_date: string
          link_url?: string | null
          link_target?: '_blank' | '_self' | null
          comments_active?: boolean | null
          youtube_video_id?: string | null
          is_automated?: boolean | null
          source_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_es?: string
          title_en?: string
          description_es?: string
          description_en?: string
          image_url?: string | null
          image_alt_es?: string | null
          image_alt_en?: string | null
          image_caption_es?: string | null
          image_caption_en?: string | null
          published_date?: string
          link_url?: string | null
          link_target?: '_blank' | '_self' | null
          comments_active?: boolean | null
          youtube_video_id?: string | null
          is_automated?: boolean | null
          source_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news_external_links: {
        Row: {
          id: string
          news_id: string
          url: string
          text_es: string
          text_en: string
          order_index: number | null
          created_at: string
        }
        Insert: {
          id?: string
          news_id: string
          url: string
          text_es: string
          text_en: string
          order_index?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          news_id?: string
          url?: string
          text_es?: string
          text_en?: string
          order_index?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      news_articles_with_links: {
        Row: {
          id: string
          title_es: string
          title_en: string
          description_es: string
          description_en: string
          image_url: string | null
          image_alt_es: string | null
          image_alt_en: string | null
          image_caption_es: string | null
          image_caption_en: string | null
          published_date: string
          link_url: string | null
          link_target: '_blank' | '_self' | null
          comments_active: boolean | null
          youtube_video_id: string | null
          is_automated: boolean | null
          source_url: string | null
          created_at: string
          updated_at: string
          external_links: Json
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
