/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number; // Optional custom duration in ms (0/Infinity means no auto-close)
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastState {
  toasts: ToastMessage[];
  addToast: (
    message: string,
    type: ToastMessage["type"],
    duration?: number,
    action?: ToastMessage["action"]
  ) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, message: string) => void;
}
