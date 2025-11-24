<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(): JsonResponse
    {
        try {
            $users = User::with('department')
                ->latest()
                ->paginate(15);

            $stats = [
                'total' => User::count(),
                'admins' => User::where('role', 'ADMIN')->count(),
                'organizers' => User::where('role', 'ORGANIZER')->count(),
            ];

            return response()->json([
                'users' => $users,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch users'], 500);
        }
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): JsonResponse
    {
        try {
            $user->load('department', 'bookings', 'feedbackGiven');
            $auditLogs = AuditLog::where('user_id', $user->id)
                ->latest()
                ->limit(10)
                ->get();
            return response()->json([
                'user' => $user,
                'auditLogs' => $auditLogs
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch user details'], 500);
        }
    }

    /**
     * Update user role.
     */
    public function updateRole(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'role' => 'required|in:ADMIN,ORGANIZER,USER',
            ]);

            $oldRole = $user->role;
            $user->update(['role' => $validated['role']]);

            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'update_user_role',
                'model' => 'User',
                'model_id' => $user->id,
                'old_values' => ['role' => $oldRole],
                'new_values' => ['role' => $validated['role']],
            ]);

            return response()->json([
                'message' => "User role updated to {$validated['role']} successfully",
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update user role'], 500);
        }
    }

    /**
     * Deactivate a user.
     */
    public function deactivate(User $user): JsonResponse
    {
        try {
            $user->delete();

            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'deactivate_user',
                'model' => 'User',
                'model_id' => $user->id,
                'new_values' => ['deleted_at' => now()],
            ]);

            return response()->json(['message' => 'User deactivated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to deactivate user'], 500);
        }
    }

    /**
     * Activate a user.
     */
    public function activate(User $user): JsonResponse
    {
        try {
            $user->restore();

            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'activate_user',
                'model' => 'User',
                'model_id' => $user->id,
                'new_values' => ['restored' => true],
            ]);

            return response()->json(['message' => 'User activated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to activate user'], 500);
        }
    }
}
