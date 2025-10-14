import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const urlEcho = import.meta.env.VITE_ECHO_AUTH_ENDPOINT ?? 'http://localhost:8000/broadcasting/auth'
console.log('urlEcho',urlEcho);
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_REVERB_APP_KEY ?? 'local',
    cluster: import.meta.env.VITE_REVERB_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    authEndpoint: import.meta.env.VITE_ECHO_AUTH_ENDPOINT ?? 'http://localhost:8000/broadcasting/auth',
    enabledTransports: ['ws', 'wss'],

    // Tu pridávame authorizer pre axios s withCredentials: true
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post(
                    import.meta.env.VITE_ECHO_AUTH_ENDPOINT ?? 'http://localhost:8000/broadcasting/auth',
                    {
                        socket_id: socketId,
                        channel_name: channel.name,
                    },
                    {
                        withCredentials: true, // <---- TOTO je kľúčové pre odosielanie cookies
                    }
                )
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    callback(true, error);
                });
            }
        };
    },
});
