export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      site_analyses: {
        Row: {
          id: number
          url: string
          analyzed_at: string
          a_tags: number
          button_tags: number
          select_tags: number
          input_tags: number
          img_tags: number
          video_tags: number
        }
        Insert: {
          id?: number
          url: string
          analyzed_at?: string
          a_tags?: number
          button_tags?: number
          select_tags?: number
          input_tags?: number
          img_tags?: number
          video_tags?: number
        }
        Update: {
          id?: number
          url?: string
          analyzed_at?: string
          a_tags?: number
          button_tags?: number
          select_tags?: number
          input_tags?: number
          img_tags?: number
          video_tags?: number
        }
      }
      quiz_questions: {
        Row: {
          id: number
          question: string
          options: Json
          correct_answer: number
          tr_model_principle: string | null
          created_at: string
        }
        Insert: {
          id?: number
          question: string
          options: Json
          correct_answer: number
          tr_model_principle?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          question?: string
          options?: Json
          correct_answer?: number
          tr_model_principle?: string | null
          created_at?: string
        }
      }
      quiz_results: {
        Row: {
          id: number
          analysis_id: number | null
          score: number
          answers: Json
          completed_at: string
        }
        Insert: {
          id?: number
          analysis_id?: number | null
          score: number
          answers: Json
          completed_at?: string
        }
        Update: {
          id?: number
          analysis_id?: number | null
          score?: number
          answers?: Json
          completed_at?: string
        }
      }
    }
  }
}
