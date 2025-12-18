<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate flexible dates (past or future)
        $start = fake()->dateTimeBetween('-1 month', '+2 months');
        $end = Carbon::instance($start)->addHours(fake()->numberBetween(1, 4));

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? 1,
            'venue_id' => Venue::inRandomOrder()->first()?->id ?? 1,
            'event_title' => fake()->sentence(3),
            'event_description' => fake()->paragraph(),
            'start_datetime' => $start,
            'end_datetime' => $end,
            'expected_attendees' => fake()->numberBetween(10, 100),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected', 'cancelled']),
            'documents' => [], // Placeholder
        ];
    }
}
