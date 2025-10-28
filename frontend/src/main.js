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
function setDynamicVh() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    const vh = window.visualViewport?.height
      ? window.visualViewport.height * 0.01
      : window.innerHeight * 0.01;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
  } else {
    document.documentElement.style.removeProperty('--vh');
  }
}

window.addEventListener('resize', setDynamicVh);
window.addEventListener('orientationchange', setDynamicVh);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setDynamicVh);
}
setDynamicVh();
