<?php

namespace App\Http\Controllers;

use App\Events\UserLiked;
use App\Models\Chat;
use App\Models\Like;
use App\Models\Matches;
use App\Models\Message;
use App\Models\User;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;
use Pusher\ApiErrorException;
use Pusher\Pusher;
use Pusher\PusherException;


class LikeController extends Controller
{
    /**
     * @throws PusherException
     * @throws ApiErrorException
     * @throws GuzzleException
     */


    public function likeUser(Request $request)
    {
        $options = array(
            'cluster' => 'eu', // Replace with your cluster
            'useTLS' => true,
        );

        $fromUserId = auth()->id();
        $toUserId = $request->input('to_user_id');
        $status = $request->input('status');

        // Check for reciprocal like
        if ($status === 'like') {
            Like::create([
                'from_user_id' => $fromUserId,
                'to_user_id' => $toUserId,
                'status' => 'like',
            ]);

            $reciprocalLike = Like::where('from_user_id', $toUserId)
                ->where('to_user_id', $fromUserId)
                ->where('status', 'like')
                ->first();

            if ($reciprocalLike) {
                // Create a match if both users liked each other
                $match = Matches::create([
                    'user1_id' => $fromUserId,
                    'user2_id' => $toUserId,
                    'status' => 'active', // Mutual match
                    'match_date' => now(),
                ]);

                // Create a chat between the two users
                $chat = Chat::create([
                    'user1_id' => $fromUserId,
                    'user2_id' => $toUserId,
                ]);

                // Optionally, you can send a welcome message in the chat after creating it
                Message::create([
                    'chat_id' => $chat->id,
                    'user_id' => $fromUserId, // You can choose who sends the first message
                    'content' => 'Hi there! Let\'s start chatting!',
                    'is_file' => false, // This is a text message
                    'sent_at' => now(),
                ]);

                // Trigger Pusher notifications
                $pusher = new Pusher(
                    'ce68b287bd7980a297d5', // Replace with your Pusher App Key
                    '0c31a0c4d69e13204672', // Replace with your Pusher App Secret
                    '1875515', // Replace with your Pusher App ID
                    $options,
                );

                try {
                    $pusher->trigger("user.$fromUserId", 'my-event', [
                        'message' => 'You have a new match!',
                        'match' => $match
                    ]);

                    $pusher->trigger("user.$toUserId", 'my-event', [
                        'message' => 'You have a new match!',
                        'match' => $match
                    ]);
                } catch (PusherException $e) {
                    return response()->json(['error' => 'Could not send Pusher message.'], 500);
                }
            }
        } elseif ($status === 'dislike') {
            // If it's a dislike, you can still create a record for it if needed
            Like::create([
                'from_user_id' => $fromUserId,
                'to_user_id' => $toUserId,
                'status' => 'dislike', // Record the dislike
            ]);
            // No response is sent for dislikes
        }

        // No response for likes that do not create a match
        return response()->json(['message' => 'Like recorded successfully.'], 200);
    }



    public function getSwipedUsers(): \Illuminate\Http\JsonResponse
    {
        $userId =  auth()->id(); // Get the authenticated user's ID

        // Get all user IDs that the user has swiped
        $swipedUserIds = Like::where('from_user_id', $userId)
            ->where('status', 'like')
            ->pluck('to_user_id') // Get the IDs of liked users
            ->toArray();

        // Optionally get disliked users as well
        $dislikedUserIds = Like::where('from_user_id', $userId)
            ->where('status', 'dislike') // Add the status condition if necessary
            ->pluck('to_user_id')
            ->toArray();


        // Combine liked and disliked users
        $swipedUsers = array_merge($swipedUserIds, $dislikedUserIds);

        $swipedUsers[] = $userId;

        // Fetch user details for all swiped users
        $users = User::whereNotIn('id', $swipedUsers)->get();

        return response()->json($users);
    }
}
