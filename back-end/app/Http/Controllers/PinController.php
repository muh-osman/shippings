<?php

namespace App\Http\Controllers;

use App\Models\Pin;
use Illuminate\Http\Request;

class PinController extends Controller
{


    // Check if pin in database matches pin entered by user
    public function checkPin(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'pin_code' => 'required|string|max:255', // Validate pin_code
        ]);

        try {
            $pin = $request->input('pin_code');

            // Check if the pin exists in the database
            $pinExists = Pin::where('pin_code', $pin)->exists();

            // Return a response indicating success or failure
            return response()->json([
                'success' => $pinExists,
                'message' => $pinExists ? 'Pin is valid.' : 'Invalid pin.'
            ], $pinExists ? 200 : 404);
        } catch (\Exception $e) {
            // Log the exception message for debugging
            \Log::error('Error checking pin: ' . $e->getMessage());

            // Return a response indicating an error occurred
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while checking the pin. Please try again later.'
            ], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'pin_code' => 'required|string|max:255', // Validate pin_code
        ]);

        // Check if a pin already exists
        if (Pin::count() >= 1) {
            return response()->json(['success' => false, 'message' => 'Only one pin is allowed in the database.'], 400);
        }

        // Create a new Pin instance and save it to the database
        $pin = new Pin();
        $pin->pin_code = $request->input('pin_code');
        $pin->save();

        // Return a response indicating success
        return response()->json(['success' => true, 'message' => 'Pin created successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pin $pin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pin $pin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pin $pin)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pin $pin)
    {
        //
    }
}
