export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface User {
  id: string;
  organization_id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

export type InstrumentType = 'bond' | 'loan' | 'mortgage' | 'derivative';

export interface Instrument {
  id: string;
  organization_id: string;
  name: string;
  type: InstrumentType;
  isin: string | null;
  cusip: string | null;
  face_value: number;
  currency: string;
  issue_date: string | null;
  maturity_date: string | null;
  coupon_rate: number | null;
  payment_frequency: string | null;
  day_count_convention: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioHolding {
  id: string;
  portfolio_id: string;
  instrument_id: string;
  quantity: number;
  acquisition_date: string | null;
  acquisition_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface MarketData {
  id: string;
  organization_id: string;
  instrument_id: string;
  date: string;
  price: number;
  yield: number | null;
  spread: number | null;
  source: string | null;
  created_at: string;
}

export interface AnalysisResult {
  id: string;
  organization_id: string;
  portfolio_id: string;
  analysis_type: string;
  parameters: Record<string, unknown>;
  results: Record<string, unknown>;
  calculated_at: string;
  expires_at: string | null;
  created_by: string;
}

export interface UserPreferences {
  user_id: string;
  theme: 'light' | 'dark';
  dashboard_layout: Record<string, unknown>;
  notification_settings: Record<string, unknown>;
  updated_at: string;
}