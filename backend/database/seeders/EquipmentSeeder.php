<?php

namespace Database\Seeders;

use App\Models\Equipment;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    public function run(): void
    {
        $equipment = [
            // Audio/Visual Equipment - Computer Science Department (CCE)
            ['name' => 'Wireless Microphone', 'description' => 'Professional wireless microphone system', 'category' => 'Audio', 'quantity' => 10, 'available_quantity' => 8, 'college_id' => 5],
            ['name' => 'Portable Speakers', 'description' => 'High-quality portable speaker system', 'category' => 'Audio', 'quantity' => 8, 'available_quantity' => 6, 'college_id' => 5],
            ['name' => 'Projector (4K)', 'description' => '4K resolution projector', 'category' => 'Visual', 'quantity' => 5, 'available_quantity' => 4, 'college_id' => 5],
            ['name' => 'Projection Screen', 'description' => 'Portable projection screen', 'category' => 'Visual', 'quantity' => 6, 'available_quantity' => 5, 'college_id' => 5],
            ['name' => 'Laptop (Presentation)', 'description' => 'Presentation laptop with HDMI', 'category' => 'Computers', 'quantity' => 4, 'available_quantity' => 3, 'college_id' => 5],
            
            // Engineering Equipment (CEE)
            ['name' => 'Engineering Toolkits', 'description' => 'Complete engineering tool sets', 'category' => 'Tools', 'quantity' => 10, 'available_quantity' => 8, 'college_id' => 7],
            ['name' => 'Safety Goggles', 'description' => 'Protective safety goggles', 'category' => 'Safety', 'quantity' => 30, 'available_quantity' => 25, 'college_id' => 7],
            ['name' => 'WiFi Router (High Capacity)', 'description' => 'Enterprise-grade WiFi router', 'category' => 'Network', 'quantity' => 8, 'available_quantity' => 7, 'college_id' => 7],
            
            // Business Administration Equipment (CBAE)
            ['name' => 'Folding Tables', 'description' => '6-foot folding tables', 'category' => 'Furniture', 'quantity' => 50, 'available_quantity' => 45, 'college_id' => 4],
            ['name' => 'Folding Chairs', 'description' => 'Comfortable folding chairs', 'category' => 'Furniture', 'quantity' => 200, 'available_quantity' => 180, 'college_id' => 4],
            ['name' => 'Banner Stands', 'description' => 'Retractable banner stands', 'category' => 'Display', 'quantity' => 10, 'available_quantity' => 8, 'college_id' => 4],
            
            // Liberal Arts Equipment (CASE)
            ['name' => 'Whiteboard (Portable)', 'description' => 'Large portable whiteboard', 'category' => 'Furniture', 'quantity' => 15, 'available_quantity' => 12, 'college_id' => 3],
            ['name' => 'Podium', 'description' => 'Wooden podium with microphone mount', 'category' => 'Furniture', 'quantity' => 5, 'available_quantity' => 4, 'college_id' => 3],
            ['name' => 'Flip Charts', 'description' => 'Portable flip chart stands', 'category' => 'Presentation', 'quantity' => 15, 'available_quantity' => 12, 'college_id' => 3],
            
            // Education Equipment (CTE)
            ['name' => 'Video Camera', 'description' => 'Professional video recording camera', 'category' => 'Visual', 'quantity' => 3, 'available_quantity' => 2, 'college_id' => 10],
            ['name' => 'Green Screen', 'description' => 'Portable green screen backdrop', 'category' => 'Visual', 'quantity' => 2, 'available_quantity' => 2, 'college_id' => 10],
            ['name' => 'Ring Light', 'description' => 'Professional photography ring light', 'category' => 'Lighting', 'quantity' => 4, 'available_quantity' => 3, 'college_id' => 10],
            
            // Health Sciences Equipment (CHSE)
            ['name' => 'Medical Mannequins', 'description' => 'Training medical mannequins', 'category' => 'Medical', 'quantity' => 8, 'available_quantity' => 7, 'college_id' => 9],
            ['name' => 'Defibrillator Trainer', 'description' => 'AED training device', 'category' => 'Medical', 'quantity' => 5, 'available_quantity' => 4, 'college_id' => 9],
            
            // Shared Equipment (Computer Science manages these)
            ['name' => 'LED Stage Lights', 'description' => 'Programmable LED stage lighting', 'category' => 'Lighting', 'quantity' => 12, 'available_quantity' => 10, 'college_id' => 5],
            ['name' => 'Extension Cords (25ft)', 'description' => 'Heavy-duty extension cords', 'category' => 'Electrical', 'quantity' => 30, 'available_quantity' => 25, 'college_id' => 5],
            ['name' => 'Power Strip (6 Outlet)', 'description' => 'Surge-protected power strips', 'category' => 'Electrical', 'quantity' => 25, 'available_quantity' => 20, 'college_id' => 5],
            ['name' => 'HDMI Cables', 'description' => 'Various length HDMI cables', 'category' => 'Cables', 'quantity' => 40, 'available_quantity' => 35, 'college_id' => 5],
            ['name' => 'Exhibition Panels', 'description' => 'Modular display panels', 'category' => 'Furniture', 'quantity' => 20, 'available_quantity' => 18, 'college_id' => 4],
            ['name' => 'Easels', 'description' => 'Adjustable display easels', 'category' => 'Display', 'quantity' => 12, 'available_quantity' => 10, 'college_id' => 3],
            ['name' => 'Registration Table', 'description' => 'Portable registration desk', 'category' => 'Furniture', 'quantity' => 5, 'available_quantity' => 4, 'college_id' => 4],
            ['name' => 'Stanchions & Ropes', 'description' => 'Crowd control stanchions', 'category' => 'Safety', 'quantity' => 20, 'available_quantity' => 18, 'college_id' => 4],
            ['name' => 'Markers & Supplies', 'description' => 'Whiteboard markers and supplies', 'category' => 'Supplies', 'quantity' => 50, 'available_quantity' => 40, 'college_id' => 3],
            ['name' => 'Name Badge Printer', 'description' => 'Thermal badge printer', 'category' => 'Technology', 'quantity' => 3, 'available_quantity' => 2, 'college_id' => 5],
            ['name' => 'Coffee Maker (Large)', 'description' => 'Industrial coffee maker', 'category' => 'Catering', 'quantity' => 4, 'available_quantity' => 3, 'college_id' => 4],
            ['name' => 'Water Dispensers', 'description' => 'Hot/cold water dispensers', 'category' => 'Catering', 'quantity' => 10, 'available_quantity' => 8, 'college_id' => 4],
            ['name' => 'Serving Tables', 'description' => 'Buffet-style serving tables', 'category' => 'Catering', 'quantity' => 8, 'available_quantity' => 7, 'college_id' => 4],
            
            // Low stock items (for testing alerts)
            ['name' => 'Lapel Microphones', 'description' => 'Wireless lapel microphones', 'category' => 'Audio', 'quantity' => 3, 'available_quantity' => 1, 'college_id' => 5],
            ['name' => 'Laser Pointers', 'description' => 'Presentation laser pointers', 'category' => 'Presentation', 'quantity' => 2, 'available_quantity' => 0, 'college_id' => 3],
        ];

        foreach ($equipment as $item) {
            Equipment::create($item);
        }

        // Generate 150 seeded random equipment items
        Equipment::factory()->count(150)->create();
    }
}
