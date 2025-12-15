<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Handle login request with email and password.
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'email' => ['required','email','regex:/^[^@\s]+@umindanao\.edu\.ph$/i'],
                'password' => 'required|string|min:6',
            ]);

            // Attempt to authenticate with session (not tokens)
            if (Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']], true)) {
                // Regenerate session to prevent session fixation attacks
                $request->session()->regenerate();
                
                $user = Auth::user();

                return response()->json([
                    'message' => 'Login successful',
                    'user' => $user,
                ]);
            }

            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get current authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Unauthenticated',
                ], 401);
        } catch (\Exception $e) {
            Log::error('User check error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error checking authentication',
            ], 500);
        }   return response()->json([
                'message' => 'Error checking authentication',
            ], 500);
        }
    }

    /**
     * Handle logout.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            if (Auth::check()) {
                Auth::guard('web')->logout();
            }
            
            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Logout completed',
            ], 200);
        }
    }
}
