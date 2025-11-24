<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Venue;
use App\Models\Feedback;
use App\Services\BookingService;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    /**
     * User dashboard
     */
    public function index(): View
    {
        $user = Auth::user();
        $upcomingBookings = $this->bookingService->getUpcomingBookings(5);
        $bookingStats = [
            'total' => Booking::where('user_id', $user->id)->count(),
            'approved' => Booking::where('user_id', $user->id)->where('status', 'approved')->count(),
            'pending' => Booking::where('user_id', $user->id)->where('status', 'pending')->count(),
        ];

        $recentFeedback = Feedback::where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        return view('user.dashboard', compact('upcomingBookings', 'bookingStats', 'recentFeedback', 'user'));
    }

    /**
     * Admin dashboard
     */
    public function admin(): View
    {
        $pendingBookings = Booking::where('status', 'pending')->count();
        $approvedBookings = Booking::where('status', 'approved')->count();
        $totalVenues = Venue::where('is_active', true)->count();
        $totalBookings = Booking::count();

        $recentRequests = Booking::where('status', 'pending')
            ->with('user', 'venue')
            ->latest()
            ->limit(10)
            ->get();

        $user = Auth::user();

        return view('admin.dashboard', compact(
            'user',
            'pendingBookings',
            'approvedBookings',
            'totalVenues',
            'totalBookings',
            'recentRequests'
        ));
    }
}
