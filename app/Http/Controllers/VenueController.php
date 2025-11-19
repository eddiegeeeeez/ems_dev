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

    /**
     * Display admin venues management page.
     */
    public function adminIndex(): View
    {
        return view('admin.venues');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        return view('admin.venues.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
        ]);

        return back()->with('success', 'Venue created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id): View
    {
        return view('admin.venues.edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
        ]);

        return back()->with('success', 'Venue updated successfully.');
    }

    /**
     * Toggle venue active/inactive status.
     */
    public function toggle($id)
    {
        return back()->with('success', 'Venue status updated successfully.');
    }
}