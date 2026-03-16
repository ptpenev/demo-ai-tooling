<?php

namespace App\Modules\Projects\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorized by Policy in Controller
    }

    public function rules(): array
    {
        return [
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'project_manager_id' => 'nullable|exists:users,id',
            'team_lead_id' => 'nullable|exists:users,id',
        ];
    }
}
