<?php

namespace App\Modules\Timesheets\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimesheetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'project_id' => $this->project_id,
            'project' => $this->whenLoaded('project'),
            'user' => $this->whenLoaded('user'),
            'date' => $this->date->format('Y-m-d'),
            'hours' => $this->hours,
            'time_type' => $this->time_type,
            'comment' => $this->comment,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
