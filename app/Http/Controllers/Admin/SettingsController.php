<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Display booking rules settings.
     */
    public function bookingRules()
    {
        return view('admin.settings');
    }

    /**
     * Update booking rules.
     */
    public function updateBookingRules(Request $request)
    {
        $validated = $request->validate([
            'max_advance_booking_days' => 'required|integer|min:1',
            'min_booking_duration' => 'required|integer|min:1',
            'max_booking_duration' => 'required|integer|min:1',
            'require_approval' => 'boolean',
        ]);

        return back()->with('success', 'Booking rules updated successfully.');
    }

    /**
     * Display email templates settings.
     */
    public function emailTemplates()
    {
        return view('admin.settings');
    }

    /**
     * Update email template.
     */
    public function updateEmailTemplate(Request $request)
    {
        $validated = $request->validate([
            'template_name' => 'required|string',
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        return back()->with('success', 'Email template updated successfully.');
    }

    /**
     * Display general settings.
     */
    public function general()
    {
        return view('admin.settings');
    }

    /**
     * Update general settings.
     */
    public function updateGeneral(Request $request)
    {
        $validated = $request->validate([
            'application_name' => 'required|string|max:255',
            'maintenance_mode' => 'boolean',
            'auto_approval_enabled' => 'boolean',
            'timezone' => 'required|string',
        ]);

        return back()->with('success', 'General settings updated successfully.');
    }
}
