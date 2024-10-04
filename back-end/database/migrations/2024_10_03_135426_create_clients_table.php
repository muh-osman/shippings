<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('governorate');
            $table->string('city');
            $table->string('address');
            $table->string('telephone');
            $table->string('telephone2')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('designation');
            $table->integer('numberOfItems');
            $table->text('comment')->nullable();
            $table->string('item')->nullable();
            $table->integer('numberOfExchanges')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
