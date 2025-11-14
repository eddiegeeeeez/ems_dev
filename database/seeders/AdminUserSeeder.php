<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This seeder updates existing users to ADMIN role if their email is in the admin_emails config.
     */
    public function run(): void
    {
        $adminEmails = config('admin_emails.admin_emails', []);
        
        if (empty($adminEmails)) {
            $this->command->warn('No admin emails configured in config/admin_emails.php');
            return;
        }

        $this->command->info('Setting up admin users...');

        foreach ($adminEmails as $email) {
            $user = User::where('email', $email)->first();
            
            if ($user) {
                $user->role = 'ADMIN';
                $user->department = 'ADMINISTRATION';
                $user->save();
                $this->command->info("Updated user {$email} to ADMIN role");
                Log::info("AdminUserSeeder: Updated user {$email} to ADMIN role");
            } else {
                $this->command->warn("User with email {$email} not found. They will be assigned ADMIN role on first Google login.");
            }
        }

        $this->command->info('Admin user setup complete!');
    }
}

