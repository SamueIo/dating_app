
import { defineStore } from "pinia";
import axiosClient from "../axios";

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
        }
    }
})