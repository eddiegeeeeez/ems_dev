<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class TwoFactorController extends Controller
{
    public function enable(Request $request)
    {
        $request->validate([
            'pin' => 'required|digits:6|confirmed', // expects pin and pin_confirmation
            'password' => 'required|current_password',
        ]);

        $user = $request->user();

        $user->forceFill([
            'two_factor_pin' => Hash::make($request->pin),
            'two_factor_enabled_at' => now(),
        ])->save();

        return response()->json(['message' => 'Two-factor authentication enabled successfully.']);
    }

    public function disable(Request $request)
    {
        $request->validate([
            'password' => 'required|current_password',
        ]);

        $user = $request->user();

        $user->forceFill([
            'two_factor_pin' => null,
            'two_factor_enabled_at' => null,
        ])->save();

        return response()->json(['message' => 'Two-factor authentication disabled successfully.']);
    }
}
