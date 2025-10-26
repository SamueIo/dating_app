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


function setInitialVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const viewport = window.visualViewport;

function adjustForKeyboard() {
  if (!viewport) return;

  viewport.addEventListener('resize', () => {
    const keyboardHeight = window.innerHeight - viewport.height;

    if (keyboardHeight > 150) { // predpoklad klávesnice
      document.body.style.transition = 'padding-bottom 0.25s ease';
      document.body.style.paddingBottom = `${keyboardHeight}px`;
    } else {
      document.body.style.paddingBottom = '0px';
    }
  });
}

adjustForKeyboard();


window.addEventListener('resize', setInitialVh);
setInitialVh();
