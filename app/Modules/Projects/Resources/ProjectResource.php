<?php

namespace App\Modules\Projects\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'project_manager' => $this->whenLoaded('manager'),
            'team_lead' => $this->whenLoaded('teamLead'),
            'members_count' => $this->whenCounted('members'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
