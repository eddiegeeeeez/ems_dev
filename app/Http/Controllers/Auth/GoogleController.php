<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Exception;

class GoogleController extends Controller
{
    // Redirect user to Google OAuth page
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->with(['hd' => 'umindanao.edu.ph']) // Hint to Google login form
            ->redirect();
    }

    // Handle callback from Google
    public function handleGoogleCallback()
    {
        try {
            // Use stateless() for testing or API environments
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Enforce @umindanao.edu.ph emails
            if (!str_ends_with($googleUser->getEmail(), '@umindanao.edu.ph')) {
                return redirect('/')
                    ->with('error', 'Only @umindanao.edu.ph accounts are allowed.');
            }

            // Create or find the user
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'password' => bcrypt(uniqid()), // random password for OAuth users
                ]
            );

            // Log in the user
            Auth::login($user);

            return redirect('/dashboard'); // Your dashboard route
        } catch (Exception $e) {
            return redirect('/')
                ->with('error', 'Google login failed: ' . $e->getMessage());
        }
    }
}
