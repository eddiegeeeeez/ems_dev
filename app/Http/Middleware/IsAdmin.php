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
        // Check if user is authenticated and has ADMIN role
        if (Auth::check() && Auth::user()->role === 'ADMIN') {
            return $next($request);
        }

        // Redirect to dashboard if not admin
        abort(403, 'Unauthorized. Admin access required.');
    }
}
