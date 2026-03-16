<?php

namespace App\Modules\Audit\Services;

use App\Modules\Audit\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class Auditor
{
    /**
     * Log an action in the central audit system.
     *
     * @param string $action The action performed (e.g., 'leave.approved')
     * @param string $resourceType The model name (e.g., 'LeaveRequest')
     * @param int|null $resourceId The primary key of the resource
     * @param array|null $metadata Snapshots of data (before/after)
     * @return AuditLog
     */
    public function log(string $action, string $resourceType, ?int $resourceId = null, ?array $metadata = null): AuditLog
    {
        return AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'metadata' => $metadata,
        ]);
    }
}
