<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingEquipment;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $bookings = [
            // Approved upcoming bookings
            [
                'user_id' => 3,
                'venue_id' => 1,
                'event_name' => 'Annual Tech Conference 2025',
                'event_description' => 'A comprehensive technology conference featuring keynote speakers, workshops, and networking sessions for students and faculty.',
                'start_datetime' => Carbon::now()->addDays(15)->setTime(9, 0),
                'end_datetime' => Carbon::now()->addDays(15)->setTime(17, 0),
                'expected_attendees' => 450,
                'status' => 'approved',
                'notes' => 'All equipment confirmed. Catering arranged.',
                'total_cost' => 1200.00,
                'equipment' => [1 => 5, 2 => 4, 7 => 8],
            ],
            [
                'user_id' => 4,
                'venue_id' => 2,
                'event_name' => 'Engineering Department Meeting',
                'event_description' => 'Monthly departmental meeting to discuss curriculum updates and research projects.',
                'start_datetime' => Carbon::now()->addDays(5)->setTime(14, 0),
                'end_datetime' => Carbon::now()->addDays(5)->setTime(16, 0),
                'expected_attendees' => 35,
                'status' => 'approved',
                'notes' => null,
                'total_cost' => 100.00,
                'equipment' => [3 => 1, 5 => 1],
            ],
            [
                'user_id' => 5,
                'venue_id' => 3,
                'event_name' => 'Student Leadership Workshop',
                'event_description' => 'Interactive workshop for student leaders covering team building, communication skills, and event planning.',
                'start_datetime' => Carbon::now()->addDays(8)->setTime(10, 0),
                'end_datetime' => Carbon::now()->addDays(8)->setTime(15, 0),
                'expected_attendees' => 180,
                'status' => 'approved',
                'notes' => 'Lunch break from 12-1 PM',
                'total_cost' => 200.00,
                'equipment' => [8 => 20, 9 => 180, 2 => 2],
            ],
            
            // Pending bookings awaiting approval
            [
                'user_id' => 6,
                'venue_id' => 4,
                'event_name' => 'Web Development Bootcamp',
                'event_description' => 'Intensive 2-day coding bootcamp for beginners covering HTML, CSS, and JavaScript fundamentals.',
                'start_datetime' => Carbon::now()->addDays(20)->setTime(9, 0),
                'end_datetime' => Carbon::now()->addDays(20)->setTime(17, 0),
                'expected_attendees' => 40,
                'status' => 'pending',
                'notes' => null,
                'total_cost' => null,
                'equipment' => [],
            ],
            [
                'user_id' => 7,
                'venue_id' => 7,
                'event_name' => 'Guest Lecture: AI in Education',
                'event_description' => 'Distinguished professor from MIT will discuss the impact of artificial intelligence on modern education systems.',
                'start_datetime' => Carbon::now()->addDays(12)->setTime(15, 0),
                'end_datetime' => Carbon::now()->addDays(12)->setTime(17, 0),
                'expected_attendees' => 120,
                'status' => 'pending',
                'notes' => null,
                'total_cost' => null,
                'equipment' => [3 => 1, 1 => 2],
            ],
            [
                'user_id' => 8,
                'venue_id' => 11,
                'event_name' => 'Startup Pitch Competition',
                'event_description' => 'Final round of the annual startup pitch competition where student entrepreneurs present their business ideas to judges and investors.',
                'start_datetime' => Carbon::now()->addDays(25)->setTime(13, 0),
                'end_datetime' => Carbon::now()->addDays(25)->setTime(18, 0),
                'expected_attendees' => 35,
                'status' => 'pending',
                'notes' => null,
                'total_cost' => null,
                'equipment' => [3 => 1, 17 => 1, 25 => 5],
            ],
            
            // Completed past bookings
            [
                'user_id' => 9,
                'venue_id' => 12,
                'event_name' => 'Student Art Exhibition',
                'event_description' => 'Showcase of visual arts created by students throughout the semester.',
                'start_datetime' => Carbon::now()->subDays(10)->setTime(10, 0),
                'end_datetime' => Carbon::now()->subDays(10)->setTime(20, 0),
                'expected_attendees' => 75,
                'status' => 'completed',
                'notes' => 'Excellent turnout. Positive feedback from attendees.',
                'total_cost' => 390.00,
                'equipment' => [12 => 15, 24 => 10],
            ],
            [
                'user_id' => 10,
                'venue_id' => 5,
                'event_name' => 'Robotics Competition Prep',
                'event_description' => 'Practice session for students participating in the regional robotics competition.',
                'start_datetime' => Carbon::now()->subDays(5)->setTime(14, 0),
                'end_datetime' => Carbon::now()->subDays(5)->setTime(18, 0),
                'expected_attendees' => 45,
                'status' => 'completed',
                'notes' => 'All equipment returned in good condition.',
                'total_cost' => 240.00,
                'equipment' => [20 => 8, 21 => 40],
            ],
            [
                'user_id' => 11,
                'venue_id' => 6,
                'event_name' => 'Faculty Development Seminar',
                'event_description' => 'Professional development session on innovative teaching methodologies.',
                'start_datetime' => Carbon::now()->subDays(3)->setTime(9, 0),
                'end_datetime' => Carbon::now()->subDays(3)->setTime(12, 0),
                'expected_attendees' => 28,
                'status' => 'completed',
                'notes' => null,
                'total_cost' => 90.00,
                'equipment' => [11 => 2, 28 => 4],
            ],
            
            // Rejected bookings
            [
                'user_id' => 12,
                'venue_id' => 1,
                'event_name' => 'Music Concert',
                'event_description' => 'Live music concert featuring local bands.',
                'start_datetime' => Carbon::now()->addDays(7)->setTime(19, 0),
                'end_datetime' => Carbon::now()->addDays(7)->setTime(23, 0),
                'expected_attendees' => 500,
                'status' => 'rejected',
                'rejection_reason' => 'Venue not suitable for loud music events due to acoustic concerns and proximity to study areas. Please consider outdoor venues.',
                'notes' => null,
                'total_cost' => null,
                'equipment' => [],
            ],
            [
                'user_id' => 13,
                'venue_id' => 10,
                'event_name' => 'First Aid Training',
                'event_description' => 'Basic first aid and CPR training for student organizations.',
                'start_datetime' => Carbon::now()->addDays(3)->setTime(14, 0),
                'end_datetime' => Carbon::now()->addDays(3)->setTime(17, 0),
                'expected_attendees' => 30,
                'status' => 'rejected',
                'rejection_reason' => 'Medical simulation lab is reserved for Health Sciences students only. Please book Conference Room A or B for general training sessions.',
                'notes' => null,
                'total_cost' => null,
                'equipment' => [],
            ],
            
            // Cancelled bookings
            [
                'user_id' => 14,
                'venue_id' => 8,
                'event_name' => 'Outdoor Movie Night',
                'event_description' => 'Screening of classic films under the stars.',
                'start_datetime' => Carbon::now()->addDays(2)->setTime(18, 0),
                'end_datetime' => Carbon::now()->addDays(2)->setTime(22, 0),
                'expected_attendees' => 90,
                'status' => 'cancelled',
                'notes' => 'Cancelled due to weather forecast predicting rain.',
                'total_cost' => null,
                'equipment' => [3 => 1, 4 => 1, 2 => 2],
            ],
            [
                'user_id' => 15,
                'venue_id' => 2,
                'event_name' => 'Alumni Networking Event',
                'event_description' => 'Networking session connecting current students with successful alumni.',
                'start_datetime' => Carbon::now()->addDays(18)->setTime(17, 0),
                'end_datetime' => Carbon::now()->addDays(18)->setTime(20, 0),
                'expected_attendees' => 45,
                'status' => 'cancelled',
                'notes' => 'Organizer requested cancellation - rescheduling for next month.',
                'total_cost' => null,
                'equipment' => [],
            ],
            
            // More approved bookings for variety
            [
                'user_id' => 16,
                'venue_id' => 9,
                'event_name' => 'Podcast Recording Workshop',
                'event_description' => 'Hands-on workshop teaching students how to produce professional podcasts.',
                'start_datetime' => Carbon::now()->addDays(14)->setTime(13, 0),
                'end_datetime' => Carbon::now()->addDays(14)->setTime(16, 0),
                'expected_attendees' => 12,
                'status' => 'approved',
                'notes' => 'Small group - perfect for hands-on learning',
                'total_cost' => 270.00,
                'equipment' => [6 => 2, 22 => 1, 23 => 3],
            ],
            [
                'user_id' => 17,
                'venue_id' => 13,
                'event_name' => 'Intramural Planning Meeting',
                'event_description' => 'Organizational meeting for spring intramural sports season.',
                'start_datetime' => Carbon::now()->addDays(6)->setTime(16, 0),
                'end_datetime' => Carbon::now()->addDays(6)->setTime(18, 0),
                'expected_attendees' => 30,
                'status' => 'approved',
                'notes' => null,
                'total_cost' => 70.00,
                'equipment' => [11 => 1],
            ],
        ];

        foreach ($bookings as $bookingData) {
            $equipment = $bookingData['equipment'];
            unset($bookingData['equipment']);
            
            $booking = Booking::create($bookingData);
            
            // Add equipment to booking
            foreach ($equipment as $equipmentId => $quantityRequested) {
                // Get equipment details
                $equipmentItem = \App\Models\Equipment::find($equipmentId);
                $ratePerUnit = $equipmentItem ? $equipmentItem->rental_rate_per_unit : 0;
                $subtotal = $ratePerUnit * $quantityRequested;
                
                BookingEquipment::create([
                    'booking_id' => $booking->id,
                    'equipment_id' => $equipmentId,
                    'quantity_requested' => $quantityRequested,
                    'rate_per_unit' => $ratePerUnit,
                    'subtotal' => $subtotal,
                ]);
            }
        }
    }
}
