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

  let resizeTimeout;
  const baseHeight = window.innerHeight; // uložíme pôvodnú výšku pri načítaní

  function updateViewport() {
    // vezmeme aktuálnu výšku visualViewport (alebo fallback na innerHeight)
    const currentHeight = viewport.height || window.innerHeight;

    // ak sa výška zväčšila (napr. klávesnica sa zavrela), nepoužijeme menšiu hodnotu
    const targetHeight = Math.max(currentHeight, baseHeight);

    // prevedieme na 1% výšku a uložíme do CSS premennej
    const vh = targetHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  function handleViewportChange() {
    // oneskorenie kvôli Chrome animácii pri otváraní / zatváraní klávesnice
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateViewport, 300);
  }

  // počiatočné nastavenie
  updateViewport();

  // reaguj na zmeny výšky viewportu
  viewport.addEventListener('resize', handleViewportChange);
  viewport.addEventListener('scroll', handleViewportChange);
  window.addEventListener('resize', handleViewportChange);
}


setRealVh();
window.addEventListener('resize', setRealVh);