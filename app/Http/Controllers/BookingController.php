<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): View
    {
        // Here you would fetch the user's bookings
        // $bookings = Auth::user()->bookings;

        // Return the view
        return view('bookings.index'); // You will need to create 'resources/views/bookings/index.blade.php'
    }
}