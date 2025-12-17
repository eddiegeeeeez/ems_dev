<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category'); // Projector, Microphone, Table, Chair, etc.
            $table->integer('quantity');
            $table->integer('available_quantity');
            $table->boolean('is_active')->default(true);
            $table->foreignId('college_id')->constrained('colleges')->onDelete('cascade');
            $table->timestamps();
            $table->index(['category', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
