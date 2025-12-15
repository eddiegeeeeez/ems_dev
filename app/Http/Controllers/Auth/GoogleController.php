<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Exception;

class GoogleController extends Controller
{
    // Redirect user to Google OAuth page
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->redirect();
    }

    // Handle callback from Google
    public function handleGoogleCallback()
    {
        try {
            Log::info('=== Google OAuth Callback Started ===');
            
            $googleUser = Socialite::driver('google')->user();
            Log::info('Google user retrieved', ['email' => $googleUser->getEmail()]);


            if (!str_ends_with($googleUser->getEmail(), '@umindanao.edu.ph')) {
                Log::warning('Email not allowed', ['email' => $googleUser->getEmail()]);
                return redirect('/')->with('error', 'Only @umindanao.edu.ph accounts allowed.');
            }


            $adminEmails = config('admin_emails.admin_emails', []);
            $userEmail = $googleUser->getEmail();
            $isAdmin = in_array($userEmail, $adminEmails);
            
            // Determine role and department
            $defaultRole = $isAdmin ? 'ADMIN' : 'ORGANIZER';
            $defaultDepartment = $isAdmin ? 'ADMINISTRATION' : 'ORGANISATION ADVISER';

            // Create or update user
            $user = User::updateOrCreate(
                ['email' => $userEmail],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => bcrypt(uniqid())
                ]
            );
            Log::info('User created/updated', ['user_id' => $user->id, 'email' => $user->email, 'is_admin' => $isAdmin]);

            // Assign role and department if not already set, or update if user is now an admin
            if (!$user->role || ($isAdmin && $user->role !== 'ADMIN')) {
                $user->role = $defaultRole;
            }
            if (!$user->department || ($isAdmin && $user->department !== 'ADMINISTRATION')) {
                $user->department = $defaultDepartment;
            }
            $user->save();
            Log::info('User role/department saved', ['role' => $user->role, 'department' => $user->department]);

            // Log the user in
            Auth::login($user, remember: true); // Remember the user for future sessions
            
            Log::info('Auth::login() called', [
                'user_id' => Auth::id(), 
                'auth_check' => Auth::check(),
                'session_id' => Session::getId()
            ]);

            // Verify authentication
            if (!Auth::check()) {
                Log::error('Authentication failed after login attempt', ['user_id' => $user->id]);
                return redirect('/login')->with('error', 'Authentication failed. Please try again.');
            }

            // Regenerate session ID for security (preserves auth state)
            // The 'true' parameter keeps the old session data including authentication
            Session::regenerate(true);
            
            // Verify auth is still valid after regeneration
            if (!Auth::check()) {
                // Re-login if auth was lost during regeneration
                Auth::login($user, remember: true);
                Log::warning('Auth lost after regenerate, re-logged in', ['user_id' => $user->id]);
            }

            // Final verification
            if (!Auth::check()) {
                Log::error('Final auth check failed', ['user_id' => $user->id]);
                return redirect('/login')->with('error', 'Session error. Please try again.');
            }

            Log::info('=== Google OAuth Callback Complete - Redirecting to dashboard ===', [
                'user_id' => Auth::id(),
                'email' => Auth::user()->email,
                'role' => Auth::user()->role,
                'session_id' => Session::getId(),
                'auth_check' => Auth::check()
            ]);
            
            // Direct redirect to dashboard - ensure URL is correct
            $dashboardUrl = route('dashboard');
            Log::info('Dashboard URL', ['url' => $dashboardUrl]);
            
            return redirect($dashboardUrl)->with('success', 'Successfully logged in!');
        } catch (Exception $e) {
            Log::error('Google OAuth Error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect('/')->with('error', 'Google login failed: ' . $e->getMessage());
        }
    }
}
