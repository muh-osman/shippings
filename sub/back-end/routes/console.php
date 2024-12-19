<?php


use App\Http\Controllers\UploadedController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Console\Scheduling\Schedule;


Artisan::command('client:check-statuses', function () {
    $controller = new UploadedController();
    $controller->checkAllClientStatuses();
    $this->info('Checked all client statuses successfully.');
});


// Schedule the command to run daily at 11:30 AM UTC -> 12:30 Tunisia time -> 14:30 Damascus time
$schedule = app(Schedule::class);
$schedule->command('client:check-statuses')->dailyAt('11:30');


// Use this link in hostinger cron job to run the command:
// domains/adflux.org/public_html/back-end/artisan schedule:run