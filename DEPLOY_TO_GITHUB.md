# Deploy Attendance System to GitHub Pages

## Quick Steps to Deploy

### 1. Set up Supabase (Already configured!)
✅ **Your Supabase is already set up with:**
- URL: `https://flsxjijsyvvgbcpodpin.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Next step:** Run the SQL migration in your Supabase dashboard:
1. Go to [supabase.com](https://supabase.com) → Your project
2. Go to SQL Editor
3. Copy and run the SQL from `supabase/migrations/20251004152535_create_attendance_system_schema.sql`

### 2. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Attendance Management System"
```

### 3. Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/attendance-management-system.git
git branch -M main
git push -u origin main
```

### 4. Deploy to GitHub Pages

#### Option A: Automatic Deployment (Recommended)
1. **Add secrets to GitHub repository:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add these secrets:
     - Name: `VITE_SUPABASE_URL`, Value: `https://flsxjijsyvvgbcpodpin.supabase.co`
     - Name: `VITE_SUPABASE_ANON_KEY`, Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsc3hqaWpzeXZ2Z2JjcG9kcGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTI4MjIsImV4cCI6MjA3NTE2ODgyMn0.MU_iSQy4kcN4U69cgYE95EYeMxSOsUFPq_IBadAc1R8`

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: "GitHub Actions"
   - The workflow will automatically deploy on every push to main

#### Option B: Manual Deployment
1. **Run the deployment script:**
   ```bash
   # Windows PowerShell
   .\deploy.ps1 -SupabaseUrl "your_url" -SupabaseKey "your_key"
   
   # Or manually:
   npm run build
   ```

2. **Copy built files to docs folder:**
   ```bash
   mkdir docs
   cp -r dist/* docs/
   git add docs
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

3. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` or `docs`
   - Folder: `/docs`

### 5. Create Demo Users (Optional)
After deployment, visit your GitHub Pages URL and create demo users:
- Admin: admin@example.com / admin123
- User: user@example.com / user123

## Your Site Will Be Available At:
`https://YOUR_USERNAME.github.io/attendance-management-system`

## Troubleshooting
- **Build fails**: Check that environment variables are set correctly
- **Site not loading**: Wait a few minutes for GitHub Pages to update
- **Database errors**: Ensure Supabase URL and key are correct

## Security Note
Never commit real Supabase credentials to the repository. Always use GitHub secrets for production deployments.
