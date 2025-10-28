import './broadcasting/echo';
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
window.axios = axios;

// 🔹 Vytvor si app najprv:
const app = createApp(App);
const pinia = createPinia();

// 🔹 Najprv registruj všetky pluginy
app.use(router);
app.use(pinia);
app.use(Toast, {
  position: "top-right",
  timeout: 4000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
});

// 🔹 A až potom mountuj!
app.mount('#app');

// 🔹 Potom všetky extra funkcie ako viewport fix
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
  }

  window.addEventListener('resize', () => updateVh(true));
  window.addEventListener('orientationchange', () => updateVh(true));

  updateVh(true);
}

setupViewportFix();
