<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(): JsonResponse
    {
        try {
            $users = User::query()
                ->latest()
                ->get();

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
            $user->load('bookings', 'feedbackGiven');
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
            // Security: Prevent self-role modification
            if ($user->id === Auth::id()) {
                AuditService::logAuthorizationFailure('update_role', 'User', $user->id);
                return response()->json([
                    'error' => 'You cannot modify your own role'
                ], 403);
            }

            // Security: Only admin can change roles
            if (!Auth::user()->isAdmin()) {
                AuditService::logAuthorizationFailure('update_role', 'User', $user->id);
                return response()->json([
                    'error' => 'Unauthorized to modify user roles'
                ], 403);
            }

            $validated = $request->validate([
                'role' => 'required|in:ADMIN,ORGANIZER,USER',
            ]);

            // Prevent removing last admin
            if ($user->role === 'ADMIN' && $validated['role'] !== 'ADMIN') {
                $adminCount = User::where('role', 'ADMIN')->count();
                if ($adminCount <= 1) {
                    return response()->json([
                        'error' => 'Cannot remove the last admin account'
                    ], 403);
                }
            }

            $oldRole = $user->role;
            $user->update(['role' => $validated['role']]);

            // Use AuditService to log the action
            AuditService::logUserRoleChange($user->id, $oldRole, $validated['role']);

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
            // Security: Prevent self-deactivation
            if ($user->id === Auth::id()) {
                return response()->json([
                    'error' => 'You cannot deactivate your own account'
                ], 403);
            }

            // Security: Prevent deactivating the last admin
            if ($user->role === 'ADMIN') {
                $adminCount = User::where('role', 'ADMIN')->count();
                if ($adminCount <= 1) {
                    return response()->json([
                        'error' => 'Cannot deactivate the last admin account'
                    ], 403);
                }
            }

            $user->delete();

            // Use AuditService to log the action
            AuditService::logUserDeletion($user->id, $user->name ?? $user->email);

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

            // Use AuditService to log the action
            AuditService::logUserRestoration($user->id, $user->name ?? $user->email);

            return response()->json(['message' => 'User activated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to activate user'], 500);
        }
    }
}
