<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $permissionCode
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $permissionCode): Response
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $scope = $user->getPermissionScope($permissionCode);

        if (!$scope) {
            return response()->json(['message' => 'Unauthorized. Missing permission: ' . $permissionCode], 403);
        }

        // Attach the scope to the request for use in controllers/policies
        $request->attributes->set('permission_scope', $scope);

        return $next($request);
    }
}
