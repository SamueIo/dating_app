// import Echo from 'laravel-echo';

// import Pusher from 'pusher-js';
// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'reverb',
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
//     wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

const host = import.meta.env.VITE_REVERB_HOST === '0.0.0.0'
  ? window.location.hostname
  : import.meta.env.VITE_REVERB_HOST;

const port = import.meta.env.VITE_REVERB_PORT ?? (window.location.protocol === 'https:' ? 443 : 80);
const forceTLS = (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https';

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: host,
  wsPort: forceTLS ? null : port,   // Ak je TLS, port sa nešpecifikuje (WSS ide defaultne na 443)
  wssPort: forceTLS ? port : null,  // Ak je TLS, wssPort je port, inak null
  forceTLS: forceTLS,
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
});
