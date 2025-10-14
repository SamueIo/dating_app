import './broadcasting/echo';
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia'

import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';
console.log('axios.defaults.baseURL',axios.defaults.baseURL);


window.axios = axios;


const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
