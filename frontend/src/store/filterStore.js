import { defineStore } from "pinia";
import axiosClient from "../axios";

/**
 * Default filter values for the dating app.
 */
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
};

/**
 * Filter Store
 * 
 * This store manages user search filters in the dating app.
 * Features include:
 * - storing and updating filter values
 * - loading filters from API
 * - saving filters to API
 * - tracking loading and error states
 */
export const useFilterStore = defineStore('filters', {
  
  /**
   * State of the filter store.
   */
  state: () => ({
    /** Current filter values */
    filters: { ...defaultFilters },

    /** Loading state for API requests */
    loading: false,

    /** Error information if request fails */
    error: null,

    /** Flag indicating whether filters have been loaded from the server */
    filtersLoaded: false,
  }),

  /**
   * Actions for manipulating filters
   */
  actions: {

    /**
     * Fetch filters from the API.
     * If filters are already loaded, this function will return immediately.
     */
    async fetchFilters() {
      if (this.filtersLoaded) return;

      this.loading = true;
      this.error = null;

      try {
        const response = await axiosClient.get('/api/filters');
        const data = response.data?.data;

        if (data == null) {
          this.filters = { ...defaultFilters };
        } else {
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
            onlyOnline: Boolean(data.only_online) || false,
            withPhoto: Boolean(data.with_photo) || false,
          };
        }

        // Mark filters as loaded
        this.filtersLoaded = true;

      } catch (err) {
        console.error('Failed to load filters', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Save current filters to the API.
     */
    async saveFilters() {
      try {
        await axiosClient.post('/api/filters', this.filters);
      } catch (err) {
        console.error('Failed to save filters', err);
      }
    },

    /**
     * Update filters in the store and immediately save them to the API.
     * @param {Object} newFilters - Partial filter object to merge with current filters
     */
    async setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
      await this.saveFilters();
    },
  },
});
