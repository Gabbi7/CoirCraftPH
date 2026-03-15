<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/api/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/api/login', [App\Http\Controllers\Api\AuthController::class, 'login']);

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
