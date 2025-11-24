# Event Management System - Quick Start Script
# Run this script to start both backend and frontend servers

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Event Management System - Quick Start" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Set paths
$rootPath = "c:\Users\Acer NITRO 5 -__-\Downloads\it9 ni edgardough\ems_dev"
$frontendPath = "$rootPath\frontend"

# Function to start backend
function Start-Backend {
    Write-Host "[1/2] Starting Laravel Backend..." -ForegroundColor Yellow
    Write-Host "      URL: http://localhost:8000" -ForegroundColor Gray
    Write-Host ""
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath'; php artisan serve --port=8000"
    Start-Sleep -Seconds 3
}

# Function to start frontend
function Start-Frontend {
    Write-Host "[2/2] Starting Next.js Frontend..." -ForegroundColor Yellow
    Write-Host "      URL: http://localhost:3000" -ForegroundColor Gray
    Write-Host ""
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"
    Start-Sleep -Seconds 5
}

# Function to check if servers are running
function Test-Servers {
    Write-Host "Checking server status..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        $backend = Invoke-WebRequest -Uri "http://localhost:8000/up" -Method GET -UseBasicParsing -TimeoutSec 5
        Write-Host "✓ Backend: Running" -ForegroundColor Green
    } catch {
        Write-Host "✗ Backend: Not responding" -ForegroundColor Red
    }
    
    try {
        $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -UseBasicParsing -TimeoutSec 5
        Write-Host "✓ Frontend: Running" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Frontend: Not responding (may still be starting...)" -ForegroundColor Yellow
    }
}

# Main execution
Write-Host "This script will start:" -ForegroundColor White
Write-Host "  1. Laravel Backend  (http://localhost:8000)" -ForegroundColor White
Write-Host "  2. Next.js Frontend (http://localhost:3000)" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue or Ctrl+C to cancel..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""

# Start servers
Start-Backend
Start-Frontend

# Wait for servers to initialize
Write-Host "Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Test servers
Write-Host ""
Test-Servers

# Display information
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Servers Started Successfully!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the application:" -ForegroundColor White
Write-Host "  • Frontend:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "  • Backend API:  http://localhost:8000/api" -ForegroundColor Cyan
Write-Host "  • Health Check: http://localhost:8000/up" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Accounts:" -ForegroundColor White
Write-Host "  • Admin:     admin@ems.edu / password" -ForegroundColor Yellow
Write-Host "  • Organizer: sarah.j@ems.edu / password" -ForegroundColor Yellow
Write-Host ""
Write-Host "Quick Login (Development):" -ForegroundColor White
Write-Host "  • Admin:     http://localhost:8000/temp-login/admin" -ForegroundColor Magenta
Write-Host "  • Organizer: http://localhost:8000/temp-login/organizer" -ForegroundColor Magenta
Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
