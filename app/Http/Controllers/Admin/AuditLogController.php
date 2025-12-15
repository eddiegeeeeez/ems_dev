<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuditLogController extends Controller
{
    /**
     * Display a listing of audit logs.
     */
    public function index(): JsonResponse
    {
        try {
            $logs = AuditLog::with('user')
                ->latest()
                ->paginate(50);

            return response()->json(['logs' => $logs]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch audit logs'], 500);
        }
    }

    /**
     * Search audit logs.
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = AuditLog::with('user');

            if ($request->has('q')) {
                $searchTerm = $request->query('q');
                $query->where('action', 'like', "%{$searchTerm}%")
                    ->orWhere('model', 'like', "%{$searchTerm}%");
            }

            if ($request->has('action')) {
                $query->where('action', $request->query('action'));
            }

            if ($request->has('user_id')) {
                $query->where('user_id', $request->query('user_id'));
            }

            $logs = $query->latest()->paginate(50);

            return response()->json(['logs' => $logs]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to search audit logs'], 500);
        }
    }
}
