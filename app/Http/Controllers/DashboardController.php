<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    /**
     * Display the main dashboard.
     */
    public function index(): View
    {
        // Here you would fetch data for the dashboard, like counts
        $totalBookings = 2; // Example data
        $pendingBookings = 1;
        $approvedBookings = 1;

        // Pass the data to the view
        return view('dashboard', [
            'totalBookings' => $totalBookings,
            'pendingBookings' => $pendingBookings,
            'approvedBookings' => $approvedBookings
        ]);
    }
}