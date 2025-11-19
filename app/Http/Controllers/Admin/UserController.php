<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        return view('admin.users');
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        return response()->json([]);
    }

    /**
     * Update user role.
     */
    public function updateRole(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:ADMIN,ORGANIZER,USER',
        ]);

        return back()->with('success', 'User role updated successfully.');
    }

    /**
     * Deactivate a user.
     */
    public function deactivate($id)
    {
        return back()->with('success', 'User deactivated successfully.');
    }

    /**
     * Activate a user.
     */
    public function activate($id)
    {
        return back()->with('success', 'User activated successfully.');
    }
}
