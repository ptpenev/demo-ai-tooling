<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tableNames = config('permission.table_names');

        Schema::table($tableNames['permissions'], function (Blueprint $table) {
            $table->string('code')->unique()->after('name');
            $table->string('module')->after('code');
            $table->string('resource')->after('module');
            $table->string('action')->after('resource');
            $table->string('scope')->default('own')->after('action');
            $table->boolean('is_project_specific')->default(false)->after('scope');
            $table->boolean('is_active')->default(true)->after('is_project_specific');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableNames = config('permission.table_names');

        Schema::table($tableNames['permissions'], function (Blueprint $table) {
            $table->dropColumn([
                'code',
                'module',
                'resource',
                'action',
                'scope',
                'is_project_specific',
                'is_active',
            ]);
        });
    }
};
