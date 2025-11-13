<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        // This optional parameter helps prefill the @umindanao.edu.ph domain
        return Socialite::driver('google')
            ->with(['hd' => 'umindanao.edu.ph'])
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->user();

        // Strictly allow only @umindanao.edu.ph emails
        if (!str_ends_with($googleUser->getEmail(), '@umindanao.edu.ph')) {
            return redirect('/')->with('error', 'Only @umindanao.edu.ph accounts are allowed.');
        }

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
            ]
        );

        Auth::login($user);
        return redirect()->intended('/dashboard');
    }
}
