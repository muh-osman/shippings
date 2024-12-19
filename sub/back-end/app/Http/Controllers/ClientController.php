<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ClientController extends Controller
{
    /**
     * Display a listing of the clients.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $clients = Client::orderBy('id', 'asc')->get();
        return response()->json($clients);
    }

    /**
     * Store a newly created client in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'governorate' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'telephone' => 'required|string|max:15',
            'telephone2' => 'nullable|string|max:15',
            'price' => 'required|numeric',
            'designation' => 'required|string|max:255',
            'numberOfItems' => 'required|integer',
            'comment' => 'nullable|string',
            'item' => 'nullable|string|max:255',
            'numberOfExchanges' => 'nullable|integer',
        ]);

        $client = Client::create($request->all());
        return response()->json($client, 201);
    }

    /**
     * Display the specified client.
     *
     * @param  \App\Models\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function show(Client $client)
    {
        return response()->json($client);
    }

    /**
     * Update the specified client in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Client $client)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'governorate' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string|max:255',
            'telephone' => 'sometimes|required|string|max:15',
            'telephone2' => 'nullable|string|max:15',
            'price' => 'sometimes|required|numeric',
            'designation' => 'sometimes|required|string|max:255',
            'numberOfItems' => 'sometimes|required|integer',
            'comment' => 'nullable|string',
            'item' => 'nullable|string|max:255',
            'numberOfExchanges' => 'nullable|integer',
        ]);

        $client->update($request->all());
        return response()->json($client);
    }


    /**
     * Remove the specified client from storage.
     *
     * @param  \App\Models\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(null, 204);
    }



    /**
     * Bulk create orders from clients.
     *
     * @return \Illuminate\Http\Response
     */
    public function bulkCreateOrders()
    {
        // Retrieve all clients from the database
        $clients = Client::all();

        if ($clients->isEmpty()) {
            return response()->json(['message' => 'No clients found'], 404);
        }

        $orders = [];

        // Prepare the orders array based on the clients data
        foreach ($clients as $client) {
            $orders[] = [
                "Client" => [
                    "nom" => $client->name,
                    "gouvernerat" => $client->governorate,
                    "ville" => $client->city,
                    "adresse" => $client->address,
                    "telephone" => $client->telephone,
                    "telephone2" => $client->telephone2,
                ],
                "Produit" => [
                    "prix" => $client->price,
                    "designation" => $client->designation,
                    "nombreArticle" => $client->numberOfItems,
                    "commentaire" => $client->comment,
                    "article" => $client->item,
                    "nombreEchange" => $client->numberOfExchanges,
                ]
            ];
        }

        // Split orders into chunks of 100
        $chunks = array_chunk($orders, 100);
        $responses = [];

        // Send each chunk to the API
        foreach ($chunks as $chunk) {
            $response = Http::withToken('dce92a94-c4b9-4655-8716-7265b54cfe93')
                ->post('https://www.firstdeliverygroup.com/api/v2/bulk-create', $chunk);

            // Check if the response indicates an error
            if ($response->status() === 400) {
                $responseData = $response->json();
                if (isset($responseData['isError']) && $responseData['isError'] === true) {
                    // Return the error messages
                    return response()->json([
                        'data' => $responseData ?? [],
                    ], 400);
                }
            }

            // If the response is successful, process the bar codes
            if ($response->status() === 201) {
                $responseData = $response->json();

                // Check if barCodes exist in the response
                if (isset($responseData['result']['barCodes'])) {
                    // Ensure we have a corresponding client for each bar code
                    foreach ($responseData['result']['barCodes'] as $index => $barCodeData) {
                        // Check if the index exists in the original chunk
                        if (isset($chunk[$index])) {
                            $clientData = $chunk[$index]['Client']; // Get the client data for this index

                            // Create a new entry in the uploadeds table
                            \App\Models\Uploaded::create([
                                'status' => '', // or any other status you want to set
                                'barCode' => $barCodeData['barCode'],
                                'name' => $clientData['nom'],
                                'governorate' => $clientData['gouvernerat'],
                                'city' => $clientData['ville'],
                                'address' => $clientData['adresse'],
                                'telephone' => $clientData['telephone'],
                                'telephone2' => $clientData['telephone2'],
                                'price' => $chunk[$index]['Produit']['prix'],
                                'designation' => $chunk[$index]['Produit']['designation'],
                                'numberOfItems' => $chunk[$index]['Produit']['nombreArticle'],
                                'comment' => $chunk[$index]['Produit']['commentaire'],
                                'item' => $chunk[$index]['Produit']['article'],
                                'numberOfExchanges' => $chunk[$index]['Produit']['nombreEchange'],
                            ]);
                        }
                    }

                    // After processing the bar codes, delete the clients that were sent
                    foreach ($chunk as $clientData) {
                        // Find the client by unique identifiers and delete
                        Client::where('name', $clientData['Client']['nom'])
                            ->where('governorate', $clientData['Client']['gouvernerat'])
                            ->where('city', $clientData['Client']['ville'])
                            ->where('address', $clientData['Client']['adresse'])
                            ->where('telephone', $clientData['Client']['telephone'])
                            ->delete();
                    }
                }
            }

            // Store the response for each chunk
            $responses[] = [
                'status' => $response->status(),
                'data' => $response->json(),
            ];
        }

        // Return the responses from the API
        return response()->json($responses);
    }
}
