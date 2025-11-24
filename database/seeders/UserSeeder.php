<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin users
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@ems.edu',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'department' => 'Administration',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'John Admin',
            'email' => 'john.admin@ems.edu',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'department' => 'Computer Science',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            'email_verified_at' => now(),
        ]);

        // Organizer users
        $organizers = [
            ['name' => 'Sarah Johnson', 'email' => 'sarah.j@ems.edu', 'department' => 'Computer Science'],
            ['name' => 'Michael Chen', 'email' => 'michael.c@ems.edu', 'department' => 'Engineering'],
            ['name' => 'Emily Rodriguez', 'email' => 'emily.r@ems.edu', 'department' => 'Business Administration'],
            ['name' => 'David Kim', 'email' => 'david.k@ems.edu', 'department' => 'Liberal Arts'],
            ['name' => 'Jennifer Lee', 'email' => 'jennifer.l@ems.edu', 'department' => 'Education'],
            ['name' => 'Robert Taylor', 'email' => 'robert.t@ems.edu', 'department' => 'Health Sciences'],
            ['name' => 'Lisa Anderson', 'email' => 'lisa.a@ems.edu', 'department' => 'Computer Science'],
            ['name' => 'James Wilson', 'email' => 'james.w@ems.edu', 'department' => 'Engineering'],
            ['name' => 'Maria Garcia', 'email' => 'maria.g@ems.edu', 'department' => 'Business Administration'],
            ['name' => 'Christopher Brown', 'email' => 'chris.b@ems.edu', 'department' => 'Liberal Arts'],
            ['name' => 'Amanda Martinez', 'email' => 'amanda.m@ems.edu', 'department' => 'Education'],
            ['name' => 'Daniel Thompson', 'email' => 'daniel.t@ems.edu', 'department' => 'Health Sciences'],
            ['name' => 'Nicole White', 'email' => 'nicole.w@ems.edu', 'department' => 'Computer Science'],
            ['name' => 'Kevin Harris', 'email' => 'kevin.h@ems.edu', 'department' => 'Engineering'],
            ['name' => 'Jessica Clark', 'email' => 'jessica.c@ems.edu', 'department' => 'Business Administration'],
        ];

        foreach ($organizers as $organizer) {
            User::create([
                'name' => $organizer['name'],
                'email' => $organizer['email'],
                'password' => Hash::make('password'),
                'role' => 'ORGANIZER',
                'department' => $organizer['department'],
                'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . urlencode($organizer['name']),
                'email_verified_at' => now(),
            ]);
        }
    }
}
