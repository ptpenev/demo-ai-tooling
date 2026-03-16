<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Resources\ProjectResource;
use App\Modules\Projects\Requests\CreateProjectRequest;
use App\Modules\Projects\Requests\UpdateProjectRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $scope = $user->getPermissionScope('projects.view');

        $query = Project::with(['manager', 'teamLead'])->withCount('members');

        if ($scope === 'project') {
            $query->whereHas('members', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        } elseif ($scope === 'team') {
            // Implementation for team scope
        } elseif ($scope === 'own') {
            $query->where('project_manager_id', $user->id)
                  ->orWhere('team_lead_id', $user->id);
        }

        return ProjectResource::collection($query->get());
    }

    public function store(CreateProjectRequest $request): ProjectResource
    {
        $this->authorize('create', Project::class);

        $project = Project::create($request->validated());
        return new ProjectResource($project);
    }

    public function show(Project $project): ProjectResource
    {
        $this->authorize('view', $project);

        $project->load(['manager', 'teamLead', 'members']);
        return new ProjectResource($project);
    }

    public function update(UpdateProjectRequest $request, Project $project): ProjectResource
    {
        $this->authorize('update', $project);

        $project->update($request->validated());
        return new ProjectResource($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->noContent();
    }

    public function addMember(Request $request, Project $project)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'nullable|string|max:255',
        ]);

        $project->members()->syncWithoutDetaching([
            $validated['user_id'] => ['role' => $validated['role']]
        ]);

        return response()->json(['message' => 'Member added successfully']);
    }

    public function removeMember(Request $request, Project $project)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $project->members()->detach($validated['user_id']);

        return response()->json(['message' => 'Member removed successfully']);
    }
}
