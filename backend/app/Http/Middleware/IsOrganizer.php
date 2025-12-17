<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsOrganizer
{
    /**
     * Handle an incoming request.
     * This middleware checks if the authenticated user has ORGANIZER role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            \Log::warning('Unauthorized organizer access attempt', [
                'ip' => $request->ip(),
                'path' => $request->path(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in.',
                'code' => 'UNAUTHENTICATED',
            ], 401);
        }

        // Check if user has ORGANIZER role
        if (Auth::user()->role !== 'ORGANIZER') {
            \Log::warning('Unauthorized role access attempt', [
                'ip' => $request->ip(),
                'user_id' => Auth::id(),
                'user_role' => Auth::user()->role,
                'path' => $request->path(),
                'required_role' => 'ORGANIZER',
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Forbidden. Organizer access required.',
                'code' => 'FORBIDDEN',
            ], 403);
        }

        return $next($request);
    }
}
