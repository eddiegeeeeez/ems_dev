<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Venue;
use App\Models\College;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipment>
 */
class EquipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 50);
        return [
            'name' => fake()->words(2, true), // e.g. "Projector screen"
            'description' => fake()->sentence(),
            'quantity' => $quantity,
            'available_quantity' => $quantity, // Initially same as total
            'category' => fake()->randomElement(['Audio', 'Visual', 'Furniture', 'Electronics', 'Lighting']),
            // Note: relationships (venue_id, college_id) should be passed or random if needed, 
            // but usually strictly controlled in Seeder if we want valid FKs.
            // We'll leave them nullable here or generated if called standalone.
            'college_id' => College::inRandomOrder()->first()?->id ?? 1, 
            'venue_id' => Venue::inRandomOrder()->first()?->id,
        ];
    }
}
