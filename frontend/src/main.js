import './broadcasting/echo';
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia'

import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';


window.axios = axios;


const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')

    
function setupViewportFix() {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  let lastVh = 0;
  let timeout;

  function updateVh(safe = false) {
    if (!mediaQuery.matches) return; // iba na mobile

    clearTimeout(timeout);

    const newVh = window.visualViewport?.height
      ? window.visualViewport.height * 0.01
      : window.innerHeight * 0.01;

    // Ak je rozdiel malý, neprepisuj hodnotu hneď
    if (!safe && Math.abs(newVh - lastVh) < 0.5) return;

    document.documentElement.style.setProperty('--vh', `${newVh}px`);
    lastVh = newVh;

    // Po malej pauze aktualizuj znova – Chrome potrebuje “dozrieť”
    timeout = setTimeout(() => updateVh(true), 300);
  }

  // reaguje na všetko: klávesnica, otočenie, resize
  window.visualViewport?.addEventListener('resize', () => updateVh());
  window.addEventListener('resize', () => updateVh());
  window.addEventListener('orientationchange', () => updateVh(true));

  updateVh(true);
}

setupViewportFix();

