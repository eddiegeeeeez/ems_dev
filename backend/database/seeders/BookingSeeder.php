<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingEquipment;
use App\Models\User;
use App\Models\Venue;
use App\Models\Equipment;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        // Get organizer users
        $organizers = User::where('role', 'ORGANIZER')->pluck('id')->toArray();
        $venues = Venue::all();
        $equipment = Equipment::all();

        if (empty($organizers) || $venues->isEmpty() || $equipment->isEmpty()) {
            $this->command->warn('Not enough users, venues, or equipment to create bookings');
            return;
        }

        $bookings = [
            // June 2025 - Past bookings (completed)
            [
                'user_id' => $organizers[0],
                'venue_id' => $venues[0]->id,
                'event_title' => 'Summer Orientation 2025',
                'event_description' => 'Welcome program for new students starting summer semester.',
                'start_datetime' => Carbon::parse('2025-06-02 09:00:00'),
                'end_datetime' => Carbon::parse('2025-06-02 17:00:00'),
                'expected_attendees' => 500,
                'status' => 'completed',
                'rejection_reason' => null,
                'notes' => 'Event completed successfully with great attendance.',
                'equipment_needed' => [
                    $equipment[0]->id,
                    $equipment[1]->id,
                ],
            ],
            [
                'user_id' => $organizers[1],
                'venue_id' => $venues[1]->id,
                'event_title' => 'Department Faculty Meeting',
                'event_description' => 'Monthly faculty meeting to discuss curriculum and student progress.',
                'start_datetime' => Carbon::parse('2025-06-05 14:00:00'),
                'end_datetime' => Carbon::parse('2025-06-05 16:00:00'),
                'expected_attendees' => 25,
                'status' => 'completed',
                'rejection_reason' => null,
                'notes' => 'Meeting conducted as planned.',
                'equipment_needed' => [
                    $equipment[2]->id,
                ],
            ],
            [
                'user_id' => $organizers[2] ?? $organizers[0],
                'venue_id' => $venues[2]->id,
                'event_title' => 'Student Club Exhibition',
                'event_description' => 'Showcase of various student clubs and organizations.',
                'start_datetime' => Carbon::parse('2025-06-10 10:00:00'),
                'end_datetime' => Carbon::parse('2025-06-10 18:00:00'),
                'expected_attendees' => 300,
                'status' => 'completed',
                'rejection_reason' => null,
                'notes' => 'Excellent turnout and participation.',
                'equipment_needed' => [
                    $equipment[3]->id,
                    $equipment[4]->id,
                ],
            ],

            // July 2025 - Past bookings (mix of statuses)
            [
                'user_id' => $organizers[3] ?? $organizers[0],
                'venue_id' => $venues[3]->id,
                'event_title' => 'Technology Workshop',
                'event_description' => 'Hands-on workshop covering emerging technologies.',
                'start_datetime' => Carbon::parse('2025-07-08 09:00:00'),
                'end_datetime' => Carbon::parse('2025-07-08 12:00:00'),
                'expected_attendees' => 60,
                'status' => 'completed',
                'rejection_reason' => null,
                'notes' => 'All participants received certificates.',
                'equipment_needed' => [
                    $equipment[5]->id,
                ],
            ],
            [
                'user_id' => $organizers[4] ?? $organizers[0],
                'venue_id' => $venues[4]->id,
                'event_title' => 'Art & Culture Festival',
                'event_description' => 'Cultural celebration featuring art, music, and performances.',
                'start_datetime' => Carbon::parse('2025-07-15 18:00:00'),
                'end_datetime' => Carbon::parse('2025-07-15 22:00:00'),
                'expected_attendees' => 400,
                'status' => 'rejected',
                'rejection_reason' => 'Noise concerns and proximity to residential areas. Please consider outdoor venue or weekend time slot.',
                'notes' => 'Rejected due to noise complaint concerns.',
                'equipment_needed' => [],
            ],
            [
                'user_id' => $organizers[5] ?? $organizers[0],
                'venue_id' => $venues[5]->id,
                'event_title' => 'Leadership Summit',
                'event_description' => 'Annual leadership development summit for student leaders.',
                'start_datetime' => Carbon::parse('2025-07-21 09:00:00'),
                'end_datetime' => Carbon::parse('2025-07-21 17:00:00'),
                'expected_attendees' => 150,
                'status' => 'completed',
                'rejection_reason' => null,
                'notes' => 'Very successful event with positive feedback.',
                'equipment_needed' => [
                    $equipment[6]->id,
                    $equipment[7]->id,
                ],
            ],

            // August 2025 - Approved upcoming bookings
            [
                'user_id' => $organizers[0],
                'venue_id' => $venues[6]->id ?? $venues[0]->id,
                'event_title' => 'Fall Semester Kickoff',
                'event_description' => 'Opening ceremony for fall semester with keynote speaker.',
                'start_datetime' => Carbon::parse('2025-08-25 09:00:00'),
                'end_datetime' => Carbon::parse('2025-08-25 11:00:00'),
                'expected_attendees' => 600,
                'status' => 'approved',
                'rejection_reason' => null,
                'notes' => 'All arrangements confirmed. VIP guests invited.',
                'equipment_needed' => [
                    $equipment[0]->id,
                    $equipment[1]->id,
                    $equipment[8]->id,
                ],
            ],
            [
                'user_id' => $organizers[1],
                'venue_id' => $venues[7]->id ?? $venues[1]->id,
                'event_title' => 'Research Presentation Forum',
                'event_description' => 'Students present their summer research findings.',
                'start_datetime' => Carbon::parse('2025-08-28 13:00:00'),
                'end_datetime' => Carbon::parse('2025-08-28 17:00:00'),
                'expected_attendees' => 100,
                'status' => 'approved',
                'rejection_reason' => null,
                'notes' => 'Registration closed. 45 presentations scheduled.',
                'equipment_needed' => [
                    $equipment[2]->id,
                    $equipment[3]->id,
                ],
            ],

            // September 2025 - Mix of pending and approved
            [
                'user_id' => $organizers[2] ?? $organizers[0],
                'venue_id' => $venues[8]->id ?? $venues[2]->id,
                'event_title' => 'Department Seminar Series',
                'event_description' => 'Guest lecture by industry professionals.',
                'start_datetime' => Carbon::parse('2025-09-05 15:00:00'),
                'end_datetime' => Carbon::parse('2025-09-05 17:00:00'),
                'expected_attendees' => 80,
                'status' => 'pending',
                'rejection_reason' => null,
                'notes' => null,
                'equipment_needed' => [
                    $equipment[2]->id,
                ],
            ],
            [
                'user_id' => $organizers[3] ?? $organizers[0],
                'venue_id' => $venues[0]->id,
                'event_title' => 'Career Fair 2025',
                'event_description' => 'Major career fair featuring 50+ companies recruiting graduates.',
                'start_datetime' => Carbon::parse('2025-09-12 09:00:00'),
                'end_datetime' => Carbon::parse('2025-09-12 17:00:00'),
                'expected_attendees' => 800,
                'status' => 'approved',
                'rejection_reason' => null,
                'notes' => 'Confirmed. Additional tables and chairs arranged.',
                'equipment_needed' => [
                    $equipment[9]->id,
                    $equipment[10]->id,
                ],
            ],
            [
                'user_id' => $organizers[4] ?? $organizers[0],
                'venue_id' => $venues[1]->id,
                'event_title' => 'Student Innovation Competition',
                'event_description' => 'Final round of annual student innovation and startup pitch competition.',
                'start_datetime' => Carbon::parse('2025-09-20 13:00:00'),
                'end_datetime' => Carbon::parse('2025-09-20 18:00:00'),
                'expected_attendees' => 200,
                'status' => 'approved',
                'rejection_reason' => null,
                'notes' => 'Judges and investors confirmed.',
                'equipment_needed' => [
                    $equipment[2]->id,
                    $equipment[1]->id,
                ],
            ],

            // October 2025 - Pending and approved
            [
                'user_id' => $organizers[5] ?? $organizers[0],
                'venue_id' => $venues[2]->id,
                'event_title' => 'Homecoming Celebration',
                'event_description' => 'Annual homecoming event celebrating alumni and school traditions.',
                'start_datetime' => Carbon::parse('2025-10-10 17:00:00'),
                'end_datetime' => Carbon::parse('2025-10-10 21:00:00'),
                'expected_attendees' => 350,
                'status' => 'pending',
                'rejection_reason' => null,
                'notes' => null,
                'equipment_needed' => [
                    $equipment[4]->id,
                ],
            ],
            [
                'user_id' => $organizers[0],
                'venue_id' => $venues[3]->id,
                'event_title' => 'Mental Health Awareness Week',
                'event_description' => 'Educational and wellness activities promoting mental health awareness.',
                'start_datetime' => Carbon::parse('2025-10-15 09:00:00'),
                'end_datetime' => Carbon::parse('2025-10-15 17:00:00'),
                'expected_attendees' => 250,
                'status' => 'approved',
                'rejection_reason' => null,
                'notes' => 'Counseling center partnering on event.',
                'equipment_needed' => [
                    $equipment[11]->id,
                ],
            ],

            // November 2025 - Pending and approved
            [
                'user_id' => $organizers[1],
                'venue_id' => $venues[4]->id,
                'event_title' => 'Thanksgiving Dinner & Networking',
                'event_description' => 'Community dinner and networking event for international students.',
                'start_datetime' => Carbon::parse('2025-11-22 17:00:00'),
                'end_datetime' => Carbon::parse('2025-11-22 20:00:00'),
                'expected_attendees' => 200,
                'status' => 'approved',
                'rejection_reason' => null,
                'notes' => 'Catering arranged. Special dietary accommodations made.',
                'equipment_needed' => [
                    $equipment[9]->id,
                    $equipment[10]->id,
                ],
            ],
            [
                'user_id' => $organizers[2] ?? $organizers[0],
                'venue_id' => $venues[5]->id,
                'event_title' => 'Academic Excellence Awards Ceremony',
                'event_description' => 'Recognition ceremony for outstanding academic achievement.',
                'start_datetime' => Carbon::parse('2025-11-28 18:00:00'),
                'end_datetime' => Carbon::parse('2025-11-28 20:00:00'),
                'expected_attendees' => 400,
                'status' => 'pending',
                'rejection_reason' => null,
                'notes' => null,
                'equipment_needed' => [
                    $equipment[2]->id,
                    $equipment[1]->id,
                ],
            ],

            // December 2025 - Current and upcoming
            [
                'user_id' => $organizers[3] ?? $organizers[0],
                'venue_id' => $venues[0]->id,
                'event_title' => 'End of Semester Celebration',
                'event_description' => 'Fun celebration marking the end of fall semester.',
                'start_datetime' => Carbon::parse('2025-12-12 17:00:00'),
                'end_datetime' => Carbon::parse('2025-12-12 21:00:00'),
                'expected_attendees' => 500,
                'status' => 'approved',
                'rejection_reason' => null,
                'notes' => 'Entertainment and food arranged.',
                'equipment_needed' => [
                    $equipment[4]->id,
                    $equipment[3]->id,
                ],
            ],
            [
                'user_id' => $organizers[4] ?? $organizers[0],
                'venue_id' => $venues[1]->id,
                'event_title' => 'Winter Commencement Ceremony',
                'event_description' => 'Graduation ceremony for fall graduating class.',
                'start_datetime' => Carbon::parse('2025-12-20 10:00:00'),
                'end_datetime' => Carbon::parse('2025-12-20 13:00:00'),
                'expected_attendees' => 700,
                'status' => 'pending',
                'rejection_reason' => null,
                'notes' => null,
                'equipment_needed' => [
                    $equipment[0]->id,
                    $equipment[1]->id,
                    $equipment[8]->id,
                ],
            ],
        ];

        foreach ($bookings as $bookingData) {
            $equipmentNeeded = $bookingData['equipment_needed'];
            unset($bookingData['equipment_needed']);
            
            $booking = Booking::create($bookingData);
            
            // Add equipment to booking
            foreach ($equipmentNeeded as $equipmentId) {
                BookingEquipment::create([
                    'booking_id' => $booking->id,
                    'equipment_id' => $equipmentId,
                    'quantity_requested' => 1,
                ]);
            }
        }

        $this->command->info('✓ Created ' . count($bookings) . ' bookings from June 2025 to December 2025');
    }
}
