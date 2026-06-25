/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically inject the JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    try {
      // Zustand persist middleware stores data in localStorage under 'identity-storage'
      const storageData = localStorage.getItem("identity-storage");
      if (storageData) {
        const parsed = JSON.parse(storageData);
        const token = parsed?.state?.token;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn("Failed to retrieve token for API request", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// We can also add a response interceptor here later for global 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Handle unauthorized (e.g., clear store, redirect to login)
      console.warn("Unauthorized API call detected");
    }
    return Promise.reject(error);
  },
);
