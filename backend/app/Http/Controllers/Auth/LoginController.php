<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuditService;
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
            \Log::info('[Auth Controller] Login attempt from: ' . $request->ip());
            
            // Build password validation rules based on environment
            $passwordRules = ['required', 'string'];
            $passwordMessages = [];
            
            if (app()->environment('production')) {
                // Strict validation for production
                $passwordRules[] = 'min:12';
                $passwordRules[] = 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/';
                $passwordMessages['password.min'] = 'Password must be at least 12 characters long.';
                $passwordMessages['password.regex'] = 'Password must contain uppercase, lowercase, numbers, and special characters.';
            } else {
                // Allow simpler passwords for development/testing
                $passwordRules[] = 'min:6';
                $passwordMessages['password.min'] = 'Password must be at least 6 characters long.';
            }
            
            $validated = $request->validate([
                'email' => ['required','email','regex:/^[^@\s]+@umindanao\.edu\.ph$/i'],
                'password' => $passwordRules,
            ], $passwordMessages);

            \Log::info('[Auth Controller] Attempting to authenticate: ' . $validated['email']);

            // Attempt to authenticate with session (not tokens)
            if (Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']], true)) {
                // Regenerate session to prevent session fixation attacks
                $request->session()->regenerate();
                
                $user = Auth::user();
                
                \Log::info('[Auth Controller] Login successful for user: ' . $user->email);
                
                // Log audit entry
                AuditService::logLogin($user->id, $user->email);

                return response()->json([
                    'message' => 'Login successful',
                    'user' => $user,
                ]);
            }

            \Log::warning('[Auth Controller] Login failed for: ' . $validated['email']);
            
            // Log failed login attempt for security monitoring
            AuditService::logFailedLogin($validated['email']);
            
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('[Auth Controller] Validation error: ' . json_encode($e->errors()));
            
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('[Auth Controller] Login error: ' . $e->getMessage(), [
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
                \Log::info('[Auth Controller] User check - not authenticated');
                return response()->json([
                    'message' => 'Unauthenticated',
                ], 401);
            }

            \Log::info('[Auth Controller] User check - authenticated as: ' . $user->email);
            return response()->json($user);
        } catch (\Exception $e) {
            \Log::error('[Auth Controller] User check error: ' . $e->getMessage());
            return response()->json([
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
            $user = Auth::user();
            if ($user) {
                \Log::info('[Auth Controller] Logging out user: ' . $user->email);
                // Log audit entry
                AuditService::logLogout($user->id, $user->email);
            }
            
            if (Auth::check()) {
                Auth::guard('web')->logout();
                \Log::info('[Auth Controller] User logged out from web guard');
            }
            
            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                \Log::info('[Auth Controller] Session invalidated and token regenerated');
            }

            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            \Log::error('[Auth Controller] Logout error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Logout completed',
            ], 200);
        }
    }
}
