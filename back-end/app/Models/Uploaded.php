<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Uploaded extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'barCode',
        'name',
        'governorate',
        'city',
        'address',
        'telephone',
        'telephone2',
        'price',
        'designation',
        'numberOfItems',
        'comment',
        'item',
        'numberOfExchanges',
    ];
}
