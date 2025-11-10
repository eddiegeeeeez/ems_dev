<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class VenueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): View
    {
        // Here you would fetch all venues from your database
        // $venues = Venue::all();

        // Return the view, passing in the venues
        return view('venues.index'); // You will need to create 'resources/views/venues/index.blade.php'
    }
}