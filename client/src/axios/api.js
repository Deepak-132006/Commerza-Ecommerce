import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

const api = axios.create({
  baseURL: BASE_URL,
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      // If another request is already refreshing,
      // wait for that request instead of creating another one.
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken,
          })
          .then((res) => {
            const newAccessToken = res.data.accessToken;

            if (!newAccessToken) {
              throw new Error("No access token returned");
            }

            localStorage.setItem("accessToken", newAccessToken);

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("role");

      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  }
);

export default api;