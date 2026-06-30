/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../../i18n/config";
import { identityService } from "./identityService";
import type { IdentityState } from "./types";

import { useToastStore } from "../../components/ui/useToastStore";

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
              id: response.userId,
              email: response.email,
              name: response.name,
              roles: response.roles || [],
              avatarFileId: response.avatarFileId,
              phone: response.phone,
              taxId: response.taxId,
              preferredLanguage: response.preferredLanguage,
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.message || i18n.t("auth.loginError");
          set({ error: message, isLoading: false, isAuthenticated: false });
          useToastStore.getState().addToast(message, "error");
          throw error;
        }
      },

      register: async (request) => {
        set({ isLoading: true, error: null });
        try {
          const response = await identityService.register(request);
          set({
            user: {
              id: response.userId,
              email: response.email,
              name: response.name,
              roles: response.roles || [],
              avatarFileId: response.avatarFileId,
              phone: response.phone,
              taxId: response.taxId,
              preferredLanguage: response.preferredLanguage,
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.message || i18n.t("auth.registerError");
          set({ error: message, isLoading: false, isAuthenticated: false });
          useToastStore.getState().addToast(message, "error");
          throw error;
        }
      },

      updateProfile: async (request) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await identityService.updateUser(
            request.id,
            request,
          );
          set({
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              name: updatedUser.name,
              roles: updatedUser.roles || [],
              avatarFileId: updatedUser.avatarFileId,
              phone: updatedUser.phone,
              taxId: updatedUser.taxId,
              preferredLanguage: updatedUser.preferredLanguage,
            },
            isLoading: false,
          });
          useToastStore.getState().addToast(i18n.t("profile.success"), "success");
        } catch (error: any) {
          const message =
            error.response?.data?.message || i18n.t("auth.updateProfileError");
          set({ error: message, isLoading: false });
          useToastStore.getState().addToast(message, "error");
          throw error;
        }
      },

      uploadAvatar: async (userId, file) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await identityService.uploadAvatar(userId, file);
          set({
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              name: updatedUser.name,
              roles: updatedUser.roles || [],
              avatarFileId: updatedUser.avatarFileId,
              phone: updatedUser.phone,
              taxId: updatedUser.taxId,
              preferredLanguage: updatedUser.preferredLanguage,
            },
            isLoading: false,
          });
          useToastStore.getState().addToast(i18n.t("profile.uploadSuccess"), "success");
        } catch (error: any) {
          const message =
            error.response?.data?.message || i18n.t("profile.uploadError");
          set({ error: message, isLoading: false });
          useToastStore.getState().addToast(message, "error");
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

useIdentityStore.subscribe((state) => {
  const lang = state.user?.preferredLanguage || "en_US";
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
});

const initialLang =
  useIdentityStore.getState().user?.preferredLanguage || "en_US";
if (i18n.language !== initialLang) {
  i18n.changeLanguage(initialLang);
}
