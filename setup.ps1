# WebFrame Weaver - Setup Script (Windows)
# Execute este script após clonar o repositório para instalar dependências e iniciar dev

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "WebFrame Weaver - Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Step 1: Check Node.js
Write-Host "`n[1/4] Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "npm: $npmVersion" -ForegroundColor Green

# Step 2: Install dependencies
Write-Host "`n[2/4] Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed successfully!" -ForegroundColor Green

# Step 3: Build (optional)
Write-Host "`n[3/4] Running linter..." -ForegroundColor Yellow
npm run lint 2>&1 | Out-Null  # Suppress lint warnings, only fail on errors
Write-Host "Linter check complete" -ForegroundColor Green

# Step 4: Start dev server
Write-Host "`n[4/4] Starting development server..." -ForegroundColor Yellow
Write-Host "The app will be available at http://localhost:5173" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
npm run dev
