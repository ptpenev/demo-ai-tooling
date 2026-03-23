@extends('layouts.app')

@section('title', 'Create Project')

@section('content')
<div x-data="createProjectPage()">
    <div class="max-w-7xl mx-auto">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Create New Project</h1>
            <p class="text-gray-600 mt-1">Fill in the details below to create a new project.</p>
        </div>

        <div class="bg-white shadow rounded-lg">
            <form @submit.prevent="createProject" class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                        <input type="text" x-model="form.name" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select x-model="form.status" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="active">Active</option>
                            <option value="planning">Planning</option>
                            <option value="completed">Completed</option>
                            <option value="on_hold">On Hold</option>
                        </select>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea x-model="form.description" rows="4"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Describe your project..."></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input type="date" x-model="form.start_date"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input type="date" x-model="form.end_date"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                </div>

                <div class="mt-8 flex justify-end space-x-3">
                    <a href="/projects" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Cancel
                    </a>
                    <button type="submit" :disabled="submitting"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                        <span x-show="!submitting">Create Project</span>
                        <span x-show="submitting" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function createProjectPage() {
    return {
        submitting: false,
        form: {
            name: '',
            description: '',
            status: 'active',
            start_date: '',
            end_date: ''
        },
        
        async createProject() {
            this.submitting = true;
            try {
                await apiCall('/projects', {
                    method: 'POST',
                    body: JSON.stringify(this.form)
                });
                
                window.location.href = '/projects';
            } catch (error) {
                console.error('Failed to create project:', error);
                alert('Failed to create project. Please try again.');
            } finally {
                this.submitting = false;
            }
        }
    }
}
</script>
@endsection
