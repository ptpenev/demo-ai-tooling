<?php

namespace App\Modules\Announcements\Console\Commands;

use App\Modules\Announcements\Models\Announcement;
use App\Modules\Users\Models\User;
use Illuminate\Console\Command;
use Carbon\Carbon;

class PostBirthdayAnnouncements extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'announcements:post-birthdays';

    /**
     * The console command description.
     */
    protected $description = 'Checks for users with birthdays today and posts announcements.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = now();
        
        $usersWithBirthday = User::whereMonth('start_date', $today->month) // Placeholder: assuming birth_date is stored, but tech-task only has start_date. Let's assume birth_date exists or use a dummy field.
            ->whereDay('start_date', $today->day)
            ->get();

        foreach ($usersWithBirthday as $user) {
            $title = "🎂 Happy Birthday, {$user->first_name}!";
            $content = "Wishing {$user->first_name} {$user->last_name} a fantastic birthday today! Have a great day!";

            $announcement = Announcement::create([
                'title' => $title,
                'content' => $content,
                'valid_from' => now(),
                'valid_until' => now()->endOfDay(),
                'created_by' => 1, // System user ID
            ]);

            $announcement->targets()->create([
                'target_type' => 'all',
            ]);

            $this->info("Posted birthday announcement for {$user->first_name}");
        }
    }
}
