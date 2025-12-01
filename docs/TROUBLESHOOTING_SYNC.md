# Troubleshooting Sync Errors

If you're experiencing sync errors after deployment, follow these steps:

## Common Sync Errors and Solutions

### 1. "Missing Supabase environment variables"

**Error Message**: `Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Solution**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify both variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Make sure they're enabled for **Production**, **Preview**, and **Development**
4. **Redeploy** your project after adding/updating variables

### 2. "Row Level Security policy violation" or "Permission denied"

**Error Message**: `Database access denied. Please check Supabase Row Level Security policies.`

**Solution**:
1. Go to your Supabase Dashboard → SQL Editor
2. Copy and run the SQL from `supabase/fix-rls-policy.sql` in your project, or run this:

```sql
-- Drop existing policy (especially if it uses auth.uid())
DROP POLICY IF EXISTS "Users can access their own budgets" ON budgets;

-- Create new policy that works with cookie-based auth
CREATE POLICY "Users can access their own budgets"
  ON budgets
  FOR ALL
  USING (true);
```

3. Click **"Run"** to execute
4. Try syncing again

**Why?** The old policy uses `auth.uid()` which requires Supabase Auth, but BudgetBox uses cookie-based authentication with email as userId.

**Note**: For production, you should create a more restrictive policy based on your authentication system.

### 3. "Table 'budgets' does not exist"

**Error Message**: `relation "budgets" does not exist`

**Solution**:
1. Go to Supabase Dashboard → SQL Editor
2. Copy the entire contents of `supabase/schema.sql` from your project
3. Paste and run it in the SQL Editor
4. Verify the table was created: Go to **Table Editor** → You should see `budgets` table

### 4. "Network error" or "Failed to fetch"

**Error Message**: `Failed to sync data` or network-related errors

**Possible Causes**:
- **CORS Issues**: Supabase should handle CORS automatically, but verify your Supabase project settings
- **Network Connectivity**: Check your internet connection
- **Vercel Function Timeout**: Check Vercel function logs for timeout errors

**Solution**:
1. Check browser console (F12) for detailed error messages
2. Check Vercel function logs: Vercel Dashboard → Your Project → Functions → View logs
3. Verify Supabase project is active (not paused)

### 5. "Invalid request data" or Validation Errors

**Error Message**: `Invalid request data` with validation details

**Solution**:
1. Check browser console for the validation error details
2. Ensure all budget fields are numbers (not strings or null)
3. Try refreshing the page and entering data again

### 6. User ID Issues

**Error Message**: Various errors related to userId

**Solution**:
- Make sure you're **logged in** (check for email in header)
- The userId is now extracted from your email cookie
- If you see "user-1" as userId, you might not be logged in properly
- Try logging out and logging back in

## Debugging Steps

### Step 1: Check Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify:
   - `NEXT_PUBLIC_SUPABASE_URL` is set and correct
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set and correct
3. If missing or incorrect, add/update them and **redeploy**

### Step 2: Verify Supabase Setup

1. **Check Table Exists**:
   - Supabase Dashboard → Table Editor
   - You should see `budgets` table

2. **Check RLS Policies**:
   - Supabase Dashboard → Authentication → Policies
   - Or run in SQL Editor:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'budgets';
   ```

3. **Test Database Connection**:
   - Supabase Dashboard → SQL Editor
   - Run: `SELECT COUNT(*) FROM budgets;`
   - Should return a number (even if 0)

### Step 3: Check Browser Console

1. Open your deployed app
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Try to sync
5. Look for error messages
6. Copy the full error message

### Step 4: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Find `/api/budget/sync`
4. Click to view logs
5. Look for error messages during sync attempts

### Step 5: Test Supabase Connection Directly

1. Go to Supabase Dashboard → API → REST
2. Try a test query:
   ```sql
   SELECT * FROM budgets LIMIT 1;
   ```
3. If this fails, there's a database issue

## Quick Fix Checklist

- [ ] Environment variables set in Vercel
- [ ] Environment variables enabled for all environments (Production, Preview, Development)
- [ ] Project redeployed after adding environment variables
- [ ] Supabase table `budgets` exists
- [ ] RLS policy allows operations (using `USING (true)` for testing)
- [ ] User is logged in (email visible in header)
- [ ] Internet connection is stable
- [ ] Supabase project is active (not paused)

## Still Having Issues?

1. **Check the exact error message** in:
   - Browser console (F12)
   - Vercel function logs
   - Sync Status component (red error box)

2. **Verify your setup**:
   - Supabase project URL matches environment variable
   - Supabase anon key matches environment variable
   - No typos in environment variable names

3. **Test locally**:
   - Create `.env.local` with your Supabase credentials
   - Run `npm run dev`
   - Test sync locally to isolate the issue

4. **Check Supabase Logs**:
   - Supabase Dashboard → Logs → API Logs
   - Look for failed requests

## Getting Help

If you're still stuck, provide:
1. The exact error message from browser console
2. Vercel function log output
3. Your Supabase project status (active/paused)
4. Whether you can see the `budgets` table in Supabase

