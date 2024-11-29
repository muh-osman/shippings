<?php


use App\Http\Controllers\UploadedController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Console\Scheduling\Schedule;


Artisan::command('client:check-statuses', function () {
    $controller = new UploadedController();
    $controller->checkAllClientStatuses();
    $this->info('Checked all client statuses successfully.');
});


// Schedule the command to run daily at 01:00 AM UTC -> 02:00 Tunisia time -> 04:00 Damascus time
$schedule = app(Schedule::class);
$schedule->command('client:check-statuses')->dailyAt('01:00');

// Use this link in hostinger cron job to run the command:
// domains/adflux.org/public_html/back-end/artisan schedule:run