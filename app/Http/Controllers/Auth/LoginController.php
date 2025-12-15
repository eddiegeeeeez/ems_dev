<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

            // Attempt to authenticate
            if (Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
                $user = Auth::user();
                
                // Create a Sanctum token
                $token = $user->createToken('api-token')->plainTextToken;

                return response()->json([
                    'message' => 'Login successful',
                    'user' => $user,
                    'token' => $token,
                ]);
            }

            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Login failed'], 500);
        }
    }

    /**
     * Get current authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    /**
     * Handle logout.
     */
    public function logout(Request $request): JsonResponse
    {
        if ($request->user()) {
            // Revoke all tokens
            $request->user()->tokens()->delete();
        }

        return response()->json(['message' => 'Logged out successfully']);
    }
}
