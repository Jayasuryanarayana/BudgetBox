-- BudgetBox Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  user_id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  last_updated BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on last_updated for faster queries
CREATE INDEX IF NOT EXISTS idx_budgets_last_updated ON budgets(last_updated);

-- Enable Row Level Security (RLS)
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access their own data
-- Note: BudgetBox uses cookie-based auth (email as userId), not Supabase Auth
-- This policy allows all operations for now. For production, you can make it more restrictive.
CREATE POLICY "Users can access their own budgets"
  ON budgets
  FOR ALL
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

