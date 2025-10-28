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
  let lastHeight = 0;
  let ticking = false;

  function updateVh(force = false) {
    if (!mediaQuery.matches) return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const newHeight = viewport.height;
    const diff = Math.abs(newHeight - lastHeight);

    // len ak sa výška zmenila o viac než pár pixelov
    if (force || diff > 5) {
      const vh = newHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      lastHeight = newHeight;
    }
  }

  function onViewportChange() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateVh();
        ticking = false;
      });
      ticking = true;
    }
  }

  const viewport = window.visualViewport;
  if (viewport) {
    viewport.addEventListener('resize', onViewportChange);
    viewport.addEventListener('scroll', onViewportChange); 
    // scroll zachytí aj posuny spôsobené návrhmi klávesnice
  }

  window.addEventListener('resize', () => updateVh(true));
  window.addEventListener('orientationchange', () => updateVh(true));

  updateVh(true);
}

setupViewportFix();

