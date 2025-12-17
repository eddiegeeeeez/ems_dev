<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AuditLogSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        if ($users->isEmpty()) {
            return;
        }

        $actions = [
            'create' => 'Created new booking',
            'update' => 'Updated booking details',
            'approve' => 'Approved booking request',
            'reject' => 'Rejected booking request',
            'delete' => 'Deleted booking',
            'login' => 'User logged in',
            'logout' => 'User logged out',
            'role_change' => 'Changed user role',
            'venue_update' => 'Updated venue information',
            'equipment_add' => 'Added new equipment',
            'equipment_remove' => 'Removed equipment',
            'settings_update' => 'Updated system settings',
        ];

        $models = ['Booking', 'User', 'Venue', 'Equipment', 'Department'];

        $logs = [];
        for ($i = 0; $i < 20; $i++) {
            $action = array_rand($actions);
            $model = $models[array_rand($models)];
            
            $logs[] = [
                'user_id' => $users->random()->id,
                'action' => $action,
                'model_type' => $model,
                'model_id' => rand(1, 50),
                'changes' => json_encode(['status' => 'approved']),
                'old_values' => json_encode(['status' => 'pending']),
                'new_values' => json_encode(['status' => 'approved']),
                'description' => $actions[$action],
                'ip_address' => '192.168.' . rand(1, 254) . '.' . rand(1, 254),
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'created_at' => Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 24)),
                'updated_at' => Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 24)),
            ];
        }

        AuditLog::insert($logs);
    }
}
