<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceHttps
{
    /**
     * Handle an incoming request.
     * Enforce HTTPS in production environment.
     */
    public function handle(Request $request, Closure $next)
    {
        if (app()->environment('production')) {
            // Force HTTPS redirect
            if (!$request->secure() && !app()->environment('local')) {
                return redirect()->secure($request->getRequestUri());
            }

            // Force HTTPS URL generation
            \URL::forceScheme('https');
        }

        return $next($request);
    }
}
