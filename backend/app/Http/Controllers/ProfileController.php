<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
                    'department' => $user->department, // Fixed: attribute, not relationship
                    'college' => $user->college, // Fixed: attribute, not relationship
                    'position' => $user->role === 'ADMIN' ? 'Administrator' : 'Event Organizer',
                    'isOnboarded' => true,
                ]
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
            
            // Log incoming request data
            Log::info('Profile Update Request', $request->all());

            $validated = $request->validate([
                'name' => 'string|max:255',
                'department' => 'nullable|string|max:255', // Changed to nullable
                'college' => 'nullable|string|max:255', // Changed to nullable
                'position' => 'nullable|string|max:255', // Changed to nullable
            ]);

            $oldValues = $user->only(array_keys($validated));
            $user->update($validated);
            
            // Log the profile update
            \App\Services\AuditService::logUserProfileUpdate(
                $user->id,
                $user->name,
                $oldValues,
                $validated
            );

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Re-throw validation exceptions to let Laravel handle them (422 response)
            throw $e;
        } catch (\Exception $e) {
            Log::error('Profile Update Failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage() // This helps debug
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