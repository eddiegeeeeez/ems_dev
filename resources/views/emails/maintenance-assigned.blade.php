@component('mail::message')
# Maintenance Request Assigned

Dear Technician,

A maintenance request has been assigned to you.

**Request Details:**
- **Title:** {{ $maintenance->title }}
- **Description:** {{ $maintenance->description }}
- **Venue:** {{ $maintenance->venue->name }}
- **Priority:** {{ ucfirst($maintenance->priority) }}
- **Status:** {{ ucfirst($maintenance->status) }}
- **Reported By:** {{ $maintenance->user->name }}

**Contact Information:**
- **Email:** {{ $maintenance->user->email }}
- **Phone:** {{ $maintenance->user->phone ?? 'Not provided' }}

@component('mail::button', ['url' => config('app.url') . '/admin/maintenance/requests/' . $maintenance->id])
View Request Details
@endcomponent

Please prioritize this request based on its urgency level. Update the status as you work on the maintenance task.

Thanks,
{{ config('app.name') }}
@endcomponent
