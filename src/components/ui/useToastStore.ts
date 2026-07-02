/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { create } from "zustand";
import type { ToastState } from "./models";

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, duration, action) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration, action }],
    }));
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  updateToast: (id, message) => {
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, message } : t)),
    }));
  },
}));
