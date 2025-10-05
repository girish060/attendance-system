@echo off
echo 🚀 Deploying to GitHub Pages...

REM Set environment variables
set VITE_SUPABASE_URL=https://flsxjijsyvvgbcpodpin.supabase.co
set VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsc3hqaWpzeXZ2Z2JjcG9kcGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTI4MjIsImV4cCI6MjA3NTE2ODgyMn0.MU_iSQy4kcN4U69cgYE95EYeMxSOsUFPq_IBadAc1R8

echo 📦 Building project...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo 📁 Copying files to docs directory...
if exist docs rmdir /s /q docs
mkdir docs
xcopy /E /I dist\* docs\

echo 🚫 Adding .nojekyll file to disable Jekyll...
echo # This file tells GitHub Pages to skip Jekyll processing > docs\.nojekyll

echo ⚙️ Adding _config.yml to disable Jekyll...
echo plugins: [] > docs\_config.yml

echo ✅ Files ready for GitHub Pages deployment!
echo 📝 Next steps:
echo 1. Add docs/ to git: git add docs
echo 2. Commit: git commit -m "Deploy to GitHub Pages"
echo 3. Push: git push
echo.
echo 🏗️ GitHub Pages Setup:
echo Go to GitHub repo → Settings → Pages → Source: "Deploy from a branch"
echo Branch: "main" → Folder: "/docs"
echo.
pause