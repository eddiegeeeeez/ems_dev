@component('mail::message')
# Booking Approved

Dear {{ $booking->user->name }},

Your booking request has been **approved**!

**Event Details:**
- **Event Name:** {{ $booking->event_name }}
- **Venue:** {{ $booking->venue->name }}
- **Date:** {{ $booking->start_date->format('F d, Y') }}
- **Time:** {{ \App\Http\Controllers\DashboardController::formatTo12Hour($booking->start_date->format('H:i')) }} - {{ \App\Http\Controllers\DashboardController::formatTo12Hour($booking->end_date->format('H:i')) }}
- **Expected Attendees:** {{ $booking->expected_attendees }}

@if($booking->notes)
**Admin Notes:**
{{ $booking->notes }}
@endif

Please ensure all necessary preparations are completed before the event date.

If you have any questions, please contact the Facilities Management team.

@component('mail::button', ['url' => config('app.url') . '/my-bookings'])
View Your Booking
@endcomponent

Thanks,
{{ config('app.name') }}
@endcomponent
