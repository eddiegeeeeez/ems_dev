<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Display the user's profile - Returns JSON
     */
    public function show(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => (string) $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'role' => $user->role === 'ADMIN' ? 'admin' : 'organizer',
                    'avatar' => $user->avatar,
                    'department' => $user->department,
                    'college' => $user->college ?? null,
                    'position' => $user->position ?? ($user->role === 'ADMIN' ? 'Administrator' : 'Event Organizer'),
                    'bio' => $user->bio ?? '',
                    'isOnboarded' => true,
                ],
                'settings' => $user->settings ?? []
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user profile - Returns JSON
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'department' => 'sometimes|string|max:255',
                'college' => 'sometimes|string|max:255',
                'position' => 'sometimes|string|max:255',
                'bio' => 'nullable|string|max:1000',
            ]);

            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user settings
     */
    public function updateSettings(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            $validated = $request->validate([
                'accountVisibility' => 'sometimes|boolean',
                'emailNotifications' => 'sometimes|boolean',
                'pushNotifications' => 'sometimes|boolean',
                'marketingEmails' => 'sometimes|boolean',
                'weeklySummary' => 'sometimes|boolean',
                'loginNotifications' => 'sometimes|boolean',
            ]);

            // Store settings in user's settings column
            $settings = $user->settings ?? [];
            
            foreach ($validated as $key => $value) {
                $settings[$key] = $value;
            }

            $user->settings = $settings;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully',
                'settings' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export user data
     */
    public function export(): JsonResponse
    {
        try {
            $user = Auth::user();

            // Get all user data including relationships
            $userData = [
                'profile' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'department' => $user->department,
                    'college' => $user->college,
                    'position' => $user->position,
                    'bio' => $user->bio,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                ],
                'bookings' => $user->bookings()->get()->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'event_title' => $booking->event_title,
                        'venue' => $booking->venue->name ?? null,
                        'start_date' => $booking->start_date,
                        'end_date' => $booking->end_date,
                        'start_time' => $booking->start_time,
                        'end_time' => $booking->end_time,
                        'status' => $booking->status,
                        'created_at' => $booking->created_at,
                    ];
                }),
                'notifications' => $user->notifications()->get()->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'type' => $notification->type,
                        'message' => $notification->message,
                        'is_read' => $notification->is_read,
                        'created_at' => $notification->created_at,
                    ];
                }),
                'settings' => $user->settings ?? [],
                'export_date' => now()->toDateTimeString(),
            ];

            $filename = 'profile-data-' . now()->format('Y-m-d') . '.json';
            
            return response()->json($userData)
                ->header('Content-Type', 'application/json')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user account
     */
    public function delete(): JsonResponse
    {
        try {
            $user = Auth::user();

            // Delete related data (soft delete if using soft deletes)
            $user->bookings()->delete();
            $user->notifications()->delete();
            
            // Delete the user
            $user->delete();

            // Logout
            Auth::guard('web')->logout();

            return response()->json([
                'success' => true,
                'message' => 'Account deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete account',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Log the user out of the application - Returns JSON
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            Auth::guard('web')->logout();
            
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to logout'
            ], 500);
        }
    }
}