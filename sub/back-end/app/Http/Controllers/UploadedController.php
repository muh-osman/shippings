<?php

namespace App\Http\Controllers;

use App\Models\Uploaded;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


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
        $response = Http::withToken('cea41945-8739-4910-b0d8-520d44ecbe86')
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
        $response = Http::withToken('cea41945-8739-4910-b0d8-520d44ecbe86')
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

    /**
     * Get analytics for specific designations.
     *
     * @return \Illuminate\Http\Response
     */
    public function analytics(Request $request)
    {
        // Validate the request to ensure start and end dates are provided
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // Get the start and end dates from the request
        $startDate = $request->input('start_date');
        $endDate = Carbon::parse($request->input('end_date'))->endOfDay(); // Adjust end date

        // Define the designations to count
        $designations = [
            "Tisane Anti Constipation F" => 'F',
            "Tisane Anti Constipation N" => 'N',
            "Tisane Anti Constipation Z" => 'Z',
            "Tisane Anti Constipation S" => 'S',
            "Tisane Anti Constipation A" => 'A',
        ];

        // Initialize an array to hold the counts
        $counts = [];
        $statusCounts = [];

        // Loop through each designation and count the occurrences within the date range
        foreach ($designations as $designation => $shortKey) {
            $counts[$shortKey] = Uploaded::where('designation', $designation)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('numberOfItems');

            // Count for "Livré" status
            $statusCounts[$shortKey]['Livré'] = Uploaded::where('designation', $designation)
                ->where('status', 'Livré')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('numberOfItems');

            // Count for "Retour reçu" status
            $statusCounts[$shortKey]['Retour reçu'] = Uploaded::where('designation', $designation)
                ->where('status', 'Retour reçu')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('numberOfItems');
        }

        // Count all records with status "Livré"
        $totalLivréCount = Uploaded::where('status', 'Livré')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('numberOfItems');

        // Count all records with status "Retour reçu"
        $totalRetourReçuCount = Uploaded::where('status', 'Retour reçu')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('numberOfItems');

        // Count all records with status "En cours"
        $totalEnCoursCount = Uploaded::where('status', 'En cours')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('numberOfItems');

        // Return the counts as a JSON response
        return response()->json([
            'allCounts' => $counts, // first chart

            'statusCounts' => $statusCounts, // second chart

            'totalLivréCount' => $totalLivréCount, // third chart
            'totalRetourReçu' => $totalRetourReçuCount, // third chart
            'totalEnCoursCount' => $totalEnCoursCount, // third chart
        ]);
    }

    /**
     * Send SMS to all clients with 'En cours' status
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function notifyEnCoursClients()
    {

        try {

            // Retrieve all uploaded records with 'En cours' status
            $enCoursClients = Uploaded::where('status', 'En cours')->get();

            // Initialize an array to hold the results
            $results = [];

            // Base API URL
            $baseUrl = "https://app.tunisiesms.tn/Api/Api.aspx";

            foreach ($enCoursClients as $client) {
                // Skip if no telephone number
                if (empty($client->telephone)) {
                    $results[] = [
                        'id' => $client->id,
                        'success' => false,
                        'message' => 'No telephone number',
                    ];
                    continue;
                }

                // Normalize mobile number
                $mobile = $client->telephone;
                if (!preg_match('/^216/', $mobile)) {
                    $mobile = '216' . ltrim($mobile, '0');
                }

                // API Parameters
                $params = [
                    'fct' => 'sms',
                    'key' => config('services.tunisia_sms.api_key'),
                    'mobile' => $mobile,
                    'sms' => 'صباح النور حريفنا الكريم. الكومند متاعك في " بذور الراحة " تخلطلك اليوم .. خلي تلفونك بجنبك .. نشكروك على تفهمك و ثقتك فينا. نهارك طيب',
                    'sender' => 'BioTn',
                ];

                // Make API request
                $response = Http::get($baseUrl, $params);

                // Log the result
                $results[] = [
                    'id' => $client->id,
                    'mobile' => $mobile,
                    'success' => $response->successful(),
                    'message' => $response->successful() ? 'SMS sent successfully' : 'Failed to send SMS',
                    'error' => $response->successful() ? null : $response->body(),
                ];

                // If SMS is sent successfully, log the phone number
                if ($response->successful()) {
                    Log::info('Successful SMS sent', [
                        'mobile' => $mobile,
                        'client_id' => $client->id
                    ]);
                }

                // Wait for 5 seconds between SMS to avoid rate limiting
                sleep(5);
            }

            return response()->json([
                'total_clients' => count($enCoursClients),
                'results' => $results,
            ]);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error in notifyEnCoursClients', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error processing En Cours clients: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check the status of all uploaded records with a rate limit of 1 request every 2 seconds.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkAllClientStatuses()
    {
        // Retrieve all uploaded records
        $uploadedClients = Uploaded::orderBy('id', 'asc')->get();

        // Initialize an array to hold the results
        $results = [];

        foreach ($uploadedClients as $uploaded) {
            // Check if the status is "Livré" or "Rtn définitif"
            if ($uploaded->status === 'Livré' || $uploaded->status === 'Supprimé' || $uploaded->status === 'Retour reçu') {
                continue; // Skip to the next record
            }

            // Prepare the request body
            $requestBody = [
                'barCode' => $uploaded->barCode, // Use the barCode from the uploadeds table
            ];


            // Send the request to the status API
            $response = Http::withToken('cea41945-8739-4910-b0d8-520d44ecbe86')
                ->post('https://www.firstdeliverygroup.com/api/v2/etat', $requestBody);

            // Check if the response indicates an error
            if ($response->failed()) {
                Log::error("Error checking status for Uploaded ID: {$uploaded->id}", [
                    'response' => $response->json(),
                    'status_code' => $response->status(),
                ]);
                $results[] = [
                    'id' => $uploaded->id,
                    'message' => 'Error checking status',
                    'data' => $response->json(),
                ];
            } else {
                // Extract the state from the response
                $responseData = $response->json();
                if (isset($responseData['result']['state'])) {
                    // Update the status column in the uploadeds table
                    $uploaded->status = $responseData['result']['state'];
                    $uploaded->save(); // Save the changes to the database

                    Log::info("Updated status for Uploaded ID: {$uploaded->id} to {$uploaded->status}");

                    $results[] = [
                        'id' => $uploaded->id,
                        'status' => $uploaded->status,
                    ];
                }
            }

            // Wait for 2 seconds before the next request
            sleep(2);
        }

        // Call the notifyEnCoursClients method directly after checkAllClientStatuses
        if (date('w') != 0) { // Check if today is not Sunday
            $this->notifyEnCoursClients();
        } else {
            Log::info('notifyEnCoursClients was not called because today is Sunday.');
        }


        // Return the results as a JSON response
        return response()->json($results);
    }
}
