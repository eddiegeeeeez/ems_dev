<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Department to College mapping
        $departmentToCollege = [
            'Administration' => 'College of Arts and Sciences',
            'Computer Science' => 'College of Computer Studies',
            'Engineering' => 'College of Engineering',
            'Business Administration' => 'College of Business Administration',
            'Liberal Arts' => 'College of Arts and Sciences',
            'Education' => 'College of Education',
            'Health Sciences' => 'College of Allied Health Sciences',
        ];

        // Admin users
        User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@umindanao.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'department' => 'Administration',
            'college' => $departmentToCollege['Administration'],
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Edgar Allain Garan',
            'username' => 'edgardough',
            'email' => 'e.garan.548856@umindanao.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'department' => 'Computer Science',
            'college' => $departmentToCollege['Computer Science'],
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Edgar',
            'email_verified_at' => now(),
        ]);

        // Organizer users
        $organizers = [
            ['name' => 'Sarah Johnson', 'email' => 'sarah.j@umindanao.edu.ph', 'department' => 'Computer Science'],
            ['name' => 'Michael Chen', 'email' => 'michael.c@umindanao.edu.ph', 'department' => 'Engineering'],
            ['name' => 'Emily Rodriguez', 'email' => 'emily.r@umindanao.edu.ph', 'department' => 'Business Administration'],
            ['name' => 'David Kim', 'email' => 'david.k@umindanao.edu.ph', 'department' => 'Liberal Arts'],
            ['name' => 'Jennifer Lee', 'email' => 'jennifer.l@umindanao.edu.ph', 'department' => 'Education'],
            ['name' => 'Robert Taylor', 'email' => 'robert.t@umindanao.edu.ph', 'department' => 'Health Sciences'],
            ['name' => 'Lisa Anderson', 'email' => 'lisa.a@umindanao.edu.ph', 'department' => 'Computer Science'],
            ['name' => 'James Wilson', 'email' => 'james.w@umindanao.edu.ph', 'department' => 'Engineering'],
            ['name' => 'Maria Garcia', 'email' => 'maria.g@umindanao.edu.ph', 'department' => 'Business Administration'],
            ['name' => 'Christopher Brown', 'email' => 'chris.b@umindanao.edu.ph', 'department' => 'Liberal Arts'],
            ['name' => 'Amanda Martinez', 'email' => 'amanda.m@umindanao.edu.ph', 'department' => 'Education'],
            ['name' => 'Daniel Thompson', 'email' => 'daniel.t@umindanao.edu.ph', 'department' => 'Health Sciences'],
            ['name' => 'Nicole White', 'email' => 'nicole.w@umindanao.edu.ph', 'department' => 'Computer Science'],
            ['name' => 'Kevin Harris', 'email' => 'kevin.h@umindanao.edu.ph', 'department' => 'Engineering'],
            ['name' => 'Jessica Clark', 'email' => 'jessica.c@umindanao.edu.ph', 'department' => 'Business Administration'],
        ];

        foreach ($organizers as $organizer) {
            User::create([
                'name' => $organizer['name'],
                'username' => strtolower(str_replace([' ', '.'], '', explode('@', $organizer['email'])[0])),
                'email' => $organizer['email'],
                'password' => Hash::make('password'),
                'role' => 'ORGANIZER',
                'department' => $organizer['department'],
                'college' => $departmentToCollege[$organizer['department']],
                'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . urlencode($organizer['name']),
                'email_verified_at' => now(),
            ]);
        }
        // Generate 150 seeded random organizers for testing
        User::factory()->count(150)->make()->each(function ($user) use ($departmentToCollege) {
             $dept = array_rand($departmentToCollege);
             $user->department = $dept;
             $user->college = $departmentToCollege[$dept];
             $user->role = 'ORGANIZER';
             // Generate a deterministic avatar based on name
             $user->avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . urlencode($user->name);
             $user->save();
        });
    }
}
