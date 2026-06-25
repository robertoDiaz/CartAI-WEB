/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IdentityState } from "./types";
import { identityService } from "./identityService";

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (request) => {
        set({ isLoading: true, error: null });
        try {
          const response = await identityService.login(request);
          set({
            user: {
              email: response.email,
              name: response.name,
              roles: response.roles || [],
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.message ||
            "Error al iniciar sesión. Verifica tus credenciales.";
          set({ error: message, isLoading: false, isAuthenticated: false });
          throw error;
        }
      },

      register: async (request) => {
        set({ isLoading: true, error: null });
        try {
          const response = await identityService.register(request);
          set({
            user: {
              email: response.email,
              name: response.name,
              roles: response.roles || [],
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Error al registrar la cuenta.";
          set({ error: message, isLoading: false, isAuthenticated: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "identity-storage", // This is the key used in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // Only persist these fields
    },
  ),
);
