<?php

namespace App\Http\Controllers;

use App\Models\Uploaded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class UploadedController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $uploadedClients = Uploaded::orderBy('id', 'asc')->get();
        return response()->json($uploadedClients);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Find the uploaded record by ID
        $uploaded = Uploaded::find($id);

        if (!$uploaded) {
            return response()->json(['message' => 'Uploaded record not found'], 404);
        }

        // Prepare the request body to check the status
        $requestBody = [
            'barCode' => $uploaded->barCode, // Use the barCode from the uploadeds table
        ];

        // Send the request to the status API
        $response = Http::withToken('dce92a94-c4b9-4655-8716-7265b54cfe93')
            ->post('https://www.firstdeliverygroup.com/api/v2/etat', $requestBody);

        // Check if the response indicates an error
        if ($response->failed()) {
            return response()->json(['message' => 'Error checking status', 'data' => $response->json()], $response->status());
        }

        // Extract the state from the response
        $responseData = $response->json();
        if (isset($responseData['result']['state'])) {
            // Update the status column in the uploadeds table
            $uploaded->status = $responseData['result']['state'];
            $uploaded->save(); // Save the changes to the database
        }

        // Return the uploaded record as a JSON response
        return response()->json($uploaded);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Uploaded $uploaded)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Uploaded $uploaded)
    {
        //
    }

    /**
     * Check the status of a client.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function checkClientStatus(Request $request)
    {
        // Validate the request to ensure an ID is provided
        $request->validate([
            'id' => 'required|integer|exists:uploadeds,id', // Check in the uploadeds table
        ]);

        // Find the uploaded record by ID
        $uploaded = Uploaded::find($request->id);

        if (!$uploaded) {
            return response()->json(['message' => 'Uploaded record not found'], 404);
        }

        // Prepare the request body
        $requestBody = [
            'barCode' => $uploaded->barCode, // Use the barCode from the uploadeds table
        ];

        // Send the request to the status API
        $response = Http::withToken('dce92a94-c4b9-4655-8716-7265b54cfe93')
            ->post('https://www.firstdeliverygroup.com/api/v2/etat', $requestBody);

        // Check if the response indicates an error
        if ($response->failed()) {
            return response()->json(['message' => 'Error checking status', 'data' => $response->json()], $response->status());
        }

        // Extract the state from the response
        $responseData = $response->json();
        if (isset($responseData['result']['state'])) {
            // Update the status column in the uploadeds table
            $uploaded->status = $responseData['result']['state'];
            $uploaded->save(); // Save the changes to the database
        }

        // Return the response from the status API
        return response()->json($responseData, $response->status());
    }

    /**
     * Return all IDs and phone numbers from the uploadeds table.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllPhoneNumbers()
    {
        // Retrieve all IDs and telephone numbers from the uploadeds table
        $phoneNumbers = Uploaded::select('id', 'telephone')->get();

        // Return the phone numbers as a JSON response
        return response()->json($phoneNumbers);
    }
}
