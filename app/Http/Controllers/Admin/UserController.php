<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(): View
    {
        $users = User::with('department')
            ->latest()
            ->paginate(15);

        $stats = [
            'total' => User::count(),
            'admins' => User::where('role', 'ADMIN')->count(),
            'organizers' => User::where('role', 'ORGANIZER')->count(),
        ];

        return view('admin.users.index', compact('users', 'stats'));
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): View
    {
        $user->load('department', 'bookings', 'feedbackGiven');
        $auditLogs = AuditLog::where('user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get();
        return view('admin.users.show', compact('user', 'auditLogs'));
    }

    /**
     * Update user role.
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
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

        return back()->with('success', "User role updated to {$validated['role']} successfully.");
    }

    /**
     * Deactivate a user.
     */
    public function deactivate(User $user): RedirectResponse
    {
        $user->delete();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'deactivate_user',
            'model' => 'User',
            'model_id' => $user->id,
            'new_values' => ['deleted_at' => now()],
        ]);

        return back()->with('success', 'User deactivated successfully.');
    }

    /**
     * Activate a user.
     */
    public function activate(User $user): RedirectResponse
    {
        $user->restore();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'activate_user',
            'model' => 'User',
            'model_id' => $user->id,
            'new_values' => ['restored' => true],
        ]);

        return back()->with('success', 'User activated successfully.');
    }
}
