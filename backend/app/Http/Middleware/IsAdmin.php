<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            \Log::warning('[IsAdmin Middleware] Unauthenticated access attempt');
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        // Check if user has ADMIN role
        $user = Auth::user();
        if ($user->role !== 'ADMIN') {
            \Log::warning('[IsAdmin Middleware] Unauthorized access - user role: ' . $user->role, [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'route' => $request->path(),
            ]);
            return response()->json([
                'message' => 'Forbidden - Admin role required',
            ], 403);
        }

        \Log::info('[IsAdmin Middleware] Admin access granted', [
            'user_email' => $user->email,
            'route' => $request->path(),
        ]);

        return $next($request);
    }
}
