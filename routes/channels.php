<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('private-user.{id}', function ($user, $id) {
    \Log::info("User ID: " . $user->id . " trying to access channel with ID: " . $id);
    return (int) $user->id === (int) $id; // Authorize only if the user ID matches
});
Broadcast::routes(['middleware' => ['auth:sanctum']]);
