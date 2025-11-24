<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'venue_id',
        'equipment_id',
        'title',
        'description',
        'priority',
        'status',
        'scheduled_date',
        'notes',
        'assigned_to',
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
    ];

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class)->withTrashed();
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function scopePriority($query, $level)
    {
        return $query->where('priority', $level);
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', ['open', 'in_progress']);
    }
}
