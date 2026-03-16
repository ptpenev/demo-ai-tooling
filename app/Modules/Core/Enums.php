<?php

namespace App\Modules\Core\Enums;

enum TimeType: string
{
    case WORKING = 'WORKING';
    case OVERTIME = 'OVERTIME';
    case HOLIDAY = 'HOLIDAY';
    case CLIENT_EXTRA = 'CLIENT_EXTRA';
}

enum LeaveStatus: string
{
    case PENDING = 'PENDING';
    case APPROVED = 'APPROVED';
    case REJECTED = 'REJECTED';
    case CANCELLED = 'CANCELLED';
}

enum TargetType: string
{
    case ALL = 'ALL';
    case TEAM = 'TEAM';
    case PROJECT = 'PROJECT';
    case USER = 'USER';
}
