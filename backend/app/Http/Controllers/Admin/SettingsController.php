<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class SettingsController extends Controller
{
    private function sampleTemplateData(): array
    {
        return [
            'organizerName' => 'Jane Doe',
            'venueName' => 'University Conference Hall',
            'eventTitle' => 'Sample Event Title',
            'eventDate' => now()->addDays(3)->format('F j, Y'),
            'eventTime' => '10:00 AM - 12:00 PM',
            'attendees' => '50',
            'rejectionReason' => 'Schedule conflict with another event',
            'userName' => 'John Smith',
        ];
    }

    private function renderTemplateFields(array $template): array
    {
        $replacements = $this->sampleTemplateData();
        $search = array_map(function ($key) {
            return '{{' . $key . '}}';
        }, array_keys($replacements));
        $replace = array_values($replacements);

        return [
            'subject' => str_replace($search, $replace, $template['subject'] ?? ''),
            'preheader' => str_replace($search, $replace, $template['preheader'] ?? ''),
            'body' => str_replace($search, $replace, $template['body'] ?? ''),
            'footer' => str_replace($search, $replace, $template['footer'] ?? ''),
        ];
    }

    /**
     * Get booking rules settings.
     */
    public function bookingRules(): JsonResponse
    {
        try {
            $settings = [
                'require_approval' => Cache::get('require_approval', true),
                'approval_deadline_hours' => Cache::get('approval_deadline_hours', 48),
                'auto_reject_hours' => Cache::get('auto_reject_hours', 72),
                'max_advance_booking_days' => Cache::get('max_advance_booking_days', 90),
                'min_booking_duration' => Cache::get('min_booking_duration', 1),
                'max_booking_duration' => Cache::get('max_booking_duration', 8),
                'operating_hours_start' => Cache::get('operating_hours_start', '07:00'),
                'operating_hours_end' => Cache::get('operating_hours_end', '22:00'),
                'min_advance_notice_hours' => Cache::get('min_advance_notice_hours', 24),
                'allow_cancellation' => Cache::get('allow_cancellation', true),
                'cancellation_deadline_hours' => Cache::get('cancellation_deadline_hours', 24),
                'require_documents' => Cache::get('require_documents', true),
                'document_deadline_days' => Cache::get('document_deadline_days', 3),
                'equipment_request_deadline_days' => Cache::get('equipment_request_deadline_days', 3),
            ];

            return response()->json(['settings' => $settings]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch booking rules'], 500);
        }
    }

    /**
     * Update booking rules.
     */
    public function updateBookingRules(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'require_approval' => 'boolean',
                'approval_deadline_hours' => 'required|integer|min:1',
                'auto_reject_hours' => 'required|integer|min:1',
                'max_advance_booking_days' => 'required|integer|min:1',
                'min_booking_duration' => 'required|integer|min:1',
                'max_booking_duration' => 'required|integer|min:1',
                'operating_hours_start' => 'required|date_format:H:i',
                'operating_hours_end' => 'required|date_format:H:i',
                'min_advance_notice_hours' => 'required|integer|min:0',
                'allow_cancellation' => 'boolean',
                'cancellation_deadline_hours' => 'required|integer|min:1',
                'require_documents' => 'boolean',
                'document_deadline_days' => 'required|integer|min:1',
                'equipment_request_deadline_days' => 'required|integer|min:1',
            ]);

            // Verify password
            if (!\Hash::check($validated['current_password'], $request->user()->password)) {
                 return response()->json(['error' => 'Incorrect password provided'], 403);
            }

            // Remove password from data to save
            unset($validated['current_password']);

            foreach ($validated as $key => $value) {
                Cache::put($key, $value);
            }

            return response()->json(['message' => 'Booking rules updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update booking rules'], 500);
        }
    }

    /**
     * Get email templates settings.
     */
    public function emailTemplates(): JsonResponse
    {
        try {
            $templates = [
                'booking_approved' => [
                    'subject' => Cache::get('email_template_booking_approved_subject', 'Your Booking Request Has Been Approved'),
                    'preheader' => Cache::get('email_template_booking_approved_preheader', 'Your event venue booking at UM has been confirmed'),
                    'body' => Cache::get('email_template_booking_approved_body', 'Dear {{organizerName}},

We are pleased to inform you that your booking request for {{venueName}} has been approved!

Event Details:
- Event: {{eventTitle}}
- Date: {{eventDate}}
- Time: {{eventTime}}
- Venue: {{venueName}}
- Expected Attendees: {{attendees}}

Please review your booking details in the Events Management System. If you need to make any changes, please contact us at least 24 hours before your event.

Important reminders:
1. Arrive at least 30 minutes before your event starts
2. Ensure all equipment is returned in good condition
3. Leave the venue clean and organized

If you have any questions, please don\'t hesitate to contact us.

Best regards,
University of Mindanao
Events Management Team'),
                    'footer' => Cache::get('email_template_booking_approved_footer', 'This is an automated message from the UM Events Management System. Please do not reply to this email.'),
                ],
                'booking_rejected' => [
                    'subject' => Cache::get('email_template_booking_rejected_subject', 'Your Booking Request Has Been Declined'),
                    'preheader' => Cache::get('email_template_booking_rejected_preheader', 'Your booking request could not be approved'),
                    'body' => Cache::get('email_template_booking_rejected_body', 'Dear {{organizerName}},

Unfortunately, your booking request for {{venueName}} has been declined.

Event Details:
- Event: {{eventTitle}}
- Date: {{eventDate}}
- Time: {{eventTime}}
- Venue: {{venueName}}

Reason for Rejection: {{rejectionReason}}

You may submit a new booking request for alternative dates or venues. Please contact the Events Management team if you have any questions.

Best regards,
University of Mindanao
Events Management Team'),
                    'footer' => Cache::get('email_template_booking_rejected_footer', 'This is an automated message from the UM Events Management System. Please do not reply to this email.'),
                ],
                'booking_pending' => [
                    'subject' => Cache::get('email_template_booking_pending_subject', 'Your Booking Request is Under Review'),
                    'preheader' => Cache::get('email_template_booking_pending_preheader', 'We have received your booking request and are reviewing it'),
                    'body' => Cache::get('email_template_booking_pending_body', 'Dear {{organizerName}},

Thank you for submitting your booking request. We have received it and are currently reviewing your details.

Event Details:
- Event: {{eventTitle}}
- Date: {{eventDate}}
- Time: {{eventTime}}
- Venue: {{venueName}}

You will receive an email notification once your request has been approved or declined.

Best regards,
University of Mindanao
Events Management Team'),
                    'footer' => Cache::get('email_template_booking_pending_footer', 'This is an automated message from the UM Events Management System. Please do not reply to this email.'),
                ],
                'booking_cancelled' => [
                    'subject' => Cache::get('email_template_booking_cancelled_subject', 'Your Booking Has Been Cancelled'),
                    'preheader' => Cache::get('email_template_booking_cancelled_preheader', 'Your event booking cancellation confirmation'),
                    'body' => Cache::get('email_template_booking_cancelled_body', 'Dear {{organizerName}},

Your booking has been successfully cancelled.

Cancelled Event Details:
- Event: {{eventTitle}}
- Date: {{eventDate}}
- Time: {{eventTime}}
- Venue: {{venueName}}

If you need to rebook or have any questions, please feel free to contact us.

Best regards,
University of Mindanao
Events Management Team'),
                    'footer' => Cache::get('email_template_booking_cancelled_footer', 'This is an automated message from the UM Events Management System. Please do not reply to this email.'),
                ],
                'booking_reminder' => [
                    'subject' => Cache::get('email_template_booking_reminder_subject', 'Reminder: Your Event is Coming Up'),
                    'preheader' => Cache::get('email_template_booking_reminder_preheader', '{{eventTitle}} is scheduled for {{eventDate}}'),
                    'body' => Cache::get('email_template_booking_reminder_body', 'Dear {{organizerName}},

This is a friendly reminder that your event is coming up soon!

Event Details:
- Event: {{eventTitle}}
- Date: {{eventDate}}
- Time: {{eventTime}}
- Venue: {{venueName}}

Please ensure you arrive at least 30 minutes before the scheduled time. If you need to make any changes, please contact us immediately.

Best regards,
University of Mindanao
Events Management Team'),
                    'footer' => Cache::get('email_template_booking_reminder_footer', 'This is an automated message from the UM Events Management System. Please do not reply to this email.'),
                ],
            ];

            return response()->json(['templates' => $templates]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch email templates'], 500);
        }
    }

    /**
     * Update email template.
     */
    public function updateEmailTemplate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'template_name' => 'required|string',
                'subject' => 'required|string',
                'preheader' => 'nullable|string',
                'body' => 'required|string',
                'footer' => 'nullable|string',
                'otp' => 'required|string|size:6',
            ]);

            $user = $request->user();
            $cachedOtp = Cache::get("email_template_otp_{$user->id}");

            if (! $cachedOtp || $cachedOtp !== $validated['otp']) {
                return response()->json(['error' => 'Invalid or expired OTP'], 422);
            }

            Cache::put("email_template_{$validated['template_name']}_subject", $validated['subject']);
            Cache::put("email_template_{$validated['template_name']}_preheader", $validated['preheader'] ?? '');
            Cache::put("email_template_{$validated['template_name']}_body", $validated['body']);
            Cache::put("email_template_{$validated['template_name']}_footer", $validated['footer'] ?? '');

            Cache::forget("email_template_otp_{$user->id}");

            return response()->json(['message' => 'Email template updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update email template'], 500);
        }
    }

    /**
     * Send OTP to current user for template updates.
     */
    public function requestEmailTemplateOtp(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            Cache::put("email_template_otp_{$user->id}", $otp, now()->addMinutes(10));

            Mail::raw("Your email template verification code is: {$otp}. This code expires in 10 minutes.", function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Email Template Change Verification');
            });

            return response()->json(['message' => 'OTP sent to your email']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send OTP'], 500);
        }
    }

    /**
     * Preview a template with sample data substitutions.
     */
    public function previewEmailTemplate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'template_name' => 'required|string',
                'subject' => 'required|string',
                'preheader' => 'nullable|string',
                'body' => 'required|string',
                'footer' => 'nullable|string',
            ]);

            $rendered = $this->renderTemplateFields($validated);

            return response()->json([
                'preview' => $rendered,
                'placeholders' => $this->sampleTemplateData(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate preview'], 500);
        }
    }

    /**
     * Send a test email using the provided template fields.
     */
    public function sendTestEmail(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'template_name' => 'required|string',
                'subject' => 'required|string',
                'preheader' => 'nullable|string',
                'body' => 'required|string',
                'footer' => 'nullable|string',
            ]);

            $rendered = $this->renderTemplateFields($validated);
            $user = $request->user();

            $emailBody = trim($rendered['preheader'] . "\n\n" . $rendered['body'] . "\n\n" . $rendered['footer']);

            Mail::raw($emailBody, function ($message) use ($user, $rendered) {
                $message->to($user->email)
                    ->subject($rendered['subject']);
            });

            return response()->json(['message' => 'Test email sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send test email'], 500);
        }
    }

    /**
     * Get general settings.
     */
    public function general(): JsonResponse
    {
        try {
            $settings = [
                'system_name' => Cache::get('system_name', 'UM Event Management System'),
                'university_name' => Cache::get('university_name', 'University of Mindanao'),
                'system_description' => Cache::get('system_description', 'Comprehensive event and venue management system for the University of Mindanao.'),
                'application_name' => Cache::get('application_name', 'Event Management System'),
                'maintenance_mode' => Cache::get('maintenance_mode', false),
                'auto_approval_enabled' => Cache::get('auto_approval_enabled', false),
                'timezone' => Cache::get('timezone', 'Asia/Manila (UTC+8)'),
                'advance_booking_days' => Cache::get('advance_booking_days', 90),
                'min_booking_duration' => Cache::get('min_booking_duration', 1),
                'allow_weekend_bookings' => Cache::get('allow_weekend_bookings', true),
            ];

            return response()->json(['settings' => $settings]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch general settings'], 500);
        }
    }

    /**
     * Update general settings.
     */
    public function updateGeneral(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'system_name' => 'required|string|max:255',
                'university_name' => 'required|string|max:255',
                'system_description' => 'nullable|string|max:1000',
                'maintenance_mode' => 'boolean',
                'auto_approval_enabled' => 'boolean',
                'timezone' => 'required|string',
                'advance_booking_days' => 'required|integer|min:1',
                'min_booking_duration' => 'required|integer|min:1',
                'allow_weekend_bookings' => 'boolean',
            ]);

            // Verify password
            if (!\Hash::check($validated['current_password'], $request->user()->password)) {
                 return response()->json(['error' => 'Incorrect password provided'], 403);
            }

            // Remove password from data to save
            unset($validated['current_password']);

            foreach ($validated as $key => $value) {
                Cache::put($key, $value);
            }

            return response()->json(['message' => 'General settings updated successfully']);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('General Settings Update Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update general settings: ' . $e->getMessage()], 500);
        }
    }
}
