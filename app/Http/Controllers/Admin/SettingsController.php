<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    /**
     * Get booking rules settings.
     */
    public function bookingRules(): JsonResponse
    {
        try {
            $settings = [
                'max_advance_booking_days' => Cache::get('max_advance_booking_days', 30),
                'min_booking_duration' => Cache::get('min_booking_duration', 1),
                'max_booking_duration' => Cache::get('max_booking_duration', 8),
                'require_approval' => Cache::get('require_approval', true),
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
                'max_advance_booking_days' => 'required|integer|min:1',
                'min_booking_duration' => 'required|integer|min:1',
                'max_booking_duration' => 'required|integer|min:1',
                'require_approval' => 'boolean',
            ]);

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
                    'subject' => Cache::get('email_template_booking_approved_subject', 'Booking Approved'),
                    'body' => Cache::get('email_template_booking_approved_body', 'Your booking has been approved.'),
                ],
                'booking_rejected' => [
                    'subject' => Cache::get('email_template_booking_rejected_subject', 'Booking Rejected'),
                    'body' => Cache::get('email_template_booking_rejected_body', 'Your booking has been rejected.'),
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
                'body' => 'required|string',
            ]);

            Cache::put("email_template_{$validated['template_name']}_subject", $validated['subject']);
            Cache::put("email_template_{$validated['template_name']}_body", $validated['body']);

            return response()->json(['message' => 'Email template updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update email template'], 500);
        }
    }

    /**
     * Get general settings.
     */
    public function general(): JsonResponse
    {
        try {
            $settings = [
                'application_name' => Cache::get('application_name', 'Event Management System'),
                'maintenance_mode' => Cache::get('maintenance_mode', false),
                'auto_approval_enabled' => Cache::get('auto_approval_enabled', false),
                'timezone' => Cache::get('timezone', 'UTC'),
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
                'application_name' => 'required|string|max:255',
                'maintenance_mode' => 'boolean',
                'auto_approval_enabled' => 'boolean',
                'timezone' => 'required|string',
            ]);

            foreach ($validated as $key => $value) {
                Cache::put($key, $value);
            }

            return response()->json(['message' => 'General settings updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update general settings'], 500);
        }
    }
}
