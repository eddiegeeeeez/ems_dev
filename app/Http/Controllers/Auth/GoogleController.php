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
            ->with(['hd' => 'umindanao.edu.ph']) // restrict login to UM domain
            ->redirect();
    }

    // Handle callback from Google
    public function handleGoogleCallback()
    {
        try {
            Log::info('=== Google OAuth Callback Started ===');
            
            $googleUser = Socialite::driver('google')->stateless()->user();
            Log::info('Google user retrieved', ['email' => $googleUser->getEmail()]);

            // Only allow @umindanao.edu.ph emails
            if (!str_ends_with($googleUser->getEmail(), '@umindanao.edu.ph')) {
                Log::warning('Email not allowed', ['email' => $googleUser->getEmail()]);
                return redirect('/')->with('error', 'Only @umindanao.edu.ph accounts allowed.');
            }

            // Create or update user
            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => bcrypt(uniqid())
                ]
            );
            Log::info('User created/updated', ['user_id' => $user->id, 'email' => $user->email]);

            // If role/department is null, assign default for new users
            if (!$user->role) {
                $user->role = 'USER';
            }
            if (!$user->department) {
                $user->department = 'ORGANISATION ADVISER';
            }
            $user->save();
            Log::info('User role/department saved', ['role' => $user->role, 'department' => $user->department]);

            // Store user in session
            Session::put('auth.user', $user->id);
            Log::info('Stored user ID in session', ['user_id' => $user->id]);

            Auth::login($user, remember: true); // Remember the user for future sessions
            Log::info('Auth::login() called', ['user_id' => Auth::id(), 'auth_check' => Auth::check()]);

            Log::info('=== Google OAuth Callback Complete - Redirecting to dashboard ===');
            return redirect()->route('dashboard');
        } catch (Exception $e) {
            Log::error('Google OAuth Error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect('/')->with('error', 'Google login failed: ' . $e->getMessage());
        }
    }
}
