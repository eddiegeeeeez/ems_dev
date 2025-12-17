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
            $table->boolean('is_active')->default(true);
            $table->foreignId('college_id')->constrained('colleges')->onDelete('cascade');
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
