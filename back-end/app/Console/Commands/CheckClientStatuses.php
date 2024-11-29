<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\UploadedController;

class CheckClientStatuses extends Command
{
    protected $signature = 'client:check-statuses';
    protected $description = 'Check the status of all uploaded clients';

    public function handle()
    {
        $controller = new UploadedController();
        $controller->checkAllClientStatuses();
        $this->info('Checked all client statuses successfully.');
    }
}
