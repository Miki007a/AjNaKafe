import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'ce68b287bd7980a297d5',
  cluster: 'eu',
  forceTLS: true
});

