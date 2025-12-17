<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
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
        $user = Auth::user();

        // Check if user is authenticated and has ADMIN role
        if (!$user) {
            \Log::warning('[AdminMiddleware] Unauthorized access attempt - not authenticated');
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        if ($user->role !== 'ADMIN') {
            \Log::warning('[AdminMiddleware] Unauthorized access attempt - user role: ' . $user->role, [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'route' => $request->path(),
            ]);
            return response()->json([
                'message' => 'Forbidden - Admin role required',
            ], 403);
        }

        \Log::info('[AdminMiddleware] Admin access granted to: ' . $user->email, [
            'route' => $request->path(),
        ]);

        return $next($request);
    }
}
