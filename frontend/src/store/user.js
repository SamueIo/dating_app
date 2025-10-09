import { defineStore } from "pinia";
import axiosClient from "../axios";

const useUserStore = defineStore("user",{
    state: () =>({
        user: null
    }),
    actions: {
        async fetchUser (){
            try{
                const response = await axiosClient.get("/api/user")
                this.user = response.data
            }catch (error){
                this.user = null
                console.error('fetchUser error:', error.response || error);
                throw error
            }
    
    
        }
    }
})

export default useUserStore;