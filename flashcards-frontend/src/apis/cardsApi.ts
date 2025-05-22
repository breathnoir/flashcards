import axios from "axios";

const BASE_URL = import.meta.env.VITE_CARDS_SERVICE_URL;

const cardsApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

cardsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

cardsApi.interceptors.response.use(
  (resp) => resp,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export default cardsApi;
