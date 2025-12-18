<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule automatic rejection of expired pending bookings
Schedule::command('booking:expire-pending')
    ->hourly()
    ->withoutOverlapping()
    ->runInBackground();
