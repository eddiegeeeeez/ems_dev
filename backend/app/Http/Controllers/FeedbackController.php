<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    /**
     * Display a listing of feedback - Returns JSON
     */
    public function index(): JsonResponse
    {
        try {
            $feedback = Feedback::with(['user', 'venue'])
                ->where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $feedback
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch feedback',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store new feedback - Returns JSON
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'venue_id' => 'required|integer|exists:venues,id',
                'booking_id' => 'required|integer|exists:bookings,id',
                'rating' => 'required|integer|in:1,2,3,4,5',
                'comment' => 'nullable|string|max:1000|regex:/^[a-zA-Z0-9\s.,!?\-\'\&]+$/',
            ], [
                'comment.regex' => 'Comment contains invalid characters.',
            ]);

            // Security: Sanitize comment input
            $comment = $validated['comment'] ? strip_tags($validated['comment']) : null;

            $feedback = Feedback::create([
                'user_id' => Auth::id(),
                'venue_id' => $validated['venue_id'],
                'booking_id' => $validated['booking_id'],
                'rating' => $validated['rating'],
                'comment' => $comment,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Feedback submitted successfully',
                'data' => $feedback
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit feedback',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}