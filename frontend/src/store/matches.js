
import { defineStore } from "pinia";
import axiosClient from "../axios";
import { useToast } from "vue-toastification";
import router from "../router";

export const useMatchesStore = defineStore('matches', {
    state: () => ({
        matches: [],
        loading: false,
        loaded: false
    }),

    actions: {
        async fetchMatches() {
            if(this.loaded) return

            this.loading = true
            try{
                const response = await axiosClient.get('/api/matches')
                this.matches = response.data
                this.loaded = true

            }catch (err){
                console.error('Failed to fetch matches', err)
            }finally{
                this.loading = false
            }
        },

        listenFroNewMatches(userId){
            const messages = [
                "It's a match! You both liked each other 💖",
                "Mutual attraction! 💘 Check your matches!",
                "💞 You both swiped right! Time to say hi!",
                "🔥 Sparks flew! You have a mutual match!",
                "💖 Someone likes you back! It's a match!"
            ];
            const toast = useToast();
            window.Echo.private(`userMatch${userId}`)
            .listen('.newMatch', (e) => {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                
            toast.success(randomMessage, { timeout: 5000,
                        pauseOnHover: true,  
                        toastClassName: 'custom-toast',
                        onClick: () => {
                        router.push({ path: 'Matches', query: { highlightMatch: true } });
        }
             });
                this.matches.push(e.match)
            });
        }
    }

})