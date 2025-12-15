<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Venue;
use App\Models\Feedback;
use App\Services\BookingService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    /**
     * User dashboard - Returns JSON data
     */
    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();
            $upcomingBookings = $this->bookingService->getUpcomingBookings(5);
            
            $bookingStats = [
                'total' => Booking::where('user_id', $user->id)->count(),
                'approved' => Booking::where('user_id', $user->id)->where('status', 'approved')->count(),
                'pending' => Booking::where('user_id', $user->id)->where('status', 'pending')->count(),
                'rejected' => Booking::where('user_id', $user->id)->where('status', 'rejected')->count(),
                'cancelled' => Booking::where('user_id', $user->id)->where('status', 'cancelled')->count(),
            ];

            $recentFeedback = Feedback::where('user_id', $user->id)
                ->latest()
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'upcomingBookings' => $upcomingBookings,
                    'bookingStats' => $bookingStats,
                    'recentFeedback' => $recentFeedback,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin dashboard - Returns JSON data
     */
    public function admin(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $stats = [
                'pendingBookings' => Booking::where('status', 'pending')->count(),
                'approvedBookings' => Booking::where('status', 'approved')->count(),
                'rejectedBookings' => Booking::where('status', 'rejected')->count(),
                'totalVenues' => Venue::count(),
                'activeVenues' => Venue::where('is_active', true)->count(),
                'maintenanceVenues' => Venue::where('is_active', false)->count(),
                'totalBookings' => Booking::count(),
            ];

            $recentRequests = Booking::where('status', 'pending')
                ->with(['user', 'venue', 'bookingEquipment.equipment'])
                ->latest()
                ->limit(10)
                ->get();

            // Calculate venue utilization for last 30 days
            $thirtyDaysAgo = now()->subDays(30);
            $recentBookings = Booking::where('created_at', '>=', $thirtyDaysAgo)
                ->where('status', '!=', 'cancelled')
                ->count();
            
            $totalSlots = Venue::count() * 30 * 3; // venues * days * average slots per day
            $utilizationPercent = $totalSlots > 0 ? round(($recentBookings / $totalSlots) * 100) : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'stats' => $stats,
                    'recentRequests' => $recentRequests,
                    'utilizationPercent' => $utilizationPercent,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch admin dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
