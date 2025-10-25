import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_REVERB_APP_KEY ?? 'local',
    cluster: import.meta.env.VITE_REVERB_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
    wsPort: import.meta.env.VITE_REVERB_WS_PORT ?? 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,

    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
    authEndpoint: import.meta.env.VITE_ECHO_AUTH_ENDPOINT ?? 'http://localhost:8000/broadcasting/auth',
    enabledTransports: ['ws', 'wss'],

    
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
                        withCredentials: true, // odosielanie cookies
                    }
                )
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    console.error('[Echo] Auth error:', error.response ? error.response.data : error);
                    callback(true, error);
                });
            }
        };
    },


});
