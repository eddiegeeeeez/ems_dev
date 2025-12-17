<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use App\Models\Booking;
use Carbon\Carbon;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // User must be authenticated
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'venue_id' => ['required', 'exists:venues,id'],
            'event_title' => ['required', 'string', 'min:3', 'max:255'],
            'event_description' => ['nullable', 'string', 'max:2000'],
            'start_datetime' => ['required', 'date', 'after:now'],
            'end_datetime' => ['required', 'date', 'after:start_datetime'],
            'expected_attendees' => ['required', 'integer', 'min:1', 'max:10000'],
            'equipment' => ['nullable', 'array'],
            'equipment.*.equipment_id' => ['required', 'exists:equipment,id'],
            'equipment.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'venue_id.required' => 'Please select a venue for your event.',
            'venue_id.exists' => 'The selected venue is not available.',
            'event_title.required' => 'Event title is required.',
            'event_title.min' => 'Event title must be at least 3 characters.',
            'start_datetime.required' => 'Start date and time is required.',
            'start_datetime.after' => 'Event must be scheduled for a future date.',
            'end_datetime.after' => 'End time must be after start time.',
            'expected_attendees.required' => 'Please specify the number of expected attendees.',
            'expected_attendees.min' => 'There must be at least 1 attendee.',
            'equipment.*.equipment_id.exists' => 'Selected equipment is not available.',
            'equipment.*.quantity.min' => 'Equipment quantity must be at least 1.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            // Check for venue availability conflicts
            $this->validateVenueAvailability($validator);
            
            // Check equipment availability
            $this->validateEquipmentAvailability($validator);
            
            // Validate booking duration (not too long)
            $this->validateBookingDuration($validator);
        });
    }

    /**
     * Check if venue is available for the requested time slot
     */
    protected function validateVenueAvailability($validator): void
    {
        if (!$this->venue_id || !$this->start_datetime || !$this->end_datetime) {
            return;
        }

        $conflictingBooking = Booking::where('venue_id', $this->venue_id)
            ->where('status', '!=', 'rejected')
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) {
                $query->whereBetween('start_datetime', [$this->start_datetime, $this->end_datetime])
                    ->orWhereBetween('end_datetime', [$this->start_datetime, $this->end_datetime])
                    ->orWhere(function ($q) {
                        $q->where('start_datetime', '<=', $this->start_datetime)
                          ->where('end_datetime', '>=', $this->end_datetime);
                    });
            })
            ->first();

        if ($conflictingBooking) {
            $validator->errors()->add('venue_id', 'This venue is already booked for the selected time period.');
        }
    }

    /**
     * Check if requested equipment is available in sufficient quantity
     */
    protected function validateEquipmentAvailability($validator): void
    {
        if (!$this->equipment || !is_array($this->equipment)) {
            return;
        }

        foreach ($this->equipment as $index => $item) {
            if (!isset($item['equipment_id']) || !isset($item['quantity'])) {
                continue;
            }

            $equipment = \App\Models\Equipment::find($item['equipment_id']);
            
            if (!$equipment) {
                continue;
            }

            if ($item['quantity'] > $equipment->available_quantity) {
                $validator->errors()->add(
                    "equipment.{$index}.quantity",
                    "Only {$equipment->available_quantity} units of {$equipment->name} are available. You requested {$item['quantity']}."
                );
            }
        }
    }

    /**
     * Validate booking duration is reasonable (max 7 days)
     */
    protected function validateBookingDuration($validator): void
    {
        if (!$this->start_datetime || !$this->end_datetime) {
            return;
        }

        $start = Carbon::parse($this->start_datetime);
        $end = Carbon::parse($this->end_datetime);
        $durationInDays = $start->diffInDays($end);

        if ($durationInDays > 7) {
            $validator->errors()->add('end_datetime', 'Booking duration cannot exceed 7 days. Please book multiple slots if needed.');
        }

        // Minimum 30 minutes
        $durationInMinutes = $start->diffInMinutes($end);
        if ($durationInMinutes < 30) {
            $validator->errors()->add('end_datetime', 'Booking duration must be at least 30 minutes.');
        }
    }
}
