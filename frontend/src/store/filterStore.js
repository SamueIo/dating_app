import { defineStore } from "pinia"
import axiosClient from "../axios";

const defaultFilters = {
  gender: '',
  ageFrom: '',
  ageTo: '',
  location: '',
  latitude: null,   
  longitude: null,   
  radiusKm: '',
  heightFrom: '',
  heightTo: '',
  onlyOnline: false,
  withPhoto: false,
}

export const useFilterStore = defineStore('filters', {
  state: () => ({
    filters: { ...defaultFilters },
    loading: false,
    error: null,
    filtersLoaded: false,
  }),

  actions: {
    async fetchFilters(){
      if(this.filtersLoaded) return
      this.loading = true;
      this.error = null;
      
      try{
        const response = await axiosClient.get('/api/filters');
        const data = response.data?.data
        
        if (data == null) {
          this.filters = {...defaultFilters}
        }else{
          this.filters = {
           gender: data.gender || '',
           ageFrom: data.age_from || '',
           ageTo: data.age_to || '',
           location: data.location || '',
           latitude: data.latitude || '',  
           longitude: data.longitude || '', 
           radiusKm: data.radius_km || 0,
           heightFrom: data.height_from || '',
           heightTo: data.height_to || '',
           onlyOnline: data.only_online || false,
           withPhoto: data.with_photo || false,
         };
        }

          //  !! shortcut for converting value  into boolean 
          this.filtersLoaded = true ;
        
      }catch (err){
        console.log('Failed to load filters', err);
        throw err
      }finally{
        this.loading = false
      }
    },
    async saveFilters(){
      try{
        await axiosClient.post('/api/filters', this.filters);
      }catch (err){
        console.error('Failed to save filters', err)
      }
    },
    async setFilters(newFilters) {
      this.filters = {...this.filters, ...newFilters};
      await this.saveFilters();
    }
  }
})
