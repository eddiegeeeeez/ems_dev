<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('location');
            $table->integer('capacity');
            $table->string('image_url')->nullable();
            $table->json('amenities')->default('[]');
            $table->json('opening_hours')->nullable(); // e.g., {"monday": "08:00-17:00"}
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();
            $table->index('is_active');
            $table->fullText(['name', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venues');
    }
};
