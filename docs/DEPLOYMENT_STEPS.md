# Step-by-Step Deployment Guide

Follow these steps to deploy BudgetBox to Vercel and Supabase.

## Part 1: Supabase Setup (Backend Database)

### Step 1.1: Create Supabase Account & Project

1. **Go to Supabase**
   - Visit: https://supabase.com
   - Click **"Start your project"** or **"Sign in"**
   - Sign in with GitHub (recommended) or email

2. **Create New Project**
   - Click **"New Project"** button
   - Fill in the form:
     - **Name**: `BudgetBox` (or any name you prefer)
     - **Database Password**: Create a strong password
       - ⚠️ **IMPORTANT**: Save this password! You'll need it later.
       - Example: `MySecurePassword123!`
     - **Region**: Choose the region closest to you or your users
       - Examples: `US East (North Virginia)`, `EU West (Ireland)`, `Asia Pacific (Singapore)`
     - **Pricing Plan**: Select **Free** (sufficient for development)
   - Click **"Create new project"**

3. **Wait for Project Setup**
   - This takes about 2-3 minutes
   - You'll see a progress indicator
   - Don't close the browser tab!

### Step 1.2: Get Your Supabase Credentials

1. **Navigate to API Settings**
   - In your Supabase project dashboard, click **Settings** (gear icon in left sidebar)
   - Click **API** in the settings menu

