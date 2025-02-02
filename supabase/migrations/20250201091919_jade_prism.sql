/*
  # Initial Schema Setup for Financial Analytics Platform

  1. Core Tables
    - organizations: Multi-tenant support
    - users: User management with roles
    - instruments: Financial instrument definitions
    - portfolios: Portfolio management
    - market_data: Market data storage
    - analysis_results: Calculation results cache
    - user_preferences: User settings storage

  2. Security
    - RLS policies for all tables
    - Organization-based access control
    - Role-based permissions
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Roles enum
CREATE TYPE user_role AS ENUM ('admin', 'analyst', 'viewer');

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  organization_id uuid REFERENCES organizations(id),
  role user_role NOT NULL DEFAULT 'viewer',
  first_name text,
  last_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(id, organization_id)
);

-- Instrument types enum
CREATE TYPE instrument_type AS ENUM (
  'bond',
  'loan',
  'mortgage',
  'derivative'
);

-- Instruments
CREATE TABLE instruments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  type instrument_type NOT NULL,
  isin text,
  cusip text,
  face_value decimal NOT NULL,
  currency text NOT NULL,
  issue_date date,
  maturity_date date,
  coupon_rate decimal,
  payment_frequency interval,
  day_count_convention text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Portfolios
CREATE TABLE portfolios (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Portfolio Holdings
CREATE TABLE portfolio_holdings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id uuid REFERENCES portfolios(id),
  instrument_id uuid REFERENCES instruments(id),
  quantity decimal NOT NULL,
  acquisition_date date,
  acquisition_price decimal,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Market Data
CREATE TABLE market_data (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id),
  instrument_id uuid REFERENCES instruments(id),
  date date NOT NULL,
  price decimal NOT NULL,
  yield decimal,
  spread decimal,
  source text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(instrument_id, date)
);

-- Analysis Results Cache
CREATE TABLE analysis_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id),
  portfolio_id uuid REFERENCES portfolios(id),
  analysis_type text NOT NULL,
  parameters jsonb,
  results jsonb NOT NULL,
  calculated_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_by uuid REFERENCES users(id)
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id uuid PRIMARY KEY REFERENCES users(id),
  theme text DEFAULT 'light',
  dashboard_layout jsonb,
  notification_settings jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Organizations
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Users
CREATE POLICY "Users can view members of their organization"
  ON users FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Instruments
CREATE POLICY "Users can view instruments in their organization"
  ON instruments FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Analysts and admins can create instruments"
  ON instruments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users 
      WHERE organization_id = NEW.organization_id 
      AND role IN ('analyst', 'admin')
    )
  );

-- Portfolios
CREATE POLICY "Users can view portfolios in their organization"
  ON portfolios FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Analysts and admins can manage portfolios"
  ON portfolios FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM users 
      WHERE organization_id = organization_id 
      AND role IN ('analyst', 'admin')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_instruments_org ON instruments(organization_id);
CREATE INDEX idx_portfolios_org ON portfolios(organization_id);
CREATE INDEX idx_market_data_instrument ON market_data(instrument_id);
CREATE INDEX idx_market_data_date ON market_data(date);
CREATE INDEX idx_portfolio_holdings_portfolio ON portfolio_holdings(portfolio_id);