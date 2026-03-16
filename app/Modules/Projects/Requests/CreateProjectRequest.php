<?php

namespace App\Modules\Projects\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorized by Policy in Controller
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_manager_id' => 'nullable|exists:users,id',
            'team_lead_id' => 'nullable|exists:users,id',
        ];
    }
}
