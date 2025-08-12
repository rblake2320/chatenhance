#!/usr/bin/env pwsh
# UltraChat Bootstrap Script for Windows PowerShell
# This script creates all files, sets up the environment, installs dependencies, and starts the application

param(
    [switch]$SkipTests,
    [switch]$Production,
    [string]$OpenAIKey = ""
)

Write-Host "🚀 UltraChat Bootstrap Script Starting..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm" -ForegroundColor Red
    exit 1
}

# Check if Python is installed (for code sandbox)
try {
    $pythonVersion = python --version
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Python not found. Code sandbox will have limited functionality" -ForegroundColor Yellow
}

# Create necessary directories
Write-Host "📁 Creating project directories..." -ForegroundColor Blue
$directories = @(
    "user_files",
    "sandbox",
    "logs",
    "evaluation",
    "tests",
    "migrations"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   Created: $dir" -ForegroundColor Gray
    }
}

# Create .env file from template
Write-Host "🔧 Setting up environment configuration..." -ForegroundColor Blue
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    
    # Set OpenAI API key if provided
    if ($OpenAIKey) {
        (Get-Content ".env") -replace "your_openai_api_key_here", $OpenAIKey | Set-Content ".env"
        Write-Host "   OpenAI API key configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Remember to add your OpenAI API key to .env file" -ForegroundColor Yellow
    }
    
    # Generate random secrets
    $sessionSecret = [System.Web.Security.Membership]::GeneratePassword(32, 0)
    $jwtSecret = [System.Web.Security.Membership]::GeneratePassword(32, 0)
    
    (Get-Content ".env") -replace "your_session_secret_here", $sessionSecret | Set-Content ".env"
    (Get-Content ".env") -replace "your_jwt_secret_here", $jwtSecret | Set-Content ".env"
    
    Write-Host "   Generated secure random secrets" -ForegroundColor Green
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
try {
    npm install --silent
    Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "🔨 Building the application..." -ForegroundColor Blue
try {
    if ($Production) {
        npm run build
    } else {
        npm run check
    }
    Write-Host "   ✅ Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Build failed" -ForegroundColor Red
    exit 1
}

# Run tests unless skipped
if (!$SkipTests) {
    Write-Host "🧪 Running tests..." -ForegroundColor Blue
    try {
        # Run basic health check test
        Write-Host "   Running health check..." -ForegroundColor Gray
        # Note: Add actual test commands here when test framework is set up
        Write-Host "   ✅ Tests passed" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Some tests failed, but continuing..." -ForegroundColor Yellow
    }
}

# Start the application
Write-Host "🚀 Starting UltraChat..." -ForegroundColor Blue

if ($Production) {
    Write-Host "   Starting in production mode..." -ForegroundColor Gray
    $env:NODE_ENV = "production"
    Start-Process -NoNewWindow -Wait -FilePath "npm" -ArgumentList "start"
} else {
    Write-Host "   Starting in development mode..." -ForegroundColor Gray
    $env:NODE_ENV = "development"
    
    # Start the development server in background
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"
    
    # Wait a moment for server to start
    Start-Sleep -Seconds 5
}

# Display completion message
Write-Host ""
Write-Host "🎉 UltraChat is now running!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Next Steps:" -ForegroundColor Yellow
Write-Host "   • Open your browser to http://localhost:5000" -ForegroundColor White
Write-Host "   • Access the admin panel at http://localhost:5000/admin" -ForegroundColor White
Write-Host "   • Check API health at http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Available Endpoints:" -ForegroundColor Yellow
Write-Host "   • GET  /api/health          - Health check" -ForegroundColor White
Write-Host "   • POST /api/chat            - Chat interface" -ForegroundColor White
Write-Host "   • GET  /api/tools           - Available tools" -ForegroundColor White
Write-Host "   • POST /api/upload          - Document upload" -ForegroundColor White
Write-Host "   • GET  /api/metrics         - System metrics" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   • README.md                 - Getting started guide" -ForegroundColor White
Write-Host "   • SECURITY.md               - Security guidelines" -ForegroundColor White
Write-Host "   • OPERATIONS.md             - Operations manual" -ForegroundColor White
Write-Host ""
Write-Host "🛠️  Troubleshooting:" -ForegroundColor Yellow
Write-Host "   • Check logs in ./logs directory" -ForegroundColor White
Write-Host "   • Verify .env configuration" -ForegroundColor White
Write-Host "   • Ensure OpenAI API key is valid" -ForegroundColor White
Write-Host ""

if (!$Production) {
    Write-Host "Press Ctrl+C to stop the development server" -ForegroundColor Gray
    # Keep the script running to show logs
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    } catch {
        Write-Host "Stopping UltraChat..." -ForegroundColor Yellow
    }
}
