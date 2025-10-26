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


function setRealVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
}
function listenToViewportChanges() {
  const viewport = window.visualViewport;
  if (!viewport) return;

  function updateViewport() {
    const vh = viewport.height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  updateViewport(); // počiatočný výpočet
  viewport.addEventListener('resize', updateViewport);
  viewport.addEventListener('scroll', updateViewport); // Chrome to pri klávesnici robí tiež
}

setRealVh();
window.addEventListener('resize', setRealVh);