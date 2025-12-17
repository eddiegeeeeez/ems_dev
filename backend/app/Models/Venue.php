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
        'is_active',
        'college_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function equipment(): HasMany
    {
        return $this->hasMany(Equipment::class);
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
