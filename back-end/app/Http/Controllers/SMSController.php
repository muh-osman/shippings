<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SMSController extends Controller
{
    /**
     * Send SMS using TunisiaSMS API
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendSingleSMS(Request $request)
    {
        try {

            // Log::info('Incoming SMS request', $request->all());

            // Validate request
            $validated = $request->validate([
                'mobile' => 'required|string',
                'message' => 'required|string',
                'sender' => 'nullable|string',
                'scheduled_date' => 'nullable|date_format:d/m/Y',
                'scheduled_time' => 'nullable|string|regex:/^\d{2}:\d{2}:\d{2}$/',
            ]);

            // Base API URL
            $baseUrl = "https://app.tunisiesms.tn/Api/Api.aspx";

            // Normalize mobile number
            $mobile = $validated['mobile'];

            // Check if the mobile number already starts with the country code
            if (!preg_match('/^216/', $mobile)) {
                // Prepend the country code if it's not present
                $mobile = '216' . ltrim($mobile, '0'); // Remove leading zero if present
            }

            // Log::info('Normalized mobile number', ['mobile' => $mobile]);

            // API Parameters
            $params = [
                'fct' => 'sms',
                'key' => config('services.tunisia_sms.api_key'), // Store API key in config
                'mobile' => $mobile,
                'sms' => $validated['message'],
            ];

            // Add sender if not provided
            if (empty($validated['sender'])) {
                $params['sender'] = 'TunSMS Test';
            } else {
                $params['sender'] = $validated['sender'];
            }

            // Add scheduling if provided
            if (!empty($validated['scheduled_date']) && !empty($validated['scheduled_time'])) {
                $params['date'] = $validated['scheduled_date'];
                $params['time'] = $validated['scheduled_time'];
            }
            // If either or both are missing, SMS will be sent immediately (no date/time parameters added)


            // Log::info('API request parameters', $params);


            // Make API request
            $response = Http::get($baseUrl, $params);

            // Log::info('API response', [
            //     'status' => $response->status(),
            //     'body' => $response->body(),
            // ]);

            // Check if request was successful
            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'message' => 'SMS sent successfully',
                    'response' => $response->body()
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to send SMS',
                'error' => $response->body()
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending SMS',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function sendMultipleSMS(Request $request)
    {
        try {
            // Log::info('Incoming request', $request->all());

            // Validate the incoming request (excluding mobile numbers for now)
            $validated = $request->validate([
                'message' => 'required|string',
                'mobileNumbers' => 'required|string',
                'sender' => 'nullable|string',
                'scheduled_date' => 'nullable|date_format:d/m/Y',
                'scheduled_time' => 'nullable|string|regex:/^\d{2}:\d{2}:\d{2}$/',
            ]);

            // Log::info('Validated data', $validated);

            // Split and clean mobile numbers
            $mobileNumbers = array_filter(
                explode(',', $validated['mobileNumbers']),
                fn ($number) => trim($number) !== ''
            );

            // Log::info('Mobile numbers before normalization', $mobileNumbers);

            // Normalize mobile numbers with country code
            $mobileNumbers = array_map(function ($number) {
                $number = trim($number);
                if (!preg_match('/^216/', $number)) {
                    return '216' . ltrim($number, '0');
                }
                return $number;
            }, $mobileNumbers);

            // Log::info('Normalized mobile numbers', $mobileNumbers);

            // Base API URL
            $baseUrl = "https://app.tunisiesms.tn/Api/Api.aspx";


            // Prepare responses
            $responses = [];

            // Iterate over each mobile number and send SMS
            foreach ($mobileNumbers as $mobile) {
                // Validate mobile number
                if (!preg_match('/^\d{8}$/', ltrim($mobile, '216'))) { // Assuming valid mobile numbers have 8 digits after country code
                    $responses[] = [
                        'mobile' => $mobile,
                        'success' => false,
                        'message' => 'Invalid mobile number format',
                    ];
                    continue; // Skip to the next number
                }

                // API Parameters
                $params = [
                    'fct' => 'sms',
                    'key' => config('services.tunisia_sms.api_key'),
                    'mobile' => $mobile,
                    'sms' => $validated['message'],
                ];

                if (empty($validated['sender'])) {
                    $params['sender'] = 'TunSMS Test';
                } else {
                    $params['sender'] = $validated['sender'];
                }

                if (!empty($validated['scheduled_date']) && !empty($validated['scheduled_time'])) {
                    $params['date'] = $validated['scheduled_date'];
                    $params['time'] = $validated['scheduled_time'];
                }

                // Make API request
                $response = Http::get($baseUrl, $params);
                Log::info('API response', [
                    'mobile' => $mobile,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                // Store response for each mobile number
                $responses[] = [
                    'mobile' => $mobile,
                    'success' => $response->successful(),
                    'message' => $response->successful() ? 'SMS sent successfully' : 'Failed to send SMS',
                    'error' => $response->successful() ? null : $response->body(),
                ];

                // Wait for 5 seconds before the next request
                sleep(5);
            }

            return response()->json([
                'success' => true,
                'responses' => $responses,
            ]);
        } catch (\Exception $e) {
            Log::error('Error sending SMS', [
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error sending SMS: ' . $e->getMessage()
            ], 500);
        }
    }
}
