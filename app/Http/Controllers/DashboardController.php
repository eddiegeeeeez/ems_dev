<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        // Auth middleware already ensures user is authenticated
        $user = Auth::user();
        $role = $user->role ?? 'ORGANIZER';

        // Different data for different roles
        if ($role === 'ADMIN') {
            // Admin-specific metrics
            $pendingRequests = 15;
            $totalVenues = 8;
            $activeBookings = 42;
            $totalUsers = 156;

            return view('dashboard-admin', compact(
                'user',
                'pendingRequests',
                'totalVenues',
                'activeBookings',
                'totalUsers'
            ));
        } else {
            // Organizer-specific metrics
            $totalBookings = 12;
            $pendingBookings = 3;
            $approvedBookings = 9;

            return view('dashboard-organizer', compact(
                'user',
                'totalBookings',
                'pendingBookings',
                'approvedBookings'
            ));
        }
    }
}
