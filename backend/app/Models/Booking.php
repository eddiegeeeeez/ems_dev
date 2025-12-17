<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'venue_id',
        'event_title',
        'event_description',
        'start_datetime',
        'end_datetime',
        'expected_attendees',
        'status',
        'notes',
        'admin_notes',
        'rejection_reason',
        'total_cost',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'duration_in_hours',
        'qr_code',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (empty($booking->qr_code)) {
                // Generate unique QR code: UM-EVENT-{ID}-{RANDOM}
                $booking->qr_code = 'UM-EVENT-' . strtoupper(uniqid());
            }
        });
    }

    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime' => 'datetime',
    ];

    protected $appends = [
        'start_date',
        'end_date',
        'start_time',
        'end_time',
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

    // Accessor for start date
    public function getStartDateAttribute(): string
    {
        return $this->start_datetime ? Carbon::parse($this->start_datetime)->format('Y-m-d') : '';
    }

    // Accessor for end date
    public function getEndDateAttribute(): string
    {
        return $this->end_datetime ? Carbon::parse($this->end_datetime)->format('Y-m-d') : '';
    }

    // Accessor for start time
    public function getStartTimeAttribute(): string
    {
        return $this->start_datetime ? Carbon::parse($this->start_datetime)->format('H:i') : '';
    }

    // Accessor for end time
    public function getEndTimeAttribute(): string
    {
        return $this->end_datetime ? Carbon::parse($this->end_datetime)->format('H:i') : '';
    }





    public function getDurationInHoursAttribute(): float
    {
        return $this->start_datetime->diffInHours($this->end_datetime);
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
        return $query->where('start_datetime', '>', now());
    }
}
