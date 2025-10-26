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

  let keyboardOpen = false;

  function updateLayout() {
    // základná výška layoutu – nechceme fixovať na max, len na aktuálne okno bez klávesnice
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  function handleViewportChange() {
    const heightDiff = window.innerHeight - viewport.height;

    // ak je rozdiel väčší než 100px, predpokladáme otvorenú klávesnicu
    if (heightDiff > 100) {
      keyboardOpen = true;
      document.body.style.paddingBottom = `${heightDiff}px`; // posunie obsah nad klávesnicu
    } else if (keyboardOpen) {
      keyboardOpen = false;
      document.body.style.paddingBottom = '0px'; // po zavretí klávesnice odstránime padding
    }

    updateLayout();
  }

  viewport.addEventListener('resize', handleViewportChange);
  viewport.addEventListener('scroll', handleViewportChange);
  window.addEventListener('resize', handleViewportChange);

  updateLayout();
}
