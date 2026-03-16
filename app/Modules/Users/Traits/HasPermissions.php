<?php

namespace App\Modules\Users\Traits;

use Spatie\Permission\Traits\HasRoles;

trait HasPermissions
{
    use HasRoles;

    /**
     * Check if the user has a specific permission with a given scope.
     *
     * @param string $permissionCode
     * @param string|null $scope
     * @return bool
     */
    public function hasPermissionWithScope(string $permissionCode, ?string $scope = null): bool
    {
        $permissions = $this->getAllPermissions();

        return $permissions->contains(function ($permission) use ($permissionCode, $scope) {
            if ($permission->code !== $permissionCode) {
                return false;
            }

            if ($scope && $permission->scope !== $scope) {
                return false;
            }

            return true;
        });
    }

    /**
     * Get the highest scope for a given permission code.
     * Scopes from highest to lowest: all > project > team > own
     *
     * @param string $permissionCode
     * @return string|null
     */
    public function getPermissionScope(string $permissionCode): ?string
    {
        $permissions = $this->getAllPermissions()->where('code', $permissionCode);

        if ($permissions->isEmpty()) {
            return null;
        }

        $scopeOrder = ['all', 'project', 'team', 'own'];

        foreach ($scopeOrder as $scope) {
            if ($permissions->contains('scope', $scope)) {
                return $scope;
            }
        }

        return null;
    }
}
