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
      instruments: {
        Row: {
          id: string
          organization_id: string
          name: string
          type: string
          isin: string | null
          cusip: string | null
          face_value: number
          current_balance: number
          currency: string
          payment_frequency: string
          day_count_convention: string
          created_at: string
          updated_at: string
          status: string
          metadata: Json
        }
        Insert: {
          organization_id: string
          name: string
          type: string
          isin?: string
          cusip?: string
          face_value: number
          current_balance: number
          currency?: string
          payment_frequency?: string
          day_count_convention?: string
          status?: string
          metadata?: Json
        }
        Update: Partial<Insert>
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          organization_id: string
          role: 'admin' | 'analyst' | 'viewer'
          first_name: string | null
          last_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id: string
          role?: 'admin' | 'analyst' | 'viewer'
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          role?: 'admin' | 'analyst' | 'viewer'
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      instruments: {
        Row: {
          id: string
          organization_id: string
          name: string
          type: 'bond' | 'loan' | 'mortgage' | 'derivative'
          isin: string | null
          cusip: string | null
          face_value: number
          currency: string
          issue_date: string | null
          maturity_date: string | null
          coupon_rate: number | null
          payment_frequency: string | null
          day_count_convention: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          type: 'bond' | 'loan' | 'mortgage' | 'derivative'
          isin?: string | null
          cusip?: string | null
          face_value: number
          currency: string
          issue_date?: string | null
          maturity_date?: string | null
          coupon_rate?: number | null
          payment_frequency?: string | null
          day_count_convention?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          type?: 'bond' | 'loan' | 'mortgage' | 'derivative'
          isin?: string | null
          cusip?: string | null
          face_value?: number
          currency?: string
          issue_date?: string | null
          maturity_date?: string | null
          coupon_rate?: number | null
          payment_frequency?: string | null
          day_count_convention?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}