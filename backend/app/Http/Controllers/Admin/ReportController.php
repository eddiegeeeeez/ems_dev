<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Venue;
use App\Models\Equipment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{

    /**
     * Get venue utilization data (for charts).
     */
    public function venueUtilizationData(): JsonResponse
    {
        try {
            $venues = Venue::withCount(['bookings as approved_bookings_count' => function ($query) {
                $query->where('status', 'approved');
            }])->get();

            $data = $venues->map(function ($venue) {
                return [
                    'name' => $venue->name,
                    'capacity' => $venue->capacity,
                    'total_bookings' => $venue->bookings()->count(),
                    'bookings' => $venue->approved_bookings_count, // Use approved count for "Active Bookings"
                    'utilization' => $venue->approved_bookings_count, 
                ];
            });

            $labels = $venues->pluck('name')->toArray();
            $chartData = $venues->pluck('approved_bookings_count')->toArray();

            return response()->json([
                'data' => $data,
                'chart' => [
                    'labels' => $labels,
                    'data' => $chartData,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch venue utilization data'], 500);
        }
    }

    /**
     * Get booking statistics data.
     */
    public function bookingStatisticsData(): JsonResponse
    {
        try {
            $stats = [
                'total_bookings' => Booking::count(),
                'pending' => Booking::where('status', 'pending')->count(),
                'approved' => Booking::where('status', 'approved')->count(),
                'rejected' => Booking::where('status', 'rejected')->count(),
                'completed' => Booking::where('status', 'completed')->count(),
                'cancelled' => Booking::where('status', 'cancelled')->count(),
            ];

            $bookings = Booking::whereDate('created_at', '>=', now()->subDays(30))
                ->groupBy('status')
                ->selectRaw('status, count(*) as count')
                ->get();

            $labels = $bookings->pluck('status')->toArray();
            $chartData = $bookings->pluck('count')->toArray();

            return response()->json([
                'stats' => $stats,
                'chart' => [
                    'labels' => $labels,
                    'data' => $chartData,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch booking statistics'], 500);
        }
    }

    /**
     * Export data.
     */
    public function doExport(Request $request): StreamedResponse
    {
        $validated = $request->validate([
            'format' => 'required|in:csv,excel,pdf',
            'type' => 'required|in:bookings,venues,users,equipment',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $query = $this->getQueryForType($validated['type']);

        if ($validated['date_from']) {
            $query->whereDate('created_at', '>=', $validated['date_from']);
        }
        if ($validated['date_to']) {
            $query->whereDate('created_at', '<=', $validated['date_to']);
        }

        $data = $query->get();

        return $this->exportData($data, $validated['type'], $validated['format']);
    }

    /**
     * Get the appropriate query for the export type.
     */
    private function getQueryForType(string $type)
    {
        return match ($type) {
            'bookings' => Booking::with('user', 'venue'),
            'venues' => Venue::with('college'),
            'users' => User::all(),
            'equipment' => Equipment::with('venue'),
            default => Booking::query(),
        };
    }

    /**
     * Export data in the specified format.
     */
    private function exportData($data, string $type, string $format): StreamedResponse
    {
        $fileName = "{$type}-" . now()->format('Y-m-d-His');

        if ($format === 'csv') {
            return $this->exportCsv($data, $type, $fileName);
        } elseif ($format === 'pdf') {
            return $this->exportPdf($data, $type, $fileName);
        }

        // Default to CSV
        return $this->exportCsv($data, $type, $fileName);
    }

    /**
     * Export to CSV format.
     */
    private function exportCsv($data, string $type, string $fileName): StreamedResponse
    {
        return response()->streamDownload(function () use ($data, $type) {
            $output = fopen('php://output', 'w');

            if ($data->isNotEmpty()) {
                fputcsv($output, array_keys($data->first()->toArray()));
                foreach ($data as $row) {
                    fputcsv($output, $row->toArray());
                }
            }

            fclose($output);
        }, "{$fileName}.csv");
    }

    /**
     * Export to PDF format.
     */
    private function exportPdf($data, string $type, string $fileName): StreamedResponse
    {
        // Using basic PDF generation - in production, use a library like dompdf
        return response()->streamDownload(function () use ($data) {
            echo "PDF Export - " . now()->format('Y-m-d H:i:s') . "\n\n";
            foreach ($data as $row) {
                echo json_encode($row->toArray()) . "\n";
            }
        }, "{$fileName}.pdf");
    }
}
