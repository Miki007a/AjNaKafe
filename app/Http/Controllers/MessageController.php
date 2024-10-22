<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = new Message();
        $message->sender_id = Auth::id();
        $message->receiver_id = $request->receiver_id;
        $message->message = $request->message;
        $message->save();

        return response()->json(['message' => 'Message sent successfully!']);
    }

    public function getMessages($userId)
    {
        $messages = Message::where(function($query) use ($userId) {
            $query->where('sender_id', Auth::id())
                ->where('receiver_id', $userId);
        })
            ->orWhere(function($query) use ($userId) {
                $query->where('sender_id', $userId)
                    ->where('receiver_id', Auth::id());
            })
            ->get();

        return response()->json($messages);
    }
}
