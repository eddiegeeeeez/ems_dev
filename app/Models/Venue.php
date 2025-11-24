<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'location',
        'capacity',
        'image_url',
        'amenities',
        'opening_hours',
        'hourly_rate',
        'is_active',
        'department_id',
    ];

    protected $casts = [
        'amenities' => 'array',
        'opening_hours' => 'array',
        'hourly_rate' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    public function getAvailabilityAttribute()
    {
        $totalCapacity = $this->capacity;
        $bookedDates = $this->bookings()
            ->where('status', 'approved')
            ->whereBetween('start_datetime', [now(), now()->addMonth()])
            ->pluck('start_datetime', 'end_datetime')
            ->toArray();

        return [
            'total_capacity' => $totalCapacity,
            'booked_dates' => $bookedDates,
        ];
    }
}
