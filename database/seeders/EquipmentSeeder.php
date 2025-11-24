<?php

namespace Database\Seeders;

use App\Models\Equipment;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    public function run(): void
    {
        $equipment = [
            // Audio/Visual Equipment - Computer Science Department
            ['name' => 'Wireless Microphone', 'description' => 'Professional wireless microphone system', 'category' => 'Audio', 'quantity' => 10, 'available_quantity' => 8, 'rental_rate_per_unit' => 15.00, 'department_id' => 1],
            ['name' => 'Portable Speakers', 'description' => 'High-quality portable speaker system', 'category' => 'Audio', 'quantity' => 8, 'available_quantity' => 6, 'rental_rate_per_unit' => 25.00, 'department_id' => 1],
            ['name' => 'Projector (4K)', 'description' => '4K resolution projector', 'category' => 'Visual', 'quantity' => 5, 'available_quantity' => 4, 'rental_rate_per_unit' => 50.00, 'department_id' => 1],
            ['name' => 'Projection Screen', 'description' => 'Portable projection screen', 'category' => 'Visual', 'quantity' => 6, 'available_quantity' => 5, 'rental_rate_per_unit' => 10.00, 'department_id' => 1],
            ['name' => 'Laptop (Presentation)', 'description' => 'Presentation laptop with HDMI', 'category' => 'Computers', 'quantity' => 4, 'available_quantity' => 3, 'rental_rate_per_unit' => 30.00, 'department_id' => 1],
            
            // Engineering Equipment
            ['name' => 'Engineering Toolkits', 'description' => 'Complete engineering tool sets', 'category' => 'Tools', 'quantity' => 10, 'available_quantity' => 8, 'rental_rate_per_unit' => 20.00, 'department_id' => 2],
            ['name' => 'Safety Goggles', 'description' => 'Protective safety goggles', 'category' => 'Safety', 'quantity' => 30, 'available_quantity' => 25, 'rental_rate_per_unit' => 2.00, 'department_id' => 2],
            ['name' => 'WiFi Router (High Capacity)', 'description' => 'Enterprise-grade WiFi router', 'category' => 'Network', 'quantity' => 8, 'available_quantity' => 7, 'rental_rate_per_unit' => 15.00, 'department_id' => 2],
            
            // Business Administration Equipment
            ['name' => 'Folding Tables', 'description' => '6-foot folding tables', 'category' => 'Furniture', 'quantity' => 50, 'available_quantity' => 45, 'rental_rate_per_unit' => 5.00, 'department_id' => 3],
            ['name' => 'Folding Chairs', 'description' => 'Comfortable folding chairs', 'category' => 'Furniture', 'quantity' => 200, 'available_quantity' => 180, 'rental_rate_per_unit' => 2.00, 'department_id' => 3],
            ['name' => 'Banner Stands', 'description' => 'Retractable banner stands', 'category' => 'Display', 'quantity' => 10, 'available_quantity' => 8, 'rental_rate_per_unit' => 12.00, 'department_id' => 3],
            
            // Liberal Arts Equipment
            ['name' => 'Whiteboard (Portable)', 'description' => 'Large portable whiteboard', 'category' => 'Furniture', 'quantity' => 15, 'available_quantity' => 12, 'rental_rate_per_unit' => 8.00, 'department_id' => 4],
            ['name' => 'Podium', 'description' => 'Wooden podium with microphone mount', 'category' => 'Furniture', 'quantity' => 5, 'available_quantity' => 4, 'rental_rate_per_unit' => 10.00, 'department_id' => 4],
            ['name' => 'Flip Charts', 'description' => 'Portable flip chart stands', 'category' => 'Presentation', 'quantity' => 15, 'available_quantity' => 12, 'rental_rate_per_unit' => 5.00, 'department_id' => 4],
            
            // Education Equipment
            ['name' => 'Video Camera', 'description' => 'Professional video recording camera', 'category' => 'Visual', 'quantity' => 3, 'available_quantity' => 2, 'rental_rate_per_unit' => 40.00, 'department_id' => 5],
            ['name' => 'Green Screen', 'description' => 'Portable green screen backdrop', 'category' => 'Visual', 'quantity' => 2, 'available_quantity' => 2, 'rental_rate_per_unit' => 15.00, 'department_id' => 5],
            ['name' => 'Ring Light', 'description' => 'Professional photography ring light', 'category' => 'Lighting', 'quantity' => 4, 'available_quantity' => 3, 'rental_rate_per_unit' => 10.00, 'department_id' => 5],
            
            // Health Sciences Equipment
            ['name' => 'Medical Mannequins', 'description' => 'Training medical mannequins', 'category' => 'Medical', 'quantity' => 8, 'available_quantity' => 7, 'rental_rate_per_unit' => 50.00, 'department_id' => 6],
            ['name' => 'Defibrillator Trainer', 'description' => 'AED training device', 'category' => 'Medical', 'quantity' => 5, 'available_quantity' => 4, 'rental_rate_per_unit' => 30.00, 'department_id' => 6],
            
            // Shared Equipment (Computer Science manages these)
            ['name' => 'LED Stage Lights', 'description' => 'Programmable LED stage lighting', 'category' => 'Lighting', 'quantity' => 12, 'available_quantity' => 10, 'rental_rate_per_unit' => 20.00, 'department_id' => 1],
            ['name' => 'Extension Cords (25ft)', 'description' => 'Heavy-duty extension cords', 'category' => 'Electrical', 'quantity' => 30, 'available_quantity' => 25, 'rental_rate_per_unit' => 2.00, 'department_id' => 1],
            ['name' => 'Power Strip (6 Outlet)', 'description' => 'Surge-protected power strips', 'category' => 'Electrical', 'quantity' => 25, 'available_quantity' => 20, 'rental_rate_per_unit' => 3.00, 'department_id' => 1],
            ['name' => 'HDMI Cables', 'description' => 'Various length HDMI cables', 'category' => 'Cables', 'quantity' => 40, 'available_quantity' => 35, 'rental_rate_per_unit' => 5.00, 'department_id' => 1],
            ['name' => 'Exhibition Panels', 'description' => 'Modular display panels', 'category' => 'Furniture', 'quantity' => 20, 'available_quantity' => 18, 'rental_rate_per_unit' => 8.00, 'department_id' => 3],
            ['name' => 'Easels', 'description' => 'Adjustable display easels', 'category' => 'Display', 'quantity' => 12, 'available_quantity' => 10, 'rental_rate_per_unit' => 5.00, 'department_id' => 4],
            ['name' => 'Registration Table', 'description' => 'Portable registration desk', 'category' => 'Furniture', 'quantity' => 5, 'available_quantity' => 4, 'rental_rate_per_unit' => 10.00, 'department_id' => 3],
            ['name' => 'Stanchions & Ropes', 'description' => 'Crowd control stanchions', 'category' => 'Safety', 'quantity' => 20, 'available_quantity' => 18, 'rental_rate_per_unit' => 3.00, 'department_id' => 3],
            ['name' => 'Markers & Supplies', 'description' => 'Whiteboard markers and supplies', 'category' => 'Supplies', 'quantity' => 50, 'available_quantity' => 40, 'rental_rate_per_unit' => 1.00, 'department_id' => 4],
            ['name' => 'Name Badge Printer', 'description' => 'Thermal badge printer', 'category' => 'Technology', 'quantity' => 3, 'available_quantity' => 2, 'rental_rate_per_unit' => 15.00, 'department_id' => 1],
            ['name' => 'Coffee Maker (Large)', 'description' => 'Industrial coffee maker', 'category' => 'Catering', 'quantity' => 4, 'available_quantity' => 3, 'rental_rate_per_unit' => 20.00, 'department_id' => 3],
            ['name' => 'Water Dispensers', 'description' => 'Hot/cold water dispensers', 'category' => 'Catering', 'quantity' => 10, 'available_quantity' => 8, 'rental_rate_per_unit' => 10.00, 'department_id' => 3],
            ['name' => 'Serving Tables', 'description' => 'Buffet-style serving tables', 'category' => 'Catering', 'quantity' => 8, 'available_quantity' => 7, 'rental_rate_per_unit' => 8.00, 'department_id' => 3],
            
            // Low stock items (for testing alerts)
            ['name' => 'Lapel Microphones', 'description' => 'Wireless lapel microphones', 'category' => 'Audio', 'quantity' => 3, 'available_quantity' => 1, 'rental_rate_per_unit' => 12.00, 'department_id' => 1],
            ['name' => 'Laser Pointers', 'description' => 'Presentation laser pointers', 'category' => 'Presentation', 'quantity' => 2, 'available_quantity' => 0, 'rental_rate_per_unit' => 5.00, 'department_id' => 4],
        ];

        foreach ($equipment as $item) {
            Equipment::create($item);
        }
    }
}
