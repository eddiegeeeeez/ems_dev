<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'college',
        'head_of_department',
        'total_members',
        'active_events',
    ];

    public function venues(): HasMany
    {
        return $this->hasMany(Venue::class);
    }

    public function equipment(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    // Accessor for frontend compatibility
    public function getCollegeAttribute(): string
    {
        return $this->description ?? 'General';
    }

    public function getHeadOfDepartmentAttribute(): string
    {
        $headUser = $this->users()->where('role', 'ADMIN')->first();
        return $headUser ? $headUser->name : 'Unassigned';
    }

    public function getTotalMembersAttribute(): int
    {
        return $this->users_count ?? $this->users()->count();
    }

    public function getActiveEventsAttribute(): int
    {
        return $this->venues_count ?? $this->venues()->count();
    }
}

