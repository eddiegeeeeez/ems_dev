<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Venue>
 */
class VenueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->company() . ' Hall',
            'description' => fake()->paragraph(),
            'location' => fake()->address(),
            'capacity' => fake()->numberBetween(20, 500),
            'image_url' => 'venues/default.jpg',
            'is_active' => fake()->boolean(90),
            'college_id' => \App\Models\College::inRandomOrder()->first()?->id ?? 1,
        ];
    }
}
