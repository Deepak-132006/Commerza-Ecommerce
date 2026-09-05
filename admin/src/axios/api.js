import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

const api = axios.create({
  baseURL: BASE_URL,
});

let refreshPromise = null;

// Attach admin access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only handle 401
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
      const refreshToken =
        localStorage.getItem("admin_refresh_token");

      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      // Prevent multiple simultaneous refresh requests
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken,
          })
          .then((res) => {
            const newAccessToken =
              res.data.accessToken;

            if (!newAccessToken) {
              throw new Error("No access token returned");
            }

            localStorage.setItem(
              "admin_access_token",
              newAccessToken
            );

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken =
        await refreshPromise;

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {

      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin_refresh_token");
      localStorage.removeItem("admin_user");

      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  }
);

export default api;