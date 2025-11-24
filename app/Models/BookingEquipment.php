<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingEquipment extends Model
{
    use HasFactory;

    protected $table = 'booking_equipment';
    protected $fillable = [
        'booking_id',
        'equipment_id',
        'quantity_requested',
        'rate_per_unit',
        'subtotal',
    ];

    protected $casts = [
        'rate_per_unit' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }
}
