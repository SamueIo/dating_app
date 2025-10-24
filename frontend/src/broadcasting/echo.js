import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
console.log("VITE_REVERB_SCHEME:", import.meta.env.VITE_REVERB_SCHEME);

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_REVERB_APP_KEY ?? 'local',
    cluster: import.meta.env.VITE_REVERB_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,

    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
    authEndpoint: import.meta.env.VITE_ECHO_AUTH_ENDPOINT ?? 'http://localhost:8000/broadcasting/auth',
    enabledTransports: ['ws', 'wss'],

    
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                console.log(`[Echo] Authorizing channel: ${channel.name}, socketId: ${socketId}`);
                axios.post(
                    import.meta.env.VITE_ECHO_AUTH_ENDPOINT ?? 'http://localhost:8000/broadcasting/auth',
                    {
                        socket_id: socketId,
                        channel_name: channel.name,
                    },
                    {
                        withCredentials: true, // odosielanie cookies
                    }
                )
                .then(response => {
                    console.log('[Echo] Auth success:', response.data);
                    callback(false, response.data);
                })
                .catch(error => {
                    console.error('[Echo] Auth error:', error.response ? error.response.data : error);
                    callback(true, error);
                });
            }
        };
    },
    // authorizer: (channel, options) => {
    // return {
    //     authorize: (socketId, callback) => {
    //         console.log('Authorizing channel:', channel.name, 'socketId:', socketId);
    //         axios.post(
    //             import.meta.env.VITE_ECHO_AUTH_ENDPOINT,
    //             { socket_id: socketId, channel_name: channel.name },
    //             { withCredentials: true }
    //         )
    //         .then(response => {
    //             console.log('Auth success:', response.data);
    //             callback(false, response.data);
    //         })
    //         .catch(error => {
    //             console.error('Auth error:', error);
    //             callback(true, error);
    //         });
    //     }
    // };
// },

});
window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('WebSocket connected');
});

window.Echo.connector.pusher.connection.bind('error', (err) => {
    console.error('WebSocket error:', err);
});

window.Echo.connector.pusher.connection.bind('disconnected', () => {
    console.log('WebSocket disconnected');
});

// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';
// import axios from 'axios';

// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_REVERB_APP_KEY ?? 'local',
//     cluster: import.meta.env.VITE_REVERB_APP_CLUSTER ?? 'mt1',
//     wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
//     wsPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
//     wssPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
//     authEndpoint: import.meta.env.VITE_ECHO_AUTH_ENDPOINT ?? '/broadcasting/auth',
//     enabledTransports: ['ws', 'wss'],
    
//     authorizer: (channel, options) => {
//         return {
//             authorize: (socketId, callback) => {
//                 console.log('--- Authorizing channel ---');
//                 console.log('Channel:', channel.name);
//                 console.log('Socket ID:', socketId);
//                 console.log('Window Origin:', window.location.origin);

//                 axios.post(
//                     import.meta.env.VITE_ECHO_AUTH_ENDPOINT ?? '/broadcasting/auth',
//                     { socket_id: socketId, channel_name: channel.name },
//                     { withCredentials: true }
//                 )
//                 .then(response => {
//                     console.log('Auth success:', response.data);
//                     callback(false, response.data);
//                 })
//                 .catch(error => {
//                     if (error.response) {
//                         console.error('Auth error response data:', error.response.data);
//                         console.error('Auth error response headers:', error.response.headers);
//                     } else {
//                         console.error('Auth error:', error.message);
//                     }
//                     callback(true, error);
//                 });
//             }
//         };
//     }
// });

// // Logovanie WebSocket statusov
// window.Echo.connector.pusher.connection.bind('connected', () => {
//     console.log('WebSocket connected');
// });

// window.Echo.connector.pusher.connection.bind('error', (err) => {
//     console.error('WebSocket error:', err);
// });

// window.Echo.connector.pusher.connection.bind('disconnected', () => {
//     console.log('WebSocket disconnected');
// });

