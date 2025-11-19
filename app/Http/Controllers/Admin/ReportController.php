<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display venue utilization report.
     */
    public function venueUtilization()
    {
        return view('admin.reports.venue-utlization');
    }

    /**
     * Get venue utilization data (for charts).
     */
    public function venueUtilizationData()
    {
        return response()->json([
            'labels' => [],
            'data' => [],
        ]);
    }

    /**
     * Display booking statistics report.
     */
    public function bookingStatistics()
    {
        return view('admin.reports.event-reports');
    }

    /**
     * Get booking statistics data.
     */
    public function bookingStatisticsData()
    {
        return response()->json([
            'labels' => [],
            'data' => [],
        ]);
    }

    /**
     * Display export page.
     */
    public function export()
    {
        return view('admin.reports.export');
    }

    /**
     * Export data.
     */
    public function doExport(Request $request)
    {
        $validated = $request->validate([
            'format' => 'required|in:csv,excel,pdf',
            'type' => 'required|in:bookings,venues,users,equipment',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        return response()->json(['message' => 'Export in progress']);
    }
}
