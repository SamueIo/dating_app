import { defineStore } from "pinia";

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'dark',
    themes: {
        light: { bg: null, text: '#ffffff' }, // purple-500
        dark: { bg: '#5b21b6', text: '#ffffff' }   // purple-900
    }
  }),
  actions: {
    nextTheme() {
      const keys = Object.keys(this.themes); // správne: this.themes
      const index = keys.indexOf(this.currentTheme);
      this.currentTheme = keys[(index + 1) % keys.length];
    }
  }
});