2. **Copy Your Credentials**
   - Find **Project URL**
     - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
     - Click the copy icon next to it
     - **Save this somewhere** (we'll use it in Step 2.3)
   
   - Find **anon public** key
     - It's a long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     - Click the copy icon next to it
     - **Save this somewhere** (we'll use it in Step 2.3)

### Step 1.3: Create Database Table

1. **Open SQL Editor**
   - In the left sidebar, click **SQL Editor**
   - Click **"New query"** button

2. **Run the Schema**
   - Open the file `supabase/schema.sql` from this project
   - Copy the entire contents
   - Paste it into the SQL Editor
   - Click **"Run"** button (or press Ctrl+Enter)
   - You should see: ✅ "Success. No rows returned"

3. **Verify Table Creation**
   - In the left sidebar, click **Table Editor**
   - You should see a table named **`budgets`**
   - Click on it to see the columns:
     - `user_id` (text, primary key)
     - `data` (jsonb)
     - `last_updated` (bigint)
     - `created_at` (timestamp)
     - `updated_at` (timestamp)

✅ **Supabase Setup Complete!** You now have:
- A Supabase project
- Database credentials (URL and anon key)
- Database table ready to use

---

## Part 2: Vercel Setup (Frontend Hosting)

### Step 2.1: Create Vercel Account

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click **"Sign Up"** or **"Log In"**
   - **Recommended**: Sign in with GitHub (same account as your repo)

### Step 2.2: Import Your GitHub Repository

1. **Add New Project**
   - After logging in, click **"Add New..."** button (top right)
   - Select **"Project"**

2. **Import Repository**
   - You'll see a list of your GitHub repositories
   - Find **`BudgetBox`** (or `Jayasuryanarayana/BudgetBox`)
   - Click **"Import"** next to it

3. **Configure Project**
   - **Project Name**: `BudgetBox` (or leave default)
   - **Framework Preset**: Should auto-detect **Next.js** ✅
   - **Root Directory**: Leave as `./` (default)
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `.next` (should be auto-filled)
   - **Install Command**: `npm install` (should be auto-filled)

   ⚠️ **DON'T CLICK DEPLOY YET!** We need to add environment variables first.

### Step 2.3: Add Environment Variables

1. **Open Environment Variables Section**
   - In the project configuration page, scroll down to **"Environment Variables"**
   - Click to expand it

2. **Add First Variable: Supabase URL**
   - Click **"Add"** or **"Add Another"**
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Paste your Supabase Project URL (from Step 1.2)
     - Example: `https://xxxxxxxxxxxxx.supabase.co`
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Save"**

3. **Add Second Variable: Supabase Anon Key**
   - Click **"Add Another"**
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Paste your Supabase anon key (from Step 1.2)
     - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Save"**

4. **Verify Variables**
   - You should see both variables listed:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2.4: Deploy to Vercel

1. **Start Deployment**
   - Scroll to the bottom of the configuration page
   - Click **"Deploy"** button

2. **Wait for Build**
   - You'll see a build log in real-time
   - This takes about 2-3 minutes
   - Watch for:
     - ✅ Installing dependencies
     - ✅ Building project
     - ✅ Deploying

3. **Deployment Complete!**
   - When done, you'll see: **"Congratulations! Your project has been deployed."**
   - You'll get a URL like: `https://budgetbox-xxxxx.vercel.app`

✅ **Vercel Deployment Complete!**

---

## Part 3: Test Your Deployment

### Step 3.1: Visit Your Live Site

1. **Open Your Vercel URL**
   - Click the link provided by Vercel
   - Or go to your Vercel dashboard → Your project → **"Visit"**

2. **Verify It Loads**
   - The BudgetBox app should load
   - You should see the login page or home page

### Step 3.2: Test Sign Up & Login

1. **Create an Account**
   - Click **"Sign Up"**
   - Enter:
     - Email: `test@example.com`
     - Password: `TestPassword123!`
     - Confirm Password: `TestPassword123!`
   - Click **"Sign Up"**
   - You should be redirected to the home page

2. **Test Logout & Login**
   - Click **"Logout"** in the header
   - Click **"Login"**
   - Enter your credentials
   - You should be logged in

### Step 3.3: Test Budget Data Entry

1. **Enter Budget Data**
   - Enter an **Income** value (e.g., `5000`)
   - Enter some expenses:
     - Bills: `1000`
     - Food: `500`
     - Transport: `200`
   - Press **Enter** or click outside the field
   - You should see a green checkmark (auto-save indicator)

2. **Verify Data Persists**
   - Refresh the page (F5 or Ctrl+R)
   - Your data should still be there (loaded from IndexedDB)

### Step 3.4: Test Sync Functionality

1. **Login** (if not already logged in)
   - Use the account you created

2. **Click "Sync Now"**
   - In the Sync Status card, click **"Sync Now"** button
   - Wait a few seconds
   - Status should change to **"Synced"** ✅

3. **Verify Data in Supabase**
   - Go back to your Supabase dashboard
   - Click **Table Editor** → **budgets**
   - You should see a row with your `user_id` and budget data

### Step 3.5: Test Offline Mode

1. **Open Browser DevTools**
   - Press `F12` or `Ctrl+Shift+I`

2. **Go to Network Tab**
   - Click **Network** tab in DevTools

3. **Enable Offline Mode**
   - Find the throttling dropdown (usually says "No throttling")
   - Select **"Offline"**

4. **Observe Offline Behavior**
   - You should see:
     - Sync Status shows **"Offline"** 🔴
     - A toast notification: "You're currently offline..."

5. **Edit Data While Offline**
   - Change some budget values
   - Data should still save locally (green checkmark appears)

6. **Go Back Online**
   - In Network tab, change back to **"Online"**
   - You should see: "Connection restored. You're back online!"
   - Click **"Sync Now"** to push changes to Supabase

---

## Part 4: Troubleshooting

### Issue: Build Fails on Vercel

**Error**: "Missing environment variables"

**Solution**:
- Go to Vercel → Your Project → Settings → Environment Variables
- Verify both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Make sure they're enabled for **Production**, **Preview**, and **Development**
- Redeploy the project

### Issue: "Cannot connect to Supabase"

**Error**: "Missing Supabase environment variables" or connection errors

**Solution**:
- Double-check your Supabase URL and anon key in Vercel environment variables
- Make sure there are no extra spaces when copying
- Verify your Supabase project is active (not paused)

### Issue: "Row Level Security policy violation"

**Error**: 403 Forbidden when syncing

**Solution**:
- Go to Supabase → SQL Editor
- Run this SQL to temporarily allow all operations (for testing):

```sql
DROP POLICY IF EXISTS "Users can access their own budgets" ON budgets;

CREATE POLICY "Users can access their own budgets"
  ON budgets
  FOR ALL
  USING (true);
```

### Issue: Data Not Syncing

**Check**:
1. Are you logged in? (Check for user email in header)
2. Is the app online? (Check sync status indicator)
3. Check browser console (F12) for errors
4. Check Vercel function logs: Vercel Dashboard → Your Project → Functions

---

## Part 5: Next Steps

### Custom Domain (Optional)

1. Go to Vercel → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Monitor Usage

- **Vercel**: Check deployment logs, function execution times
- **Supabase**: Monitor database usage, API requests, storage

### Update Your README

Add your live URL to your GitHub README:

```markdown
## Live Demo

🌐 **Live Site**: https://your-project.vercel.app
```

---

## Summary Checklist

- [ ] Created Supabase project
- [ ] Copied Supabase URL and anon key
- [ ] Created database table (ran schema.sql)
- [ ] Created Vercel account
- [ ] Imported GitHub repository to Vercel
- [ ] Added environment variables in Vercel
- [ ] Deployed to Vercel
- [ ] Tested sign up/login
- [ ] Tested budget data entry
- [ ] Tested sync functionality
- [ ] Verified data in Supabase
- [ ] Tested offline mode

**Congratulations! Your BudgetBox app is now live! 🎉**

