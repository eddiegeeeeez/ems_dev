<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $notifications = [
            // User 3 (Sarah Johnson) - Event organizer
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\BookingApproved',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 3,
                'data' => json_encode([
                    'title' => 'Booking Approved',
                    'message' => 'Your booking for Annual Tech Conference 2025 at Grand Auditorium has been approved.',
                    'booking_id' => 1,
                    'venue_name' => 'Grand Auditorium'
                ]),
                'read_at' => Carbon::now()->subDays(2),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\EquipmentReady',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 3,
                'data' => json_encode([
                    'title' => 'Equipment Ready',
                    'message' => 'All equipment for your Annual Tech Conference is ready for pickup.',
                    'booking_id' => 1
                ]),
                'read_at' => null,
                'created_at' => Carbon::now()->subHours(6),
                'updated_at' => Carbon::now()->subHours(6),
            ],
            
            // User 4 (Michael Chen) - Engineering
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\BookingApproved',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 4,
                'data' => json_encode([
                    'title' => 'Booking Approved',
                    'message' => 'Your Engineering Department Meeting booking has been approved.',
                    'booking_id' => 2,
                    'venue_name' => 'Lecture Hall 101'
                ]),
                'read_at' => Carbon::now()->subHours(12),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now(),
            ],
            
            // User 5 (Emily Rodriguez) - Business Admin
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\BookingApproved',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 5,
                'data' => json_encode([
                    'title' => 'Booking Approved',
                    'message' => 'Student Leadership Workshop booking confirmed.',
                    'booking_id' => 3,
                    'venue_name' => 'Student Union Hall'
                ]),
                'read_at' => null,
                'created_at' => Carbon::now()->subHours(8),
                'updated_at' => Carbon::now()->subHours(8),
            ],
            
            // User 6 (David Kim) - Pending booking
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\BookingPending',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 6,
                'data' => json_encode([
                    'title' => 'Booking Pending Review',
                    'message' => 'Your Web Development Bootcamp booking is pending admin review.',
                    'booking_id' => 4,
                    'venue_name' => 'Computer Lab 204'
                ]),
                'read_at' => null,
                'created_at' => Carbon::now()->subHours(3),
                'updated_at' => Carbon::now()->subHours(3),
            ],
            
            // User 7 (Jennifer Lee) - Guest lecture
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\BookingPending',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 7,
                'data' => json_encode([
                    'title' => 'Booking Pending',
                    'message' => 'Guest Lecture booking awaiting approval.',
                    'booking_id' => 5,
                    'venue_name' => 'Auditorium B'
                ]),
                'read_at' => null,
                'created_at' => Carbon::now()->subHours(5),
                'updated_at' => Carbon::now()->subHours(5),
            ],
            
            // Admin user (user_id 1) - Multiple notifications
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\NewBookingRequest',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 1,
                'data' => json_encode([
                    'title' => 'New Booking Request',
                    'message' => 'Web Development Bootcamp booking requires approval.',
                    'booking_id' => 4,
                    'requester_name' => 'David Kim'
                ]),
                'read_at' => null,
                'created_at' => Carbon::now()->subHours(3),
                'updated_at' => Carbon::now()->subHours(3),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\NewBookingRequest',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 1,
                'data' => json_encode([
                    'title' => 'New Booking Request',
                    'message' => 'Guest Lecture: AI in Education requires approval.',
                    'booking_id' => 5,
                    'requester_name' => 'Jennifer Lee'
                ]),
                'read_at' => null,
                'created_at' => Carbon::now()->subHours(5),
                'updated_at' => Carbon::now()->subHours(5),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\LowEquipmentStock',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 1,
                'data' => json_encode([
                    'title' => 'Low Equipment Stock Alert',
                    'message' => 'Lapel Microphones stock is low (1 available).',
                    'equipment_id' => 34,
                    'equipment_name' => 'Lapel Microphones',
                    'available_quantity' => 1
                ]),
                'read_at' => null,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\LowEquipmentStock',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 1,
                'data' => json_encode([
                    'title' => 'Equipment Out of Stock',
                    'message' => 'Laser Pointers are out of stock.',
                    'equipment_id' => 35,
                    'equipment_name' => 'Laser Pointers',
                    'available_quantity' => 0
                ]),
                'read_at' => null,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            
            // User 9 (Christopher Brown) - Completed event
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\EventCompleted',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => 9,
                'data' => json_encode([
                    'title' => 'Event Completed',
                    'message' => 'Thank you for hosting Career Fair 2024. Please provide feedback.',
                    'booking_id' => 7
                ]),
                'read_at' => null,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
        ];

        foreach ($notifications as $notification) {
            DB::table('notifications')->insert($notification);
        }
    }
}
