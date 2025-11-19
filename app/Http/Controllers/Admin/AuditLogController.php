<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * Display a listing of audit logs.
     */
    public function index()
    {
        return view('admin.audit-logs');
    }

    /**
     * Search audit logs.
     */
    public function search(Request $request)
    {
        $query = $request->query('q');
        $action = $request->query('action');
        $user_id = $request->query('user_id');

        $logs = [];

        return response()->json($logs);
    }
}
