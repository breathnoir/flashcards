import axios from "axios";

const BASE_URL = import.meta.env.VITE_USER_SERVICE_URL + "/api";

const userApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

userApi.interceptors.response.use(
  (resp) => resp,
  (err) => {
    if (err.response?.status === 401) {
      const pathNow = window.location.pathname;
      const reqPath = err.config?.url ?? "";

      const isLoginPage = pathNow.startsWith("/login");
      const isLoginCall = reqPath.includes("/auth/login");

      if (!isLoginPage && !isLoginCall) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.assign("/login");
      }
    }

    return Promise.reject(err);
  }
);

export default userApi;
