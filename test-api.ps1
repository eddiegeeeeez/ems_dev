# API Testing Script - Event Management System
# This script provides quick commands to test various API endpoints

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "API Testing Helper Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$apiUrl = "$baseUrl/api"

# Function to display menu
function Show-Menu {
    Write-Host "Choose a test:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Test Backend Health" -ForegroundColor White
    Write-Host "2. Test Database Connection" -ForegroundColor White
    Write-Host "3. Login as Admin (Browser)" -ForegroundColor White
    Write-Host "4. Login as Organizer (Browser)" -ForegroundColor White
    Write-Host "5. View All Routes" -ForegroundColor White
    Write-Host "6. Test Venues Endpoint (requires login)" -ForegroundColor White
    Write-Host "7. Test Dashboard Endpoint (requires login)" -ForegroundColor White
    Write-Host "8. View Database Statistics" -ForegroundColor White
    Write-Host "9. Clear Application Cache" -ForegroundColor White
    Write-Host "0. Exit" -ForegroundColor White
    Write-Host ""
}

# Test functions
function Test-Health {
    Write-Host "Testing backend health..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/up" -Method GET -UseBasicParsing
        Write-Host "✓ Backend is running!" -ForegroundColor Green
        Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Backend not responding" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

function Test-Database {
    Write-Host "Testing database connection..." -ForegroundColor Yellow
    try {
        $output = & php artisan tinker --execute="echo 'Users: ' . App\Models\User::count() . PHP_EOL; echo 'Venues: ' . App\Models\Venue::count() . PHP_EOL; echo 'Bookings: ' . App\Models\Booking::count() . PHP_EOL;"
        Write-Host $output -ForegroundColor Green
        Write-Host "✓ Database connected!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Database connection failed" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

function Login-Admin {
    Write-Host "Opening admin login..." -ForegroundColor Yellow
    Start-Process "$baseUrl/temp-login/admin"
    Write-Host "✓ Browser opened. You should be logged in as admin." -ForegroundColor Green
    Write-Host ""
}

function Login-Organizer {
    Write-Host "Opening organizer login..." -ForegroundColor Yellow
    Start-Process "$baseUrl/temp-login/organizer"
    Write-Host "✓ Browser opened. You should be logged in as organizer." -ForegroundColor Green
    Write-Host ""
}

function View-Routes {
    Write-Host "Fetching all API routes..." -ForegroundColor Yellow
    & php artisan route:list --path=api
    Write-Host ""
}

function Test-Venues {
    Write-Host "Testing venues endpoint..." -ForegroundColor Yellow
    Write-Host "Note: This requires authentication. Login first via browser." -ForegroundColor Gray
    Write-Host ""
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/venues" -Method GET -Headers @{"Accept"="application/json"} -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✓ Response received!" -ForegroundColor Green
        Write-Host "Venues count: $($data.Count)" -ForegroundColor Cyan
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "✗ Authentication required. Please login first." -ForegroundColor Yellow
        } else {
            Write-Host "✗ Request failed" -ForegroundColor Red
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

function Test-Dashboard {
    Write-Host "Testing dashboard endpoint..." -ForegroundColor Yellow
    Write-Host "Note: This requires authentication. Login first via browser." -ForegroundColor Gray
    Write-Host ""
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/dashboard" -Method GET -Headers @{"Accept"="application/json"} -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✓ Response received!" -ForegroundColor Green
        Write-Host $response.Content -ForegroundColor Cyan
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "✗ Authentication required. Please login first." -ForegroundColor Yellow
        } else {
            Write-Host "✗ Request failed" -ForegroundColor Red
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

function View-DatabaseStats {
    Write-Host "Fetching database statistics..." -ForegroundColor Yellow
    Write-Host ""
    
    $stats = @"
    SELECT 
        'Departments' as Table_Name, COUNT(*) as Count FROM departments
    UNION ALL
        SELECT 'Users', COUNT(*) FROM users
    UNION ALL
        SELECT 'Venues', COUNT(*) FROM venues
    UNION ALL
        SELECT 'Equipment', COUNT(*) FROM equipment
    UNION ALL
        SELECT 'Bookings', COUNT(*) FROM bookings
    UNION ALL
        SELECT 'Notifications', COUNT(*) FROM notifications
    UNION ALL
        SELECT 'Maintenance Requests', COUNT(*) FROM maintenance_requests;
"@
    
    try {
        $output = & php artisan tinker --execute="
            echo '╔═══════════════════════════════════╗' . PHP_EOL;
            echo '║   DATABASE STATISTICS             ║' . PHP_EOL;
            echo '╠═══════════════════════════════════╣' . PHP_EOL;
            echo '║ Departments:           ' . str_pad(App\Models\Department::count(), 10, ' ', STR_PAD_LEFT) . ' ║' . PHP_EOL;
            echo '║ Users:                 ' . str_pad(App\Models\User::count(), 10, ' ', STR_PAD_LEFT) . ' ║' . PHP_EOL;
            echo '║ Venues:                ' . str_pad(App\Models\Venue::count(), 10, ' ', STR_PAD_LEFT) . ' ║' . PHP_EOL;
            echo '║ Equipment:             ' . str_pad(App\Models\Equipment::count(), 10, ' ', STR_PAD_LEFT) . ' ║' . PHP_EOL;
            echo '║ Bookings:              ' . str_pad(App\Models\Booking::count(), 10, ' ', STR_PAD_LEFT) . ' ║' . PHP_EOL;
            echo '║ Notifications:         ' . str_pad(DB::table('notifications')->count(), 10, ' ', STR_PAD_LEFT) . ' ║' . PHP_EOL;
            echo '║ Maintenance Requests:  ' . str_pad(App\Models\MaintenanceRequest::count(), 10, ' ', STR_PAD_LEFT) . ' ║' . PHP_EOL;
            echo '╚═══════════════════════════════════╝' . PHP_EOL;
        "
        Write-Host $output -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to fetch statistics" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

function Clear-Cache {
    Write-Host "Clearing application cache..." -ForegroundColor Yellow
    & php artisan cache:clear
    & php artisan config:clear
    & php artisan route:clear
    & php artisan view:clear
    Write-Host "✓ Cache cleared!" -ForegroundColor Green
    Write-Host ""
}

# Main loop
do {
    Show-Menu
    $choice = Read-Host "Enter your choice"
    Write-Host ""
    
    switch ($choice) {
        "1" { Test-Health }
        "2" { Test-Database }
        "3" { Login-Admin }
        "4" { Login-Organizer }
        "5" { View-Routes }
        "6" { Test-Venues }
        "7" { Test-Dashboard }
        "8" { View-DatabaseStats }
        "9" { Clear-Cache }
        "0" { 
            Write-Host "Goodbye!" -ForegroundColor Cyan
            break
        }
        default { 
            Write-Host "Invalid choice. Please try again." -ForegroundColor Red
            Write-Host ""
        }
    }
    
    if ($choice -ne "0") {
        Write-Host "Press any key to continue..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        Clear-Host
    }
} while ($choice -ne "0")
