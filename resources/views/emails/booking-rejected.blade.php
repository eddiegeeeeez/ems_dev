@component('mail::message')
# Booking Rejected

Dear {{ $booking->user->name }},

Unfortunately, your booking request has been **rejected**.

**Event Details:**
- **Event Name:** {{ $booking->event_name }}
- **Venue:** {{ $booking->venue->name }}
- **Requested Date:** {{ $booking->start_date->format('F d, Y') }}

**Rejection Reason:**
{{ $booking->rejection_reason ?? 'No reason provided' }}

You may submit a new booking request with different dates or venue if needed.

@component('mail::button', ['url' => config('app.url') . '/venues'])
Browse Available Venues
@endcomponent

If you have questions about this decision, please contact the Facilities Management team.

Thanks,
{{ config('app.name') }}
@endcomponent
