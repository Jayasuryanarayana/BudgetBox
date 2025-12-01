# Deployment Guide

This guide covers deploying BudgetBox to Vercel (frontend) and Supabase (backend).

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase account (free tier available)

## Part 1: Supabase Setup (Backend)

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: BudgetBox (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait for project to be provisioned (~2 minutes)

### 2. Create Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Paste the following SQL:

```sql
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
-- Note: Adjust this based on your authentication strategy
CREATE POLICY "Users can access their own budgets"
  ON budgets
  FOR ALL
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.user_id', true));
```

4. Click **"Run"** to execute the query

### 3. Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Part 2: Vercel Setup (Frontend)

### 1. Connect GitHub Repository

1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your repository: `Jayasuryanarayana/BudgetBox`
4. Click **"Import"**

### 2. Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Optional Variables:

```
USE_POSTGRES=false
```

### 3. Deploy

1. Vercel will automatically detect Next.js
2. Click **"Deploy"**
3. Wait for build to complete (~2-3 minutes)
4. Your app will be live at `https://your-project.vercel.app`

## Part 3: Post-Deployment

### 1. Update Supabase RLS Policies (If Needed)

If you're using custom authentication, you may need to adjust the Row Level Security policies:

```sql
-- Example: Allow all operations for authenticated users
-- Adjust based on your auth implementation
DROP POLICY IF EXISTS "Users can access their own budgets" ON budgets;

CREATE POLICY "Users can access their own budgets"
  ON budgets
  FOR ALL
  USING (true); -- Adjust this based on your auth needs
```

### 2. Test the Deployment

1. Visit your Vercel URL
2. Sign up for a new account
3. Enter budget data
4. Test sync functionality
5. Test offline mode (use browser DevTools)

## Environment Variables Reference

### Vercel Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `USE_POSTGRES` | Use PostgreSQL instead of Supabase | No | `false` |

### Local Development (.env.local)

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
USE_POSTGRES=false
```

**Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

## Database Migration

If you need to update the database schema later:

1. Go to Supabase SQL Editor
2. Run your migration SQL
3. Example migration:

```sql
-- Add a new column
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Update existing rows
UPDATE budgets SET version = 1 WHERE version IS NULL;
```

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure you've added `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment variables.

### Issue: "Row Level Security policy violation"

**Solution**: Adjust the RLS policies in Supabase to match your authentication strategy.

### Issue: "Cannot connect to Supabase"

**Solution**: 
- Verify your Supabase project is active
- Check that the URL and key are correct
- Ensure your Supabase project allows connections from your Vercel domain

## Monitoring

### Vercel Analytics

- View deployment logs in Vercel dashboard
- Monitor function execution times
- Check error rates

### Supabase Dashboard

- Monitor database usage
- View API requests
- Check database size and performance

## Cost Estimation

### Vercel (Free Tier)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions

### Supabase (Free Tier)
- ✅ 500MB database
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users

Both free tiers are sufficient for development and small projects!
