<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'quantity',
        'available_quantity',
        'rental_rate_per_unit',
        'is_active',
        'department_id',
    ];

    protected $casts = [
        'rental_rate_per_unit' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(BookingEquipment::class);
    }

    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }
}
