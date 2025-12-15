@component('mail::message')
# New Booking Request

Dear Admin,

A new booking request has been submitted and requires your review.

**Organizer Details:**
- **Name:** {{ $booking->user->name }}
- **Email:** {{ $booking->user->email }}
- **Department:** {{ $booking->user->department ?? 'Not specified' }}

**Event Details:**
- **Event Name:** {{ $booking->event_name }}
- **Description:** {{ $booking->event_description }}
- **Requested Venue:** {{ $booking->venue->name }}
- **Date:** {{ $booking->start_date->format('F d, Y') }}
- **Time:** {{ $booking->start_date->format('H:i') }} - {{ $booking->end_date->format('H:i') }}
- **Expected Attendees:** {{ $booking->expected_attendees }}

@component('mail::button', ['url' => config('app.url') . '/admin/requests/' . $booking->id])
Review Booking Request
@endcomponent

Please review and approve or reject this booking request as soon as possible.

Thanks,
{{ config('app.name') }}
@endcomponent
