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
            CollegeSeeder::class,
            UserSeeder::class,
            VenueSeeder::class,
            EquipmentSeeder::class,
            BookingSeeder::class,
            NotificationSeeder::class,
            AuditLogSeeder::class,
        ]);

        $this->command->info('Database seeded successfully with realistic data!');
    }
}
