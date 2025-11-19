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
            $pendingBookings = 15;
            $approvedBookings = 42;
            $totalBookings = 156;
            $totalVenues = 8;

            return view('admin.dashboard', compact(
                'user',
                'pendingBookings',
                'approvedBookings',
                'totalBookings',
                'totalVenues'
            ));
        } else {
            // Organizer-specific metrics
            $totalBookings = 12;
            $pendingBookings = 3;
            $approvedBookings = 9;

            return view('user.dashboard', compact(
                'user',
                'totalBookings',
                'pendingBookings',
                'approvedBookings'
            ));
        }
    }

    /**
     * Display admin dashboard.
     */
    public function admin(): View
    {
        $user = Auth::user();
        $pendingBookings = 15;
        $approvedBookings = 42;
        $totalBookings = 156;
        $totalVenues = 8;

        return view('admin.dashboard', compact(
            'user',
            'pendingBookings',
            'approvedBookings',
            'totalBookings',
            'totalVenues'
        ));
    }
}
