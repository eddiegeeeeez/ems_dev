<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAuthBlocking
{
    /**
     * Handle an incoming request.
     * This middleware blocks any request from unauthenticated users
     * and returns a 401 Unauthorized response with proper headers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            // Log the unauthorized access attempt
            \Log::warning('Unauthorized API access attempt', [
                'ip' => $request->ip(),
                'path' => $request->path(),
                'method' => $request->method(),
                'user_agent' => $request->userAgent(),
            ]);

            // Return 401 response for API requests
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in to access this resource.',
                'code' => 'UNAUTHENTICATED',
            ], 401);
        }

        // User is authenticated - allow request to proceed
        return $next($request);
    }
}
