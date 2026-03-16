<?php

namespace App\Modules\Timesheets\Requests;

use App\Modules\Core\Enums\TimeType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class TimesheetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled via policies/middleware
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'exists:projects,id'],
            'date' => ['required', 'date'],
            'hours' => ['required', 'numeric', 'min:0.01', 'max:24'],
            'time_type' => ['required', new Enum(TimeType::class)],
            'comment' => ['required', 'string', 'min:3'],
        ];
    }
}
