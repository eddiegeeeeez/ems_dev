<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'venue_id',
        'event_name',
        'event_description',
        'start_date',
        'end_date',
        'expected_attendees',
        'status',
        'rejection_reason',
        'reason',
        'notes',
        'total_cost',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'total_cost' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function equipment(): HasMany
    {
        return $this->hasMany(BookingEquipment::class);
    }

    public function feedback(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'related_booking_id');
    }

    public function getDurationInHoursAttribute(): float
    {
        return $this->start_date->diffInHours($this->end_date);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', now());
    }
}
