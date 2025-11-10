<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): View
    {
        // Return the feedback view
        return view('feedback.index'); // You will need to create 'resources/views/feedback/index.blade.php'
    }
}