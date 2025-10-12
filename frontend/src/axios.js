import axios from "axios"
import router from "./router"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
})

const urlApi = import.meta.env.VITE_API_BASE_URL
console.log('urlApi',urlApi );


function getCookie(name) {
    const value = document.cookie;
    const parts = value.split(name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
}
axiosClient.interceptors.request.use(config => {
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  return config;
});

axiosClient.interceptors.response.use(
    response => response,
    error => {
        if(error.response && error.response.status === 401){
            router.push({ name: 'Login'})
        }
        return Promise.reject(error);
    }
)

export default axiosClient