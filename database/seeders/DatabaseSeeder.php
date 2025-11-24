<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DepartmentSeeder::class,
            UserSeeder::class,
            VenueSeeder::class,
            EquipmentSeeder::class,
            BookingSeeder::class,
            NotificationSeeder::class,
            MaintenanceRequestSeeder::class,
        ]);

        $this->command->info('Database seeded successfully with realistic data!');
        $this->command->info('');
        $this->command->info('Login Credentials:');
        $this->command->info('Admin: admin@ems.edu / password');
        $this->command->info('Admin: john.admin@ems.edu / password');
        $this->command->info('Organizer: sarah.j@ems.edu / password');
        $this->command->info('');
        $this->command->info('Database Summary:');
        $this->command->info('- 6 Departments');
        $this->command->info('- 17 Users (2 Admins + 15 Organizers)');
        $this->command->info('- 14 Venues (13 active, 1 under maintenance)');
        $this->command->info('- 36 Equipment items');
        $this->command->info('- 15 Bookings (various statuses)');
        $this->command->info('- 28 Notifications');
        $this->command->info('- 15 Maintenance Requests');
    }
}
