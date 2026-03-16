<?php

namespace App\Modules\Leaves\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->whenLoaded('user'),
            'type' => $this->whenLoaded('type'),
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date->format('Y-m-d'),
            'total_days' => $this->total_days,
            'status' => $this->status,
            'request_signature' => $this->request_signature,
            'approver_signature' => $this->approver_signature,
            'created_at' => $this->created_at,
        ];
    }
}
