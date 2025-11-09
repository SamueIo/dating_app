// Import Echo for real-time broadcasting
import './broadcasting/echo';

// Import Vue and necessary modules
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import axios from 'axios';

/**
 * Configure Axios globally
 * - `withCredentials` ensures cookies are sent with requests
 * - `baseURL` is taken from environment variable or defaults to localhost
 */
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
window.axios = axios;

// 🔹 Create Vue application instance
const app = createApp(App);

// 🔹 Create Pinia store instance
const pinia = createPinia();

// 🔹 Register plugins before mounting
app.use(router);
app.use(pinia);

// 🔹 Configure and use Vue Toastification for notifications
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

// 🔹 Mount Vue app
app.mount('#app');

/**
 * Setup viewport fix for mobile devices
 * 
 * Problem: 100vh on mobile devices can include browser chrome, causing layout issues.
 * This function dynamically calculates the actual viewport height and sets
 * a CSS variable `--vh` to be used in your styles.
 */
function setupViewportFix() {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  let lastHeight = 0;
  let ticking = false;

  // Update CSS variable --vh if viewport height changes
  function updateVh(force = false) {
    if (!mediaQuery.matches) return; // Only apply for mobile
    const viewport = window.visualViewport;
    if (!viewport) return;
    const newHeight = viewport.height;
    const diff = Math.abs(newHeight - lastHeight);

    if (force || diff > 5) {
      const vh = newHeight * 0.01; // 1% of viewport height
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      lastHeight = newHeight;
    }
  }

  // Throttled viewport update on resize or scroll
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

  // Force update on window resize or orientation change
  window.addEventListener('resize', () => updateVh(true));
  window.addEventListener('orientationchange', () => updateVh(true));

  // Initial calculation
  updateVh(true);
}

// Activate the viewport fix
setupViewportFix();
