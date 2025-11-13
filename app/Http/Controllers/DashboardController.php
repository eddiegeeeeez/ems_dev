<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $user = Auth::user();

        // Fallback redirect if somehow $user is null
        if (!$user) {
            return redirect()->route('login');
        }

        $totalBookings = 12;
        $pendingBookings = 3;
        $approvedBookings = 9;

        // Pass $user to the view
        return view('dashboard', compact('user', 'totalBookings', 'pendingBookings', 'approvedBookings'));
    }
}
