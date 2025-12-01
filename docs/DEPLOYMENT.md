# Deployment Guide

This guide covers deploying BudgetBox to Vercel (frontend) and Supabase (backend).

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase account (free tier available)

## Part 1: Supabase Setup (Backend)

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: BudgetBox (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be provisioned (~2 minutes)

### 2. Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/migrations/001_create_budgets_table.sql`
4. Click "Run" to execute the migration
5. Verify the table was created:
   - Go to **Table Editor**
   - You should see the `budgets` table

### 3. Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 4. Configure Row Level Security (Optional)

If you're using Supabase Auth, the RLS policies in the migration will work automatically. If not, you may need to adjust the policies or disable RLS:

```sql
-- Disable RLS if not using Supabase Auth
ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;
```

## Part 2: Vercel Setup (Frontend)

### 1. Connect GitHub Repository

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository: `Jayasuryanarayana/BudgetBox`
5. Click "Import"

### 2. Configure Environment Variables

In the Vercel project settings, add these environment variables:

#### Required for Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Optional:
```
USE_POSTGRES=false
```

**Important**: 
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` should be kept secret (server-side only)

### 3. Configure Build Settings

Vercel will auto-detect Next.js, but verify:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at: `https://your-project.vercel.app`

## Part 3: Post-Deployment Verification

### 1. Test the Application

1. Visit your Vercel deployment URL
2. Sign up for a new account
3. Enter some budget data
4. Verify data persists after refresh

### 2. Test Sync Functionality

1. Log in to your account
2. Enter budget data
3. Click "Sync Now" button
4. Check Supabase dashboard → Table Editor → `budgets` table
5. Verify your data appears in the database

### 3. Test Offline Mode

1. Open browser DevTools → Network tab
2. Set to "Offline"
3. Make changes to budget
4. Verify changes save locally
5. Go back online
6. Click "Sync Now"
7. Verify data syncs to Supabase

## Environment Variables Reference

### Vercel Environment Variables

| Variable | Description | Required | Public |
|----------|-------------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes | No |
| `USE_POSTGRES` | Use PostgreSQL instead of Supabase | No | No |

### Local Development

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Never commit `.env.local` to git!**

## Troubleshooting

### Issue: "Supabase client initialization failed"

**Solution**: 
- Verify all environment variables are set in Vercel
- Check that `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
- Ensure keys are copied correctly (no extra spaces)

### Issue: "Row Level Security policy violation"

**Solution**:
- If not using Supabase Auth, disable RLS:
  ```sql
  ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;
  ```
- Or adjust the RLS policies to match your auth setup

### Issue: "Table 'budgets' does not exist"

**Solution**:
- Run the migration SQL in Supabase SQL Editor
- Verify table exists in Table Editor

### Issue: Build fails on Vercel

**Solution**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 18+)

## Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

## Monitoring

### Vercel Analytics
- Enable in Vercel dashboard → Analytics
- View performance metrics and usage

### Supabase Dashboard
- Monitor database usage
- View API logs
- Check table data

## Cost Estimation

### Free Tier Limits:
- **Vercel**: 
  - 100GB bandwidth/month
  - Unlimited deployments
  - Hobby plan is free
  
- **Supabase**:
  - 500MB database
  - 2GB bandwidth/month
  - 50,000 monthly active users

For production with higher traffic, consider upgrading to paid plans.

## Security Best Practices

1. ✅ Never commit `.env.local` or `.env` files
2. ✅ Use `SUPABASE_SERVICE_ROLE_KEY` only server-side
3. ✅ Enable RLS policies in Supabase
4. ✅ Regularly rotate API keys
5. ✅ Use HTTPS (automatic with Vercel)
6. ✅ Monitor Supabase dashboard for unusual activity

