<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add a CHECK constraint to ensure emails end with @umindanao.edu.ph
        // Note: Some MySQL versions may parse but not enforce CHECK constraints prior to 8.0.16.
        DB::statement("ALTER TABLE `users` ADD CONSTRAINT `chk_users_email_domain` CHECK (LOWER(`email`) LIKE '%@umindanao.edu.ph')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop constraint if exists
        // MySQL requires using the constraint name
        DB::statement("ALTER TABLE `users` DROP CHECK `chk_users_email_domain`");
    }
};
