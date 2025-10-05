# Windows PowerShell script for deploying to GitHub Pages
param(
    [string]$SupabaseUrl = "https://flsxjijsyvvgbcpodpin.supabase.co",
    [string]$SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsc3hqaWpzeXZ2Z2JjcG9kcGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTI4MjIsImV4cCI6MjA3NTE2ODgyMn0.MU_iSQy4kcN4U69cgYE95EYeMxSOsUFPq_IBadAc1R8"
)

Write-Host "🚀 Deploying to GitHub Pages..." -ForegroundColor Green
Write-Host "📊 Using Supabase: $SupabaseUrl" -ForegroundColor Cyan

# Set environment variables
$env:VITE_SUPABASE_URL = $SupabaseUrl
$env:VITE_SUPABASE_ANON_KEY = $SupabaseKey

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Create docs directory and copy files
Write-Host "📁 Copying files to docs directory..." -ForegroundColor Yellow
if (Test-Path "docs") {
    Remove-Item "docs" -Recurse -Force
}
New-Item -ItemType Directory -Path "docs" | Out-Null
Copy-Item -Path "dist\*" -Destination "docs\" -Recurse -Force

# Add .nojekyll file to disable Jekyll processing
Write-Host "🚫 Adding .nojekyll file to disable Jekyll..." -ForegroundColor Yellow
"# This file tells GitHub Pages to skip Jekyll processing" | Out-File -FilePath "docs\.nojekyll" -Encoding UTF8

# Add _config.yml to further disable Jekyll
Write-Host "⚙️ Adding _config.yml to disable Jekyll..." -ForegroundColor Yellow
"plugins: []" | Out-File -FilePath "docs\_config.yml" -Encoding UTF8

Write-Host "✅ Files ready for GitHub Pages deployment!" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Add docs/ to git: git add docs" -ForegroundColor White
Write-Host "2. Commit: git commit -m 'Deploy to GitHub Pages'" -ForegroundColor White
Write-Host "3. Push to docs branch or enable GitHub Pages in repo settings" -ForegroundColor White
Write-Host ""
Write-Host "🏗️ GitHub Pages Setup:" -ForegroundColor Cyan
Write-Host "Go to GitHub repo → Settings → Pages → Source: 'Deploy from a branch'" -ForegroundColor White
Write-Host "Branch: 'docs' → Folder: '/ (root)'" -ForegroundColor White
