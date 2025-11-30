<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('qr_code_data')->unique()->nullable()->after('total_cost');
            $table->longText('qr_code_svg')->nullable()->after('qr_code_data');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['qr_code_data', 'qr_code_svg']);
        });
    }
};
