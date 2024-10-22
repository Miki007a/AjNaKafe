import React, { useEffect } from 'react';
import { Client as PusherPushNotifications } from '@pusher/push-notifications-web'; // Import the client

const App = () => {
  useEffect(() => {
    const beamsClient = new PusherPushNotifications({
      instanceId: 'c3e9d9df-f561-44d5-b404-12fff493f0a4', // Your instance ID
    });

    beamsClient.start()
      .then(() => beamsClient.addDeviceInterest('hello'))
      .then(() => {
        console.log('Successfully registered and subscribed!');
        beamsClient.on('new-match', (data) => {
          alert(data.message); // Display notification
          // Handle the match object as needed
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div>

      {/* Other components */}
    </div>
  );
};

export default App;
