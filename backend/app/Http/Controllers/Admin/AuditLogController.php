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
                ->limit(500) // Safety limit
                ->get();

            // Transform the response to match frontend expectations
            $transformed = $logs->map(function ($log) {
                return [
                    'id' => $log->id,
                    'userId' => $log->user_id,
                    'userName' => $log->user?->name ?? 'System',
                    'action' => $log->action,
                    'target' => $log->model_type,
                    'details' => $log->description ?? $log->action,
                    'timestamp' => $log->created_at,
                    'ipAddress' => $log->ip_address,
                ];
            });

            return response()->json([
                'logs' => $transformed
            ]);
        } catch (\Exception $e) {
            \Log::error('Audit logs error: ' . $e->getMessage());
            return response()->json(['logs' => []]);
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
