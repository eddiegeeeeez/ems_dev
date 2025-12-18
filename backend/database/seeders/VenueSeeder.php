<?php

namespace Database\Seeders;

use App\Models\Venue;
use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        $venues = [
            [
                'name' => 'Grand Auditorium',
                'description' => 'Our largest venue perfect for conferences, seminars, and major events. Features state-of-the-art audio-visual equipment and comfortable seating for up to 500 people.',
                'location' => 'Main Building, 3rd Floor',
                'capacity' => 500,
                'image_url' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
                'is_active' => true,
                'college_id' => 5, // CCE (CS)
            ],
            [
                'name' => 'Conference Room A',
                'description' => 'Modern conference room ideal for business meetings, presentations, and workshops. Equipped with video conferencing capabilities.',
                'location' => 'Admin Building, 2nd Floor',
                'capacity' => 50,
                'image_url' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                'is_active' => true,
                'college_id' => 4, // CBAE (BA)
            ],
            [
                'name' => 'Student Activity Hall',
                'description' => 'Versatile space for student organizations, club meetings, and social events. Features movable furniture for flexible arrangements.',
                'location' => 'Student Center, Ground Floor',
                'capacity' => 200,
                'image_url' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                'is_active' => true,
                'college_id' => 3, // CASE (LA)
            ],
            [
                'name' => 'Computer Lab 1',
                'description' => 'Fully equipped computer laboratory with 40 workstations. Perfect for workshops, training sessions, and hackathons.',
                'location' => 'CS Building, 1st Floor',
                'capacity' => 40,
                'image_url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
                'is_active' => true,
                'college_id' => 5, // CCE (CS)
            ],
            [
                'name' => 'Engineering Workshop',
                'description' => 'Spacious workshop area for engineering projects, demonstrations, and hands-on activities. Includes safety equipment and work benches.',
                'location' => 'Engineering Building, Ground Floor',
                'capacity' => 60,
                'image_url' => 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
                'is_active' => true,
                'college_id' => 7, // CEE (Eng)
            ],
            [
                'name' => 'Seminar Room B',
                'description' => 'Intimate setting for small group discussions, seminars, and study sessions. Comfortable seating and modern facilities.',
                'location' => 'Library Building, 3rd Floor',
                'capacity' => 30,
                'image_url' => 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800',
                'is_active' => true,
                'college_id' => 3, // CASE (LA)
            ],
            [
                'name' => 'Lecture Hall 101',
                'description' => 'Traditional lecture hall with tiered seating. Ideal for large classes, guest lectures, and academic presentations.',
                'location' => 'Academic Building, 1st Floor',
                'capacity' => 150,
                'image_url' => 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
                'is_active' => true,
                'college_id' => 10, // CTE (Edu)
            ],
            [
                'name' => 'Outdoor Pavilion',
                'description' => 'Open-air venue perfect for outdoor events, barbecues, and casual gatherings. Weather-dependent availability.',
                'location' => 'Campus Grounds, Near Parking Area',
                'capacity' => 100,
                'image_url' => 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
                'is_active' => true,
                'college_id' => 3, // CASE (LA)
            ],
            [
                'name' => 'Multimedia Studio',
                'description' => 'Professional recording and production studio. Perfect for video production, podcasts, and multimedia projects.',
                'location' => 'Media Arts Building, Basement',
                'capacity' => 15,
                'image_url' => 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
                'is_active' => true,
                'college_id' => 3, // CASE (LA)
            ],
            [
                'name' => 'Medical Simulation Lab',
                'description' => 'Advanced medical training facility with simulation equipment for health sciences programs.',
                'location' => 'Health Sciences Building, 2nd Floor',
                'capacity' => 25,
                'image_url' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
                'is_active' => true,
                'college_id' => 9, // CHSE (HS)
            ],
            [
                'name' => 'Business Innovation Hub',
                'description' => 'Collaborative workspace for entrepreneurship and business students. Includes meeting pods and presentation areas.',
                'location' => 'Business School, 4th Floor',
                'capacity' => 40,
                'image_url' => 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
                'is_active' => true,
                'college_id' => 4, // CBAE (BA)
            ],
            [
                'name' => 'Art Gallery Space',
                'description' => 'Elegant gallery space for art exhibitions, cultural events, and receptions. Adjustable lighting and display systems.',
                'location' => 'Arts Building, Main Gallery',
                'capacity' => 80,
                'image_url' => 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
                'is_active' => true,
                'college_id' => 3, // CASE (LA)
            ],
            [
                'name' => 'Sports Complex Meeting Room',
                'description' => 'Meeting room adjacent to sports facilities. Great for team meetings, coaching sessions, and sports-related events.',
                'location' => 'Sports Complex, 1st Floor',
                'capacity' => 35,
                'image_url' => 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=800',
                'is_active' => true,
                'college_id' => 10, // CTE (Edu)
            ],
            [
                'name' => 'Conference Room C (Under Maintenance)',
                'description' => 'Currently undergoing renovation to upgrade facilities. Expected to reopen next semester.',
                'location' => 'Admin Building, 3rd Floor',
                'capacity' => 45,
                'image_url' => 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800',
                'is_active' => false,
                'college_id' => 5, // CCE (CS)
            ],
        ];

        foreach ($venues as $venue) {
            Venue::create($venue);
        }

        // Generate 150 seeded random venues
        Venue::factory()->count(150)->create();
    }
}
