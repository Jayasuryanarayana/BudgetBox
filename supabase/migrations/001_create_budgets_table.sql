-- Create budgets table for BudgetBox
-- Run this migration in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS budgets (
  user_id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  last_updated BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on last_updated for faster queries
CREATE INDEX IF NOT EXISTS idx_budgets_last_updated ON budgets(last_updated DESC);

-- Create index on user_id (already primary key, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only access their own budget data
-- Note: Adjust this policy based on your authentication setup
CREATE POLICY "Users can view their own budgets"
  ON budgets FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Optional: Create a function to update updated_at timestamp
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

