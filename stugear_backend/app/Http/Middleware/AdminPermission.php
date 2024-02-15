<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class AdminPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $role = DB::table('user_roles')
        ->where('user_id', auth()->id())
        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
        ->pluck('roles.role_name')
        ->toArray();
        if (in_array('ADMIN', $role)) {
            return $next($request);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'do not have permission'
            ],403);
        }

    }
}
